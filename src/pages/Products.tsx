import { PageHeader } from '@/components/layout/PageHeader';
import { useProducts } from '@/hooks/useProducts';
import { useState, useEffect } from 'react';
import { Search, Plus, Package, Box, Truck, Edit2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Product, ProductCategory, CATEGORY_NAMES } from '@/types';
import { toast } from 'sonner';

export default function Products() {
  const { products, productsLoading, updateProduct, addProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleNewClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      code: '',
      category: 'picoles',
      unitsPerBox: 1,
      boxesPerCrate: 1,
      unitsPerCrate: 1,
      unitPrice: 0,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct && updateProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success('Produto atualizado com sucesso!');
      } else if (!editingProduct && addProduct) {
        await addProduct(formData as Omit<Product, 'id' | 'createdAt'>);
        toast.success('Produto criado com sucesso!');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  return (
    <>
      <PageHeader title="Produtos" description="Catálogo de produtos Eskimó">
        <Button onClick={handleNewClick} className="gap-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou código..." 
            className="pl-10 bg-card border-border/50 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {productsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
                      <Package className="h-6 w-6" />
                    </div>
                    {product.code && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                        {product.code}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                        {CATEGORY_NAMES[product.category] || product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Box className="h-3.5 w-3.5 text-slate-400" />
                        <span>{product.unitsPerBox} un/cx</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        <span>{product.boxesPerCrate} cx/eng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-slate-900 text-lg leading-none">
                      {formatCurrency(product.unitPrice)}
                    </p>
                    <Badge 
                      variant={product.active ? "success" : "secondary"} 
                      className={product.active ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-2 py-0.5 text-[10px] font-bold" : "px-2 py-0.5 text-[10px] font-bold"}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => handleEditClick(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label>Nome do Produto</Label>
                <Input 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Picolé de Morango"
                />
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input 
                  value={formData.code || ''} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Ex: 123"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val: ProductCategory) => setFormData({...formData, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preço Unitário (R$)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.unitPrice || ''} 
                  onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Unid. por Caixa</Label>
                <Input 
                  type="number"
                  value={formData.unitsPerBox || ''} 
                  onChange={(e) => setFormData({...formData, unitsPerBox: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Caixas por Eng.</Label>
                <Input 
                  type="number"
                  value={formData.boxesPerCrate || ''} 
                  onChange={(e) => setFormData({...formData, boxesPerCrate: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Unid. por Eng.</Label>
                <Input 
                  type="number"
                  value={formData.unitsPerCrate || ''} 
                  onChange={(e) => setFormData({...formData, unitsPerCrate: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 p-4 border rounded-xl bg-muted/20">
              <div className="space-y-0.5">
                <Label>Status do Produto</Label>
                <p className="text-xs text-muted-foreground">Produtos inativos não aparecem na listagem de pedidos.</p>
              </div>
              <Switch 
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}