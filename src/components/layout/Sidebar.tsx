import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Truck, Users, History, Settings, Wifi, WifiOff, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import eskimoLogo from '@/assets/eskimo-logo-sidebar.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Novo Pedido', href: '/novo-pedido', icon: ShoppingCart },
  { name: 'Pedidos', href: '/pedidos', icon: Truck },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Usuários', href: '/usuarios', icon: Users },
  { name: 'Histórico', href: '/historico', icon: History },
];

export function Sidebar() {
  const location = useLocation();
  const { isOnline } = useApp();
  const { signOut, profile, isAdmin, user } = useAuth();
  const displayName = profile?.name || profile?.email || user?.email || 'Usuário';

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <NavLink to="/" className="flex h-[73px] items-center justify-center border-b border-sidebar-border/50 px-6 bg-sidebar-accent/30 cursor-pointer transition-all hover:bg-sidebar-accent/50">
          <img src={eskimoLogo} alt="Eskimó Sorvetes" className="h-10 w-auto object-contain" />
        </NavLink>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2">
            {isOnline ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-warning" />}
            <span className="text-xs font-medium text-sidebar-accent-foreground">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {(profile || user) && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
                <p className="truncate text-xs text-sidebar-muted">{isAdmin ? 'Administrador' : 'Usuário'}</p>
              </div>
              <button onClick={signOut} className="p-1.5 rounded-md hover:bg-destructive/10"><LogOut className="h-4 w-4 text-destructive" /></button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}