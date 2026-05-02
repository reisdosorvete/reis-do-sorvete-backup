import { useEffect, useState, useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, OrderStatus, Store, Product } from '@/types';
import { toast } from 'sonner';

interface OrderRow {
  id: string;
  store: Store;
  status: OrderStatus;
  total_boxes: number;
  total_crates: number;
  total_remaining_boxes: number;
  created_by: string;
  created_at: string;
  separated_by: string | null;
  separated_at: string | null;
  delivered_by: string | null;
  delivered_at: string | null;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  units_per_box: number;
  boxes_per_crate: number;
  units_per_crate: number;
  unit_price: number;
  boxes: number;
  total_units: number;
  crates: number;
  remaining_boxes: number;
}

function mapItemRow(i: OrderItemRow): OrderItem {
  // Compute looseUnits from total - box units - crate units
  const boxUnits = i.boxes * i.units_per_box;
  const crateUnits = i.crates * i.units_per_crate;
  const looseUnits = Math.max(0, i.total_units - boxUnits - crateUnits);
  // isCrate = has crates but no boxes
  const isCrate = i.crates > 0 && i.boxes === 0;

  return {
    productId: i.product_id,
    productName: i.product_name,
    productCode: i.product_code,
    unitsPerBox: i.units_per_box,
    boxesPerCrate: i.boxes_per_crate,
    unitsPerCrate: i.units_per_crate,
    unitPrice: i.unit_price,
    boxes: i.boxes,
    totalUnits: i.total_units,
    crates: i.crates,
    remainingBoxes: i.remaining_boxes,
    looseUnits,
    isCrate,
  };
}

function mapToOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    store: row.store,
    status: row.status,
    totalBoxes: row.total_boxes,
    totalCrates: row.total_crates,
    totalRemainingBoxes: row.total_remaining_boxes,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at),
    separatedBy: row.separated_by ?? undefined,
    separatedAt: row.separated_at ? new Date(row.separated_at) : undefined,
    deliveredBy: row.delivered_by ?? undefined,
    deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
    items: items.map(mapItemRow),
  };
}

async function fetchOrdersFromDB(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as any[]).map((row) => {
    const { order_items, ...orderRow } = row;
    return mapToOrder(orderRow as OrderRow, (order_items || []) as OrderItemRow[]);
  });
}

const TRASH_STORAGE_KEY = 'orders_trash';

