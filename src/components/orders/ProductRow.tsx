import { cn, formatCurrency } from '@/lib/utils';
import { Product, CATEGORY_NAMES } from '@/types';
import { Input } from '@/components/ui/input';

interface ProductRowProps {
  product: Product;
  boxes: number;
  looseUnits?: number;
  onBoxesChange: (boxes: number) => void;
  onLooseUnitsChange?: (units: number) => void;
  className?: string;
}

export function ProductRow({
  product,
  boxes = 0,
  looseUnits = 0, 
  onBoxesChange,
  onLooseUnitsChange,
  className,
}: ProductRowProps) {
  const boxPrice = product.unitsPerBox * product.unitPrice;
  const itemTotal = (boxes * boxPrice) + (looseUnits * product.unitPrice);
  const hasSelection = boxes > 0 || looseUnits > 0;

  // Mostra o total de unidades com base nas caixas e avulsos
  const totalUnitsCalculated = (boxes * product.unitsPerBox) + looseUnits;

  const handleInputChange = (val: string, callback: (v: number) => void) => {
    if (val === '') return callback(0);
    const num = parseInt(val, 10);
    if (!isNaN(num)) callback(Math.max(0, num));
  };

  return (
    <div className={cn('group relative rounded-xl border bg-card transition-all duration-200', hasSelection ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-border', className)}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
            {CATEGORY_NAMES[product.category] || product.category}
          </span>
          <span className="text-sm font-bold text-primary">{formatCurrency(boxPrice)}/cx</span>
        </div>

        <h3 className="font-semibold text-sm mb-1 text-foreground leading-snug">
          {product.name}
        </h3>
        
        {/* CORREÇÃO DO NAN AQUI */}
        <p className="text-xs text-muted-foreground mb-4">
          {totalUnitsCalculated} unidades
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">
              Caixas
            </label>
            <Input 
              type="number" 
              min="0"
              value={boxes || ''} 
              onChange={(e) => handleInputChange(e.target.value, onBoxesChange)} 
              className="h-10 text-center font-bold text-sm bg-background border-border/60 focus:ring-1 focus:ring-primary/30" 
              placeholder="0" 
            />
          </div>
          {onLooseUnitsChange && (
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">
                Avulsos (UN)
              </label>
              <Input 
                type="number"
                min="0" 
                value={looseUnits || ''} 
                onChange={(e) => handleInputChange(e.target.value, onLooseUnitsChange)} 
                className="h-10 text-center font-bold text-sm bg-background border-border/60 focus:ring-1 focus:ring-primary/30" 
                placeholder="0" 
              />
            </div>
          )}
        </div>

        {hasSelection && (
          <div className="mt-4 pt-3 border-t border-border/50 text-right">
            <span className="text-xs text-muted-foreground block">Subtotal</span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(itemTotal)}</span>
          </div>
        )}
      </div>
    </div>
  );
}