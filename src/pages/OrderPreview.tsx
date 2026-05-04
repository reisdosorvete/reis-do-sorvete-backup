import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, STORE_NAMES, OrderItem, STORE_INFO } from '@/types';
import { ArrowLeft, Download, FileText, Pencil, X, Building2, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateOrderPDF, PDFHeaderData } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';

const EMPTY_HEADER_DATA: PDFHeaderData = {
  companyName: '',
  cnpj: '',
  ie: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  cep: '',
  discount: 42,
  paymentMethod: '',
};

const PAYMENT_METHODS = [
  'Boleto',
  'Pix',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Dinheiro',
  'Transferência Bancária',
  'Cheque',
];

export default function OrderPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;
  
  // Puxando a função de apagar pedidos do nosso hook
  const { permanentDeleteOrder } = useOrders();

  const storeInfo = order ? STORE_INFO[order.store] : null;
  const [headerData, setHeaderData] = useState<PDFHeaderData>({
    ...EMPTY_HEADER_DATA,
    companyName: storeInfo?.companyName || '',
    cnpj: storeInfo?.cnpj || '',
  });
  const [isEditingHeader, setIsEditingHeader] = useState(true);

  useEffect(() => {
    if (!order) {
      navigate('/novo-pedido');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handleDownload = () => {
    if (!headerData.companyName || !headerData.cnpj || !headerData.paymentMethod) {
      toast.error('Preencha os campos obrigatórios: Nome da Empresa, CNPJ e Forma de Pagamento');
      return;
    }
    
    try {
      generateOrderPDF(order, headerData);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Ocorreu um erro ao gerar o PDF. Verifique os dados.');
    }
  };

  // Função para deletar o pedido
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este pedido? Esta ação não pode ser desfeita.')) {
      try {
        await permanentDeleteOrder(order.id);
        toast.success('Pedido apagado com sucesso!');
        navigate('/pedidos'); 
      } catch (error) {
      }
    }
  };

  const calculateItemTotal = (item: OrderItem) => {
    return item.totalUnits * item.unitPrice;
  };

  const calculateTotals = () => {
    const totalBoxes = order.items.reduce((sum, item) => sum + item.boxes, 0);
    const totalCrates = order.items.reduce((sum, item) => sum + (item.isCrate ? item.crates : 0), 0);
    const totalLooseUnits = order.items.reduce((sum, item) => sum + (item.looseUnits || 0), 0);
    const totalUnits = order.items.reduce((sum, item) => sum + item.totalUnits, 0);
    const subtotal = order.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    
    const discount = headerData.discount / 100;
    return {
      totalBoxes,
      totalCrates,
      totalLooseUnits,
      units: totalUnits,
      subtotal,
      totalWithDiscount: subtotal * (1 - discount),
    };
  };

  const totals = calculateTotals();

  return (
    <>
      <PageHeader
        title="Preview do Pedido"
        description={`Loja: ${STORE_NAMES[order.store]} • ${format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/pedidos')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          {/* BOTÃO DE APAGAR ADICIONADO */}
          <Button 
            variant="outline" 
            className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Apagar
          </Button>

          <Button 
            variant="outline" 
            className="gap-2 text-primary border-primary hover:bg-primary/10"
            onClick={() => navigate('/novo-pedido', { state: { store: order.store, editingOrderId: order.id } })}
          >
            <Pencil className="h-4 w-4" />
            Editar Pedido
          </Button>

          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </PageHeader>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header Editor Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Cabeçalho do Relatório</CardTitle>
                  <p className="text-sm text-muted-foreground">Preencha os dados que aparecerão no PDF</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingHeader(!isEditingHeader)}
                className="gap-2"
              >
                {isEditingHeader ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {isEditingHeader ? 'Minimizar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>

          {isEditingHeader && (
            <CardContent className="pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Company Info Section */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Building2 className="h-4 w-4" />
                    Dados da Empresa
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa *</Label>
                      <Input
                        id="companyName"
                        placeholder="Razão Social"
                        value={headerData.companyName}
                        onChange={(e) => setHeaderData({ ...headerData, companyName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        value={headerData.cnpj}
                        onChange={(e) => setHeaderData({ ...headerData, cnpj: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ie">Inscrição Estadual</Label>
                      <Input
                        id="ie"
                        placeholder="000.000.000"
                        value={headerData.ie}
                        onChange={(e) => setHeaderData({ ...headerData, ie: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(00) 0000-0000"
                        value={headerData.phone}
                        onChange={(e) => setHeaderData({ ...headerData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@empresa.com"
                        value={headerData.email}
                        onChange={(e) => setHeaderData({ ...headerData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        placeholder="Rua, Número - Bairro"
                        value={headerData.address}
                        onChange={(e) => setHeaderData({ ...headerData, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade - UF</Label>
                      <Input
                        id="city"
                        placeholder="Cidade - UF"
                        value={headerData.city}
                        onChange={(e) => setHeaderData({ ...headerData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        placeholder="00.000-000"
                        value={headerData.cep}
                        onChange={(e) => setHeaderData({ ...headerData, cep: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section - Full width */}
                <div className="space-y-4 lg:col-span-3 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={headerData.discount}
                        onChange={(e) => setHeaderData({ ...headerData, discount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                      <Select
                        value={headerData.paymentMethod}
                        onValueChange={(value) => setHeaderData({ ...headerData, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {!isEditingHeader && headerData.companyName && (
            <CardContent className="pt-0">
              <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
                <p><span className="font-semibold text-foreground">{headerData.companyName}</span></p>
                <p>CNPJ: {headerData.cnpj} | Inscrição Estadual: {headerData.ie || '-'}</p>
                <p>Tel: {headerData.phone || '-'} | {headerData.email || '-'}</p>
                <p>{headerData.address}, {headerData.city} - CEP: {headerData.cep}</p>
                <p className="pt-2"><strong>Desconto:</strong> {headerData.discount}% | <strong>Pagamento:</strong> {headerData.paymentMethod}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Order Preview Table */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="text-lg">Itens do Pedido</CardTitle>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="w-[5%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">#</th>
                  <th className="w-[9%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">CÓDIGO</th>
                  <th className="w-[24%] px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">PRODUTO</th>
                  <th className="w-[9%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">ENGRADADOS</th>
                  <th className="w-[9%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">CAIXAS</th>
                  <th className="w-[9%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">AVULSO</th>
                  <th className="w-[10%] px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">TOTAL UN</th>
                  <th className="w-[12%] pl-3 pr-6 py-3 text-right text-xs font-semibold whitespace-nowrap">VALOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item, index) => {
                  const hasLoose = (item.looseUnits || 0) > 0;
                  const hasCrates = item.isCrate && item.crates > 0;
                  const occurrences = [
                    item.boxes > 0 ? `${item.boxes} cx` : null,
                    hasCrates ? `${item.crates} eng` : null,
                    hasLoose ? `${item.looseUnits} un` : null,
                  ].filter(Boolean).join(', ');
                  return (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="px-2 py-2 text-center text-xs text-muted-foreground whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 py-2 text-center text-xs font-mono text-muted-foreground whitespace-nowrap">{item.productCode || '-'}</td>
                    <td className="px-2 py-2 text-left text-xs truncate">{item.productName}</td>
                    <td className="px-2 py-2 text-center text-xs font-medium whitespace-nowrap">
                      {(item.isCrate && item.crates > 0) ? formatNumber(item.crates) : '-'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-medium whitespace-nowrap">
                      {item.boxes > 0 ? formatNumber(item.boxes) : '-'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-medium whitespace-nowrap">
                      {(item.looseUnits || 0) > 0 ? formatNumber(item.looseUnits!) : '-'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs font-medium whitespace-nowrap">{formatNumber(item.totalUnits)}</td>
                    <td className="pl-2 pr-6 py-2 text-right text-xs font-semibold whitespace-nowrap">
                      {formatCurrency(calculateItemTotal(item))}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-muted/50">
                <tr className="font-semibold">
                  <td className="px-2 py-3" colSpan={2}></td>
                  <td className="px-2 py-3 text-left text-xs font-bold whitespace-nowrap">SUBTOTAL</td>
                  <td className="px-2 py-3 text-center text-xs font-semibold whitespace-nowrap">
                    {totals.totalCrates > 0 ? formatNumber(totals.totalCrates) : '-'}
                  </td>
                  <td className="px-2 py-3 text-center text-xs font-semibold whitespace-nowrap">
                    {totals.totalBoxes > 0 ? formatNumber(totals.totalBoxes) : '-'}
                  </td>
                  <td className="px-2 py-3 text-center text-xs font-semibold whitespace-nowrap">
                    {totals.totalLooseUnits > 0 ? formatNumber(totals.totalLooseUnits) : '-'}
                  </td>
                  <td className="px-2 py-3 text-center text-xs whitespace-nowrap">{formatNumber(totals.units)}</td>
                  <td className="pl-2 pr-6 py-3 text-right text-sm font-bold whitespace-nowrap">{formatCurrency(totals.subtotal)}</td>
                </tr>
                <tr className="font-bold bg-success/5">
                  <td className="px-2 py-3" colSpan={2}></td>
                  <td className="px-2 py-3 text-left text-xs text-success whitespace-nowrap">TOTAL ({headerData.discount}% desconto)</td>
                  <td className="px-2 py-3" colSpan={4}></td>
                  <td className="pl-2 pr-6 py-3 text-right text-sm text-success whitespace-nowrap">{formatCurrency(totals.totalWithDiscount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Footer Info */}
        <Card className="border-border shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Desconto aplicado:</span>
                <span className="ml-2 font-semibold">{headerData.discount}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Forma de Pagamento:</span>
                <span className="ml-2 font-semibold">{headerData.paymentMethod || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Criado por:</span>
                <span className="ml-2 font-semibold">{order.createdBy}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}