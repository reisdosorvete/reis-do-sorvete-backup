import { PageHeader } from '@/components/layout/PageHeader';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useState } from 'react';
import { STORE_NAMES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, ArrowRight } from 'lucide-react';
import { ProductRow } from '@/components/orders/ProductRow';
import { useNavigate } from 'react-router-dom';

export default function NewOrder() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<keyof typeof STORE_NAMES | ''>('');
  const navigate = useNavigate();

  const filteredProducts = products.filter(p => 
    p.active && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Novo Pedido" description="Selecione os produtos para carregar">
        <Button 
          disabled={!selectedStore}
          onClick={() => navigate('/pedido-revisao')}
          className="gap-2"
        >
          Revisar <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecione a Loja</label>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm"
            >
              <option value="">Selecione...</option>
              {Object.entries(STORE_NAMES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar Produto</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9 bg-card" 
                placeholder="Nome do produto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}