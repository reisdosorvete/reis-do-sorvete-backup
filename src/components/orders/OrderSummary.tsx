import { OrderItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  items: OrderItem[];
  className?: string;
}

export function OrderSummary({ items, className }: OrderSummaryProps) {
  const totalItems = items.reduce((acc, item) => acc + item.totalUnits, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.totalUnits * item.unitPrice), 0);
  
  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full text-muted-foreground", className)}>
        <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">Seu pedido está vazio</p>
        <p className="text-xs opacity-70 mt-1">Adicione produtos para ver o resumo</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1 -mx-5 px-5">
        <div className="space-y-4 pb-4">
          {items.map((item) => {
            const itemTotal = item.totalUnits * item.unitPrice;
            
            return (
              <div key={item.productId} className="flex justify-between items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground leading-snug break-words">
                    {item.productName}
                  </h4>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.boxes > 0 && <span className="mr-2">{item.boxes} cx</span>}
                    {item.isCrate && item.crates > 0 && <span className="mr-2">{item.crates} eng</span>}
                    {item.looseUnits > 0 && <span>{item.looseUnits} un</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-foreground">
                    {formatCurrency(itemTotal)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.totalUnits} un totais
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal ({totalItems} itens)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="py-2 flex gap-2 items-start">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-tight">
            O desconto deve ser aplicado manualmente na tela de geração do PDF após salvar o pedido.
          </p>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-center">
          <span className="text-base font-bold text-foreground">Total Bruto</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}