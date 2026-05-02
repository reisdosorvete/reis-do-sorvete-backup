import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { ProductRow } from '@/components/orders/ProductRow';
import { ProductRowDual } from '@/components/orders/ProductRowDual';
import { OrderSummary } from '@/components/orders/OrderSummary';
import { useProducts } from '@/hooks/useProducts';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Store, STORE_NAMES, CATEGORY_NAMES, OrderItem, isDualSaleCategory, isCrateSaleCategory } from '@/types';
import { ProductRowCrate } from '@/components/orders/ProductRowCrate';
import { Search, ArrowLeft, ArrowRight, Filter, ClipboardCheck, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface LocationState {
  store: Store;
  boxQuantities: Record<string, number>;
  looseQuantities?: Record<string, number>;
  crateQuantities?: Record<string, number>;
  editingOrderId?: string;
}

export default function OrderReview() {
  const { products } = useProducts();
  const { addOrder, deleteOrder } = useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const editingOrderId = state?.editingOrderId;
  const isEditing = !!editingOrderId;

  const [boxQuantities, setBoxQuantities] = useState<Record<string, number>>(state?.boxQuantities || {});
  const [looseQuantities, setLooseQuantities] = useState<Record<string, number>>(state?.looseQuantities || {});
  const [crateQuantities, setCrateQuantities] = useState<Record<string, number>>(state?.crateQuantities || {});
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const selectedStore = state?.store;
  const activeProducts = products.filter((p) => p.active);

  const filteredProducts = useMemo(() => {
    let filtered = activeProducts;
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    return filtered;
  }, [activeProducts, search, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(activeProducts.map((p) => p.category));
    return Array.from(cats);
  }, [activeProducts]);

  const orderItems: OrderItem[] = useMemo(() => {
    const productIds = new Set<string>();
    Object.entries(boxQuantities).forEach(([id, v]) => { if (v > 0) productIds.add(id); });
    Object.entries(looseQuantities).forEach(([id, v]) => { if (v > 0) productIds.add(id); });
    Object.entries(crateQuantities).forEach(([id, v]) => { if (v > 0) productIds.add(id); });

    const items: OrderItem[] = [];
    productIds.forEach((productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const boxes = boxQuantities[productId] || 0;
      const loose = looseQuantities[productId] || 0;
      const crateCount = crateQuantities[productId] || 0;
      const isCrate = crateCount > 0;

      const boxUnits = boxes * product.unitsPerBox;
      const crateUnits = crateCount * product.unitsPerCrate;
      const totalUnits = boxUnits + crateUnits + loose;
      const crates = isCrate ? crateCount : Math.floor(boxes / product.boxesPerCrate);
      const remainingBoxes = isCrate ? 0 : boxes % product.boxesPerCrate;

      items.push({
        productId,
        productName: product.name,
        productCode: product.code,
        unitsPerBox: product.unitsPerBox,
        boxesPerCrate: product.boxesPerCrate,
        unitsPerCrate: product.unitsPerCrate,
        unitPrice: product.unitPrice,
        boxes,
        totalUnits,
        crates,
        remainingBoxes,
        looseUnits: loose,
        isCrate,
      });
    });

    return items;
  }, [boxQuantities, looseQuantities, crateQuantities, products]);

  const operatorName = profile?.name || profile?.email || 'Sistema';

  const handleSaveOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

    try {
      if (isEditing && editingOrderId) {
        await deleteOrder(editingOrderId);
      }

      const allItems: { productId: string; boxes: number; isLoose?: boolean; isCrate?: boolean }[] = [];
      Object.entries(boxQuantities).forEach(([productId, boxes]) => {
        if (boxes > 0) allItems.push({ productId, boxes, isLoose: false, isCrate: false });
      });
      Object.entries(looseQuantities).forEach(([productId, units]) => {
        if (units > 0) allItems.push({ productId, boxes: units, isLoose: true, isCrate: false });
      });
      Object.entries(crateQuantities).forEach(([productId, crates]) => {
        if (crates > 0) allItems.push({ productId, boxes: crates, isLoose: false, isCrate: true });
      });

      await addOrder(selectedStore, allItems, operatorName, products);
      
      toast.success(isEditing ? 'Pedido atualizado com sucesso!' : 'Pedido salvo com sucesso!');
      navigate('/pedidos');

    } catch (error) {
      console.error("Erro ao tentar salvar ou editar o pedido:", error);
      toast.error('Ocorreu um erro ao comunicar com o servidor. Tente novamente.');
    }
  };

  const selectedProducts = activeProducts.filter(
    (p) => (boxQuantities[p.id] && boxQuantities[p.id] > 0) || 
           (looseQuantities[p.id] && looseQuantities[p.id] > 0) ||
           (crateQuantities[p.id] && crateQuantities[p.id] > 0)
  );

  const unselectedProducts = filteredProducts.filter(
    (p) => (!boxQuantities[p.id] || boxQuantities[p.id] === 0) && 
           (!looseQuantities[p.id] || looseQuantities[p.id] === 0) &&
           (!crateQuantities[p.id] || crateQuantities[p.id] === 0)
  );

  useEffect(() => {
    if (!selectedStore) {
      navigate('/novo-pedido');
    }
  }, [selectedStore, navigate]);

  if (!selectedStore) return null;

  const handleBoxesChange = (productId: string, newBoxes: number) => {
    setBoxQuantities(prev => {
      const updated = { ...prev };
      if (newBoxes <= 0) delete updated[productId];
      else updated[productId] = newBoxes;
      return updated;
    });
  };

  const handleLooseUnitsChange = (productId: string, newUnits: number) => {
    setLooseQuantities(prev => {
      const updated = { ...prev };
      if (newUnits <= 0) delete updated[productId];
      else updated[productId] = newUnits;
      return updated;
    });
  };

  const handleCratesChange = (productId: string, newCrates: number) => {
    setCrateQuantities(prev => {
      const updated = { ...prev };
      if (newCrates <= 0) delete updated[productId];
      else updated[productId] = newCrates;
      return updated;
    });
  };

  const handleGoBack = () => navigate('/pedidos');

  return (
    <>
      <PageHeader
        title={isEditing ? "Editar Pedido" : "Revisar Pedido"}
        description={`${STORE_NAMES[selectedStore]} • Operador: ${operatorName}`}
      >
        <Button variant="outline" onClick={handleGoBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar e Editar
        </Button>
      </PageHeader>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Revise seu pedido</h2>
                  <p className="text-sm text-muted-foreground">Edite quantidades, adicione ou remova produtos antes de finalizar</p>
                </div>
              </div>

              <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
                  <DialogHeader><DialogTitle>Adicionar Produtos</DialogTitle></DialogHeader>
                  <div className="space-y-3 pt-2">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Buscar produto ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
                    </div>
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-1">
                        <Button variant={selectedCategory === null ? 'default' : 'outline'} size="sm" className="h-8 shrink-0 rounded-full" onClick={() => setSelectedCategory(null)}>
                          <Filter className="h-3.5 w-3.5 mr-1.5" /> Todos
                        </Button>
                        {categories.map((cat) => (
                          <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} size="sm" className="h-8 shrink-0 rounded-full" onClick={() => setSelectedCategory(cat)}>
                            {CATEGORY_NAMES[cat] || cat}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.map((product) => {
                        if (isCrateSaleCategory(product.category)) return <ProductRowCrate key={product.id} product={product} crates={crateQuantities[product.id] || 0} looseUnits={looseQuantities[product.id] || 0} onCratesChange={(c) => handleCratesChange(product.id, c)} onLooseUnitsChange={(u) => handleLooseUnitsChange(product.id, u)} />;
                        if (isDualSaleCategory(product.category)) return <ProductRowDual key={product.id} product={product} boxes={boxQuantities[product.id] || 0} looseUnits={looseQuantities[product.id] || 0} onBoxesChange={(b) => handleBoxesChange(product.id, b)} onLooseUnitsChange={(u) => handleLooseUnitsChange(product.id, u)} />;
                        return <ProductRow key={product.id} product={product} boxes={boxQuantities[product.id] || 0} onBoxesChange={(b) => handleBoxesChange(product.id, b)} />;
                      })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {selectedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ClipboardCheck className="h-16 w-16 mb-4 opacity-10" />
                <p>Nenhum produto selecionado para este pedido.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedProducts.map((product) => {
                  if (isCrateSaleCategory(product.category)) return <ProductRowCrate key={product.id} product={product} crates={crateQuantities[product.id] || 0} looseUnits={looseQuantities[product.id] || 0} onCratesChange={(c) => handleCratesChange(product.id, c)} onLooseUnitsChange={(u) => handleLooseUnitsChange(product.id, u)} />;
                  if (isDualSaleCategory(product.category)) return <ProductRowDual key={product.id} product={product} boxes={boxQuantities[product.id] || 0} looseUnits={looseQuantities[product.id] || 0} onBoxesChange={(b) => handleBoxesChange(product.id, b)} onLooseUnitsChange={(u) => handleLooseUnitsChange(product.id, u)} />;
                  return <ProductRow key={product.id} product={product} boxes={boxQuantities[product.id] || 0} onBoxesChange={(b) => handleBoxesChange(product.id, b)} />;
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="w-96 border-l border-border bg-card flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-lg">Resumo do Pedido</h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <OrderSummary items={orderItems} />
          </div>
          <div className="p-6 border-t border-border bg-muted/30">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full h-12 text-base font-bold gap-2" disabled={orderItems.length === 0}>
                  Finalizar Pedido
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Finalizar este pedido?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O pedido será salvo no sistema para a loja {STORE_NAMES[selectedStore]}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Revisar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSaveOrder}>Confirmar e Salvar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
}
