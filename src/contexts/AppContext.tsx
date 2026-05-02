import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, Order, OrderItem, Store, OrderStatus } from '@/types';
import { mockUsers } from '@/data/mockData';
import { useOrders } from '@/hooks/useOrders';

interface AppContextType {
  // Users
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  
  // Orders (Supabase-backed with real-time)
  orders: Order[];
  trashedOrders: Order[];
  addOrder: (store: Store, items: { productId: string; boxes: number; isLoose?: boolean; isCrate?: boolean }[], createdByName?: string, productsLookup?: Product[]) => void;
  updateOrderStatus: (id: string, status: OrderStatus, actionBy: string) => void;
  deleteOrder: (id: string) => void;
  softDeleteOrder: (id: string) => void;
  restoreOrder: (id: string) => void;
  permanentDeleteOrder: (id: string) => void;
  emptyTrash: () => void;
  deleteAllOpenOrders: () => void;
  
  // Sync status
  isOnline: boolean;
  lastSync: Date | null;
  ordersLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  users: 'viaurb_users',
  currentUser: 'viaurb_current_user',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Use Supabase-backed orders with real-time sync
  const {
    orders,
    trashedOrders,
    loading: ordersLoading,
    addOrder: addOrderAsync,
    updateOrderStatus: updateOrderStatusAsync,
    deleteOrder: deleteOrderAsync,
    softDeleteOrder: softDeleteOrderFn,
    restoreOrder: restoreOrderFn,
    permanentDeleteOrder: permanentDeleteOrderFn,
    emptyTrash: emptyTrashFn,
    deleteAllOpenOrders: deleteAllOpenOrdersAsync,
  } = useOrders();

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.users);
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.currentUser);

    setUsers(storedUsers ? JSON.parse(storedUsers) : mockUsers);
    
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    } else {
      setCurrentUser(mockUsers[0]);
    }
  }, []);

  // Persist users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User functions
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Order wrappers (fire-and-forget for sync interface compatibility)
  const addOrder = (store: Store, items: { productId: string; boxes: number; isLoose?: boolean; isCrate?: boolean }[], createdByName?: string, productsLookup?: Product[]) => {
    addOrderAsync(store, items, createdByName, productsLookup);
  };

  const updateOrderStatus = (id: string, status: OrderStatus, actionBy: string) => {
    updateOrderStatusAsync(id, status, actionBy);
  };

  const deleteOrder = (id: string) => {
    deleteOrderAsync(id);
  };

  const softDeleteOrder = (id: string) => {
    softDeleteOrderFn(id);
  };

  const restoreOrder = (id: string) => {
    restoreOrderFn(id);
  };

  const permanentDeleteOrder = (id: string) => {
    permanentDeleteOrderFn(id);
  };

  const emptyTrash = () => {
    emptyTrashFn();
  };

  const deleteAllOpenOrders = () => {
    deleteAllOpenOrdersAsync();
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        addUser,
        updateUser,
        deleteUser,
        setCurrentUser,
        orders,
        trashedOrders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        softDeleteOrder,
        restoreOrder,
        permanentDeleteOrder,
        emptyTrash,
        deleteAllOpenOrders,
        isOnline,
        lastSync,
        ordersLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
