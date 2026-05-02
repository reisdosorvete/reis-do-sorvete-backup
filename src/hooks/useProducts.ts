import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { Product } from '@/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    category: row.category,
    unitsPerBox: row.units_per_box,
    boxesPerCrate: row.boxes_per_crate,
    unitsPerCrate: row.units_per_crate,
    unitPrice: Number(row.unit_price),
    active: row.active,
    stock_quantity: row.stock_quantity || 0,
    createdAt: new Date(row.created_at),
  };
}

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: rawProducts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ProductRow[];
    },
  });

  const products: Product[] = rawProducts.map(mapRowToProduct);

  const addProduct = useMutation({
    mutationFn: async (product: Omit<ProductInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await refetch();
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error adding product:', error);
      toast.error('Erro ao criar produto');
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & ProductUpdate) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await refetch();
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Erro ao atualizar produto');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: async () => {
      await refetch();
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    },
  });

  return {
    products,
    rawProducts,
    isLoading,
    error,
    refetch,
    addProduct: addProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isAdding: addProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
}
