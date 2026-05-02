import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/contexts/AppContext';
import { History as HistoryIcon, Clock, Package, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatNumber } from '@/lib/utils';
import { STORE_NAMES } from '@/types';

export default function History() {
  const { orders } = useApp();
  const deliveredOrders = orders.filter(o => o.status === 'entregue')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <PageHeader 
        title="Histórico" 
        description="Registro de pedidos entregues e finalizados"
      />

      <div className="p-6">
        {deliveredOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">Nenhuma entrega registrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pedidos aparecerão aqui após serem marcados como entregues</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveredOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">ENTREGUE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{STORE_NAMES[order.store]}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{order.items.length} itens • {formatNumber(order.totalBoxes)} caixas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}