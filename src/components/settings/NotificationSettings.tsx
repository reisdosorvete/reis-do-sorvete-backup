import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationPrefs {
  orderUpdates: boolean;
  newOrders: boolean;
  cancelledOrders: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  orderUpdates: true,
  newOrders: true,
  cancelledOrders: true,
};

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
    try {
      const saved = localStorage.getItem('notification-prefs');
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    localStorage.setItem('notification-prefs', JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (key: keyof NotificationPrefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Notificações</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="order-updates" className="text-sm font-medium">Atualizações de pedidos</Label>
            <p className="text-xs text-muted-foreground">Notificação quando um pedido for atualizado</p>
          </div>
          <Switch
            id="order-updates"
            checked={prefs.orderUpdates}
            onCheckedChange={() => toggle('orderUpdates')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="new-orders" className="text-sm font-medium">Novos pedidos</Label>
            <p className="text-xs text-muted-foreground">Notificação quando um novo pedido for criado</p>
          </div>
          <Switch
            id="new-orders"
            checked={prefs.newOrders}
            onCheckedChange={() => toggle('newOrders')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="cancelled-orders" className="text-sm font-medium">Pedidos cancelados</Label>
            <p className="text-xs text-muted-foreground">Notificação quando um pedido for cancelado</p>
          </div>
          <Switch
            id="cancelled-orders"
            checked={prefs.cancelledOrders}
            onCheckedChange={() => toggle('cancelledOrders')}
          />
        </div>
      </div>
    </div>
  );
}
