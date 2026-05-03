import { cn, formatCurrency } from '@/lib/utils';
import { Product, CATEGORY_NAMES } from '@/types';
import { Minus, Plus, Package, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductRowDualProps {
  product: Product;
  boxes: number;
  looseUnits: number;
  onBoxesChange: (boxes: number) => void;
  onLooseUnitsChange: (units: number) => void;
  className?: string;
}

export function ProductRowDual({
  product,
  boxes,
  looseUnits,
  onBoxesChange,
  onLooseUnitsChange,
  className,
}: ProductRowDualProps) {
  const boxPrice = product.unitsPerBox * product.unitPrice;
  const currentTotalUnits = (boxes * product.unitsPerBox) + looseUnits;

  const handleBoxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLooseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      onLooseUnitsChange(0);
      return;
    }
    const value = parseInt(rawValue, 10);
    if (!isNaN(value)) {
      onLooseUnitsChange(Math.max(0, value));
    }
  };

  const isPote = ['copinho', 'sundae', 'seletto'].includes(product.category);
  const embalagemNome = isPote ? 'Caixinha' : 'Caixa';

  return (
    <div className={cn('p-4 border rounded-2xl bg-card hover:shadow-md transition-all duration-200', className)}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            {CATEGORY_NAMES[product.category] || product.category}
          </span>
          <h3 className="font-semibold text-sm mt-3 leading-snug">{product.name}</h3>
        </div>
        <div className="text-right shrink-0 ml-2">
          <div className="text-sm font-bold text-primary">{formatCurrency(boxPrice)}/cx</div>
          <div className="text-xs text-muted-foreground">{product.unitsPerBox} un/cx</div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Package className="h-4 w-4" /> {embalagemNome}
          </div>
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/50">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm" onClick={() => onBoxesChange(Math.max(0, boxes - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input type="number" min="0" value={boxes === 0 ? '0' : boxes} onChange={handleBoxInputChange} className="h-8 w-10 text-center font-bold text-base border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm text-primary" onClick={() => onBoxesChange(boxes + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Circle className="h-4 w-4" /> Unidade
          </div>
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/50">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm" onClick={() => onLooseUnitsChange(Math.max(0, looseUnits - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input type="number" min="0" value={looseUnits === 0 ? '0' : looseUnits} onChange={handleLooseInputChange} className="h-8 w-10 text-center font-bold text-base border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm text-primary" onClick={() => onLooseUnitsChange(looseUnits + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs font-medium text-muted-foreground border-t pt-3">
          = {currentTotalUnits} unidades
      </div>
    </div>
  );
}