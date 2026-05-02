 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { User, UserRole } from '@/types';
 import { toast } from 'sonner';
 
 interface AppUser {
   id: string;
   email: string;
   name: string;
   role: UserRole;
   active: boolean;
   created_at: string;
 }
 
 export function useAppUsers() {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
 
   const fetchUsers = useCallback(async () => {
     try {
       const { data, error } = await supabase
         .from('app_users')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
 
       const mappedUsers: User[] = (data as AppUser[]).map((u) => ({
         id: u.id,
         name: u.name,
         email: u.email,
         role: u.role as UserRole,
         active: u.active,
         createdAt: new Date(u.created_at),
       }));
 
       setUsers(mappedUsers);
     } catch (error) {
       console.error('Erro ao buscar usuários:', error);
     } finally {
       setLoading(false);
     }
   }, []);
 
   useEffect(() => {
     fetchUsers();
 
     // Escutar mudanças em tempo real
     const channel = supabase
       .channel('app_users_changes')
       .on(
         'postgres_changes',
         { event: '*', schema: 'public', table: 'app_users' },
         () => {
           fetchUsers();
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [fetchUsers]);
 
   const addUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
     try {
        const { error } = await supabase
          .from('app_users')
          .insert({
            email: user.email,
            name: user.name,
            role: user.role as any,
            active: user.active,
          } as any);
 
       if (error) throw error;
       toast.success('Usuário criado com sucesso!');
       await fetchUsers();
     } catch (error: any) {
       console.error('Erro ao criar usuário:', error);
       toast.error(error.message || 'Erro ao criar usuário');
       throw error;
     }
   };
 
   const updateUser = async (id: string, updates: Partial<User>) => {
     try {
       const dbUpdates: Record<string, any> = {};
       if (updates.name !== undefined) dbUpdates.name = updates.name;
       if (updates.email !== undefined) dbUpdates.email = updates.email;
       if (updates.role !== undefined) dbUpdates.role = updates.role;
       if (updates.active !== undefined) dbUpdates.active = updates.active;
 
       const { error } = await supabase
         .from('app_users')
         .update(dbUpdates)
         .eq('id', id);
 
       if (error) throw error;
       toast.success('Usuário atualizado com sucesso!');
       await fetchUsers();
     } catch (error: any) {
       console.error('Erro ao atualizar usuário:', error);
       toast.error(error.message || 'Erro ao atualizar usuário');
       throw error;
     }
   };
 
   const deleteUser = async (id: string) => {
     try {
       const { error } = await supabase
         .from('app_users')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
       toast.success('Usuário excluído com sucesso!');
       await fetchUsers();
     } catch (error: any) {
       console.error('Erro ao excluir usuário:', error);
       toast.error(error.message || 'Erro ao excluir usuário');
       throw error;
     }
   };
 
   return {
     users,
     loading,
     addUser,
     updateUser,
     deleteUser,
     refreshUsers: fetchUsers,
   };
 }