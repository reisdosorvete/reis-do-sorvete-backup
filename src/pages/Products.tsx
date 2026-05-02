import { PageHeader } from '@/components/layout/PageHeader';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { Search, Plus, Package, Box, Truck, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Products() {
  const { products, productsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Produtos" description="Catálogo de produtos Eskimó">
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou código..." 
            className="pl-10 bg-card border-border/50 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {productsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
                      <Package className="h-6 w-6" />
                    </div>
                    {product.code && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                        {product.code}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Box className="h-3.5 w-3.5 text-slate-400" />
                        <span>{product.unitsPerBox} un/cx</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        <span>{product.boxesPerCrate} cx/eng</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Ações (Preço, Status e Editar) */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-slate-900 text-lg leading-none">
                      {formatCurrency(product.unitPrice)}
                    </p>
                    <Badge 
                      variant={product.active ? "success" : "secondary"} 
                      className={product.active ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 px-2 py-0.5 text-[10px] font-bold" : "px-2 py-0.5 text-[10px] font-bold"}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  {/* Botão de Editar */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => {}}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}