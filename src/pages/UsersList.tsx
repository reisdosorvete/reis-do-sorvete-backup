import { PageHeader } from '@/components/layout/PageHeader';
import { useAppUsers } from '@/hooks/useAppUsers';
import { Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UsersList() {
  const { users, loading } = useAppUsers();

  return (
    <>
      <PageHeader title="Usuários" description="Equipe com acesso ao sistema" />

      <div className="p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Permissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name?.charAt(0) || <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="gap-1">
                      <Shield className="h-3 w-3" /> {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}