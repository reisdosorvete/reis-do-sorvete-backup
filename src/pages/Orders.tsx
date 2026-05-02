import { PageHeader } from '@/components/layout/PageHeader';
import { OrderCard } from '@/components/orders/OrderCard';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Orders() {
  const { orders, ordersLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.store.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Pedidos" description="Gerencie todos os pedidos do sistema" />

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar pedidos..." 
              className="pl-9 bg-card border-border/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="bg-card">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {ordersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">Nenhum pedido encontrado</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onClick={() => navigate('/pedido-preview', { state: { order } })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}