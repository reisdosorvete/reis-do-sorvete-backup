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
    },
    onError: (error) => {
      console.error('Error adding product:', error);
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
    },
    onError: (error) => {
      console.error('Error updating product:', error);
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

  // Tradutores para converter do formato da tela para o formato do Banco de Dados
  const handleAddProduct = async (productData: Partial<Product>) => {
    return addProduct.mutateAsync({
      name: productData.name!,
      code: productData.code,
      category: productData.category!,
      units_per_box: productData.unitsPerBox!,
      boxes_per_crate: productData.boxesPerCrate!,
      units_per_crate: productData.unitsPerCrate!,
      unit_price: productData.unitPrice!,
      active: productData.active !== undefined ? productData.active : true,
    });
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    const dbUpdates: ProductUpdate = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.code !== undefined) dbUpdates.code = updates.code;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.unitsPerBox !== undefined) dbUpdates.units_per_box = updates.unitsPerBox;
    if (updates.boxesPerCrate !== undefined) dbUpdates.boxes_per_crate = updates.boxesPerCrate;
    if (updates.unitsPerCrate !== undefined) dbUpdates.units_per_crate = updates.unitsPerCrate;
    if (updates.unitPrice !== undefined) dbUpdates.unit_price = updates.unitPrice;
    if (updates.active !== undefined) dbUpdates.active = updates.active;
    
    return updateProduct.mutateAsync({ id, ...dbUpdates });
  };

  return {
    products,
    rawProducts,
    isLoading,
    error,
    refetch,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: deleteProduct.mutateAsync,
    isAdding: addProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
}