function getTrashedIds(): string[] {
  try {
    const stored = localStorage.getItem(TRASH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setTrashedIds(ids: string[]) {
  localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(ids));
}

export function useOrders() {
  const queryClient = useQueryClient();
  const [trashedIds, setTrashedIdsState] = useState<string[]>(getTrashedIds);

  const { data: allOrders = [], isLoading: loading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrdersFromDB,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

  // Split orders into active and trashed
  const orders = allOrders.filter(o => !trashedIds.includes(o.id));
  const trashedOrders = allOrders.filter(o => trashedIds.includes(o.id));

  // Realtime subscription to invalidate cache
  useEffect(() => {
    const channel = supabase
      .channel('orders_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addOrder = async (
    store: Store,
    items: { productId: string; boxes: number; isLoose?: boolean; isCrate?: boolean }[],
    createdByName?: string,
    productsLookup?: Product[]
  ) => {
    const prodList = productsLookup || [];

    // Group items by productId
    const grouped = new Map<string, { boxes: number; looseUnits: number; crates: number }>();
    items.filter((item) => item.boxes > 0).forEach((item) => {
      const entry = grouped.get(item.productId) || { boxes: 0, looseUnits: 0, crates: 0 };
      if (item.isCrate) {
        entry.crates += item.boxes;
      } else if (item.isLoose) {
        entry.looseUnits += item.boxes;
      } else {
        entry.boxes += item.boxes;
      }
      grouped.set(item.productId, entry);
    });

    const orderItems: OrderItem[] = Array.from(grouped.entries()).map(([productId, qty]) => {
      const product = prodList.find((p) => p.id === productId);
      if (!product) throw new Error('Product not found');

      const boxUnits = qty.boxes * product.unitsPerBox;
      const crateUnits = qty.crates * product.unitsPerCrate;
      const totalUnits = boxUnits + crateUnits + qty.looseUnits;
      const isCrateFlag = qty.crates > 0;
      const crates = isCrateFlag ? qty.crates : Math.floor(qty.boxes / product.boxesPerCrate);
      const remainingBoxes = isCrateFlag ? 0 : qty.boxes % product.boxesPerCrate;

      return {
        productId,
        productName: product.name,
        productCode: product.code,
        unitsPerBox: product.unitsPerBox,
        boxesPerCrate: product.boxesPerCrate,
        unitsPerCrate: product.unitsPerCrate,
        unitPrice: product.unitPrice,
        boxes: qty.boxes,
        totalUnits,
        crates,
        remainingBoxes,
        looseUnits: qty.looseUnits,
        isCrate: isCrateFlag,
      };
    });

    const totalBoxes = orderItems.reduce((sum, item) => sum + item.boxes, 0);
    const totalCrates = orderItems.reduce((sum, item) => sum + (item.isCrate ? item.crates : 0), 0);
    const totalRemainingBoxes = orderItems.reduce((sum, item) => sum + item.remainingBoxes, 0);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          store,
          status: 'criado' as OrderStatus,
          total_boxes: totalBoxes,
          total_crates: totalCrates,
          total_remaining_boxes: totalRemainingBoxes,
          created_by: createdByName || 'Sistema',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const itemsToInsert = orderItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.productName,
        product_code: item.productCode,
        units_per_box: item.unitsPerBox,
        boxes_per_crate: item.boxesPerCrate,
        units_per_crate: item.unitsPerCrate,
        unit_price: item.unitPrice,
        boxes: item.boxes,
        total_units: item.totalUnits,
        crates: item.crates,
        remaining_boxes: item.remainingBoxes,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast.error(error.message || 'Erro ao criar pedido');
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus, actionBy: string) => {
    try {
      const updates: Record<string, any> = { status };
      if (status === 'separado') {
        updates.separated_by = actionBy;
        updates.separated_at = new Date().toISOString();
      } else if (status === 'entregue') {
        updates.delivered_by = actionBy;
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase.from('orders').update(updates).eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error(error.message || 'Erro ao atualizar pedido');
      throw error;
    }
  };

  // Soft delete: move to trash
  const softDeleteOrder = useCallback((id: string) => {
    const newIds = [...trashedIds, id];
    setTrashedIds(newIds);
    setTrashedIdsState(newIds);
  }, [trashedIds]);

  // Restore from trash
  const restoreOrder = useCallback((id: string) => {
    const newIds = trashedIds.filter(tid => tid !== id);
    setTrashedIds(newIds);
    setTrashedIdsState(newIds);
  }, [trashedIds]);

  // Permanent delete (from DB)
  const permanentDeleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      // Also remove from trash list
      const newIds = trashedIds.filter(tid => tid !== id);
      setTrashedIds(newIds);
      setTrashedIdsState(newIds);
    } catch (error: any) {
      console.error('Erro ao excluir pedido:', error);
      toast.error(error.message || 'Erro ao excluir pedido');
      throw error;
    }
  };

  // Legacy: hard delete (kept for deleteAllOpenOrders)
  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao excluir pedido:', error);
      toast.error(error.message || 'Erro ao excluir pedido');
      throw error;
    }
  };

  const deleteAllOpenOrders = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .in('status', ['criado', 'separado']);
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao excluir pedidos:', error);
      toast.error(error.message || 'Erro ao excluir pedidos em aberto');
      throw error;
    }
  };

  // Empty entire trash permanently
  const emptyTrash = async () => {
    try {
      for (const id of trashedIds) {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) throw error;
      }
      setTrashedIds([]);
      setTrashedIdsState([]);
    } catch (error: any) {
      console.error('Erro ao esvaziar lixeira:', error);
      toast.error(error.message || 'Erro ao esvaziar lixeira');
      throw error;
    }
  };

  return {
    orders,
    trashedOrders,
    loading,
    addOrder,
    updateOrderStatus,
    softDeleteOrder,
    restoreOrder,
    permanentDeleteOrder,
    deleteOrder,
    deleteAllOpenOrders,
    emptyTrash,
    refreshOrders: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  };
}
