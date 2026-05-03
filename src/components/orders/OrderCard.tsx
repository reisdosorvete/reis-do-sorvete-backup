import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { STORE_NAMES } from '@/types';
import { Calendar, Package, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  criado: { label: 'Pendente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  separado: { label: 'Separado', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  entregue: { label: 'Entregue', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export function OrderCard({ order, onClick, className }: OrderCardProps) {
  const status = statusConfig[order.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <Badge variant="outline" className={cn('font-medium', status.className)}>
            {status.label}
          </Badge>
          <h3 className="font-semibold text-foreground truncate max-w-[150px]">
            {STORE_NAMES[order.store]}
          </h3>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {format(new Date(order.createdAt), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <Package className="h-3.5 w-3.5" />
          {order.items.length} itens
        </div>
      </div>
    </div>
  );
}