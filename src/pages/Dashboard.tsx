import { PageHeader } from '@/components/layout/PageHeader';
import { OrderCard } from '@/components/orders/OrderCard';
import { useApp } from '@/contexts/AppContext';
import { useProducts } from '@/hooks/useProducts';
import { STORE_NAMES } from '@/types';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const { orders, ordersLoading } = useApp();
  const { products } = useProducts();
  const navigate = useNavigate();

  // Lógica de Filtros e Cálculos
  const pendingOrders = orders.filter((o) => o.status === 'criado');
  const separatedOrders = orders.filter((o) => o.status === 'separado');
  const deliveredOrders = orders.filter((o) => o.status === 'entregue');
  
  const deliveredCount = deliveredOrders.filter((o) => {
    const today = new Date();
    const deliveredDate = o.deliveredAt ? new Date(o.deliveredAt) : null;
    return deliveredDate?.toDateString() === today.toDateString();
  }).length;

  const totalBoxes = orders.reduce((sum, o) => sum + (o.totalBoxes || 0), 0);
  const totalCrates = orders.reduce((sum, o) => sum + (o.totalCrates || 0), 0);
  const totalValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const ordersByStore = Object.keys(STORE_NAMES).map((store) => ({
    store: store as keyof typeof STORE_NAMES,
    name: STORE_NAMES[store as keyof typeof STORE_NAMES],
    count: orders.filter((o) => o.store === store && o.status !== 'entregue').length,
    pending: orders.filter((o) => o.store === store && o.status === 'criado').length,
  }));

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do sistema de pedidos"
      >
        <Button onClick={() => navigate('/novo-pedido')} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Novo Pedido
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        {ordersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pedidos Pendentes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Pedidos Pendentes</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(pendingOrders.length)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Aguardando separação</p>
            </div>
            <div className="rounded-full p-2 bg-amber-50 text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          {/* Em Separação */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Em Separação</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(separatedOrders.length)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Prontos para entrega</p>
            </div>
            <div className="rounded-full p-2 bg-blue-50 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </div>

          {/* Entregues Hoje */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Entregues Hoje</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(deliveredCount)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Concluídos hoje</p>
            </div>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          {/* Total de Caixas */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total de Caixas</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(totalBoxes)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Volume total (caixas)</p>
            </div>
            <div className="rounded-full p-2 bg-slate-50 text-slate-500">
              <Box className="h-5 w-5" />
            </div>
          </div>

          {/* Total Engradados */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Engradados</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{formatNumber(totalCrates)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Volume total (engradados)</p>
            </div>
            <div className="rounded-full p-2 bg-blue-50 text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>

          {/* Valor Total */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Valor Total</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Faturamento bruto</p>
            </div>
            <div className="rounded-full p-2 bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Pedidos Recentes</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/pedidos')} className="gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.slice(0, 4).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => navigate('/pedido-preview', { state: { order } })}
                />
              ))}
            </div>
          </div>

          {/* Coluna Lateral: Lojas e Produtos */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Lojas</h2>
            <div className="space-y-3">
              {ordersByStore.map((store) => (
                <div
                  key={store.store}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-soft"
                >
                  <div>
                    <p className="font-medium text-foreground">{store.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {store.count > 0 ? `${formatNumber(store.count)} pedido(s) ativos` : 'Sem pedidos ativos'}
                    </p>
                  </div>
                  {store.pending > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-[10px] font-bold text-warning border border-warning/20">
                      {store.pending}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Card de Produtos Ativos com Barra de Progresso */}
            <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
              <h3 className="font-semibold text-foreground text-sm mb-4">Produtos Ativos</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-primary">
                  {formatNumber(products.filter((p) => p.active).length)}
                </p>
                <p className="text-xs text-muted-foreground">ativos</p>
              </div>
              <div className="mt-4 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(products.filter(p => p.active).length / (products.length || 1)) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground uppercase font-medium">
                de {formatNumber(products.length)} cadastrados
              </p>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </>
  );
}