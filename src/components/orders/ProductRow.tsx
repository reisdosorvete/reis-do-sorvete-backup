import { cn, formatCurrency } from '@/lib/utils';
import { Product, CATEGORY_NAMES } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductRowProps {
  product: Product;
  boxes: number;
  looseUnits?: number; // Agora ele aceita os avulsos de forma opcional
  onBoxesChange: (boxes: number) => void;
  className?: string;
}

export function ProductRow({ product, boxes = 0, looseUnits = 0, onBoxesChange, className }: ProductRowProps) {
  const totalUnits = boxes * product.unitsPerBox;
  const boxPrice = product.unitsPerBox * product.unitPrice;
  const itemTotal = boxes * boxPrice;

  // Lógica de fallback para não dar NaN no total, seguindo a estrutura antiga do Rikelme
  const totalUnitsCalculated = (boxes * product.unitsPerBox) + looseUnits;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      onBoxesChange(0);
      return;
    }
    const value = parseInt(rawValue, 10);
    if (!isNaN(value)) {
      onBoxesChange(Math.max(0, value));
    }
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card transition-all duration-200',
        boxes > 0 
          ? 'border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/20' 
          : 'border-border hover:border-muted-foreground/30 hover:shadow-sm',
        className
      )}
    >
      <div className="p-4">
        {/* Top Row: Category + Code + Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
              {CATEGORY_NAMES[product.category] || product.category}
            </span>
            {product.code && (
              <span className="text-xs font-mono text-muted-foreground">
                #{product.code}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">{formatCurrency(product.unitPrice)}/un</span>
            <div className="text-sm font-bold text-primary">{formatCurrency(boxPrice)}/cx</div>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Info Box -> Agora o visual segue o projeto antigo do Rikelme (sem o looseUnits aqui para manter a imagem enviada) */}
        <div className="text-xs text-muted-foreground space-y-0.5 mb-3">
          <div>{product.unitsPerBox} un/cx</div>
        </div>

        {/* Bottom Row: Info + Quantity Controls */}
        <div className="flex items-center justify-between gap-3">
           {/* Total Units Texto Fixo como a Imagem */}
           <div className="text-xs text-muted-foreground text-left">
            = <span className="font-semibold text-foreground">{totalUnitsCalculated} unidades</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border hover:bg-muted hover:text-foreground hover:border-muted-foreground/30"
              onClick={() => onBoxesChange(Math.max(0, boxes - 1))}
              disabled={boxes === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={boxes || ''}
                placeholder="0"
                onChange={handleInputChange}
                className="h-9 w-16 text-center font-bold text-base px-2 border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/30 placeholder:font-normal focus:placeholder:text-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              onClick={() => onBoxesChange(boxes + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Totals - Show only when boxes > 0 */}
        {boxes > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{boxes} cx × {formatCurrency(boxPrice)}</span>
              <span className="font-medium text-foreground">{formatCurrency(itemTotal)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-base font-bold text-foreground">
                {formatCurrency(itemTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}