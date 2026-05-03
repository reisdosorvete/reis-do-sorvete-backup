import { useState, useMemo, useCallback, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductRow } from '@/components/orders/ProductRow';
import { ProductRowDual } from '@/components/orders/ProductRowDual';
import { ProductRowCrate } from '@/components/orders/ProductRowCrate';
import { OrderSummary } from '@/components/orders/OrderSummary';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Store, STORE_NAMES, CATEGORY_NAMES, OrderItem, isDualSaleCategory, isCrateSaleCategory } from '@/types';
import { Search, MapPin, ArrowRight, ArrowLeft, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function NewOrder() {
  const { products } = useProducts();
  const { orders } = useOrders(); // Necessário para buscar os dados do pedido sendo editado
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Pega o ID do pedido caso o usuário tenha clicado em "Editar"
  const editingOrderId = location.state?.editingOrderId;

  // Usa a loja do pedido sendo editado ou a loja da URL
  const initialStore = location.state?.store || (searchParams.get('loja') as Store | null);
  const selectedStore = initialStore && STORE_NAMES[initialStore] ? initialStore : null;

  const setSelectedStore = useCallback((store: Store | null) => {
    if (store) {
      setSearchParams({ loja: store }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [setSearchParams]);

  const [search, setSearch] = useState('');
  const [boxQuantities, setBoxQuantities] = useState<Record<string, number>>({});
  const [looseQuantities, setLooseQuantities] = useState<Record<string, number>>({});
  const [crateQuantities, setCrateQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // EFEITO MÁGICO: Preenche as quantidades se estivermos editando um pedido
  useEffect(() => {
    if (editingOrderId && orders.length > 0) {
      const orderToEdit = orders.find(o => o.id === editingOrderId);
      if (orderToEdit) {
        const newBoxes: Record<string, number> = {};
        const newLoose: Record<string, number> = {};
        const newCrates: Record<string, number> = {};

        orderToEdit.items.forEach(item => {
          if (item.boxes > 0) newBoxes[item.productId] = item.boxes;
          if (item.looseUnits > 0) newLoose[item.productId] = item.looseUnits;
          if (item.crates > 0) newCrates[item.productId] = item.crates;
        });

        setBoxQuantities(newBoxes);
        setLooseQuantities(newLoose);
        setCrateQuantities(newCrates);
      }
    }
  }, [editingOrderId, orders]);

  const activeProducts = products.filter((p) => p.active);

  const filteredProducts = useMemo(() => {
    let filtered = activeProducts;
    
    if (search) {
      filtered = filtered.filter((p) =>
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

  const handleBoxesChange = (productId: string, boxes: number) => {
    setBoxQuantities((prev) => ({
      ...prev,
      [productId]: boxes,
    }));
  };

   const handleLooseUnitsChange = (productId: string, units: number) => {
     setLooseQuantities((prev) => ({
       ...prev,
       [productId]: units,
     }));
   };
 
  const handleCratesChange = (productId: string, crates: number) => {
    setCrateQuantities((prev) => ({
      ...prev,
      [productId]: crates,
    }));
  };

  const operatorName = profile?.name || profile?.email || 'Sistema';

   const handleContinueToReview = () => {
    if (!selectedStore) {
      toast.error('Selecione uma loja');
      return;
    }
    
    if (orderItems.length === 0) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

     navigate('/pedido-review', {
       state: {
         store: selectedStore,
         boxQuantities,
         looseQuantities,
         crateQuantities,
         editingOrderId // Passando a informação para a tela de revisão sobrescrever o pedido!
       },
     });
  };

  if (!selectedStore) {
    return (
      <>
        <PageHeader 
          title="Novo Pedido" 
          description="Selecione a loja para iniciar o pedido"
        />
        
        <div className="p-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Qual loja você deseja abastecer?</h2>
                <p className="text-sm text-muted-foreground">Escolha a loja para começar a montar o pedido</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(STORE_NAMES) as [Store, string][]).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStore(key)}
                  className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Clique para selecionar</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={editingOrderId ? `Editando Pedido - ${STORE_NAMES[selectedStore]}` : `Pedido - ${STORE_NAMES[selectedStore]}`}
        description={`Operador: ${operatorName}`}
      >
        <Button variant="outline" onClick={() => setSelectedStore(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 space-y-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produto ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            
            <ScrollArea className="w-full" type="always">
              <div className="flex gap-2 pb-5 w-max">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 shrink-0 rounded-full"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Todos
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 shrink-0 rounded-full"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {CATEGORY_NAMES[cat] || cat}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
               {filteredProducts.map((product) => {
                 if (isCrateSaleCategory(product.category)) {
                   return (
                     <ProductRowCrate
                       key={product.id}
                       product={product}
                       crates={crateQuantities[product.id] || 0}
                       looseUnits={looseQuantities[product.id] || 0}
                       onCratesChange={(crates) => handleCratesChange(product.id, crates)}
                       onLooseUnitsChange={(units) => handleLooseUnitsChange(product.id, units)}
                     />
                   );
                 }
                 if (isDualSaleCategory(product.category)) {
                   return (
                     <ProductRowDual
                       key={product.id}
                       product={product}
                       boxes={boxQuantities[product.id] || 0}
                       looseUnits={looseQuantities[product.id] || 0}
                       onBoxesChange={(boxes) => handleBoxesChange(product.id, boxes)}
                       onLooseUnitsChange={(units) => handleLooseUnitsChange(product.id, units)}
                     />
                   );
                 }
                 return (
                   <ProductRow
                     key={product.id}
                     product={product}
                     boxes={boxQuantities[product.id] || 0}
                     looseUnits={looseQuantities[product.id] || 0}
                     onBoxesChange={(boxes) => handleBoxesChange(product.id, boxes)}
                     onLooseUnitsChange={(units) => handleLooseUnitsChange(product.id, units)}
                   />
                 );
               })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Tente buscar por outro termo</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-[380px] border-l border-border bg-card/50 flex flex-col shrink-0">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-lg text-foreground">Resumo do Pedido</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{STORE_NAMES[selectedStore]}</p>
          </div>
          
          <div className="flex-1 overflow-hidden p-5">
            <OrderSummary items={orderItems} className="h-full" />
          </div>
          
          <div className="p-5 border-t border-border bg-background">
            <Button
               onClick={handleContinueToReview}
              disabled={orderItems.length === 0}
              className="w-full h-12 font-semibold text-base gap-2 rounded-xl"
              size="lg"
            >
               Revisar Pedido
               <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}