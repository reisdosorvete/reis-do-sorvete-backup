import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_NAMES, UserRole } from '@/types';
import { Settings, User as UserIcon, LogOut, Edit2, Shield, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AvatarUpload } from '@/components/settings/AvatarUpload';

export default function SettingsPage() {
  const { signOut, profile, isAdmin, isSuporte, user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const displayName = profile?.name || profile?.email || user?.email || 'Usuário';
  const displayEmail = profile?.email || user?.email || '';
  const displayRole = profile?.role ? ROLE_NAMES[profile.role as UserRole] : 'Usuário';

  const roleColors: Record<string, string> = {
    usuario: 'bg-slate-100 text-slate-700',
    admin: 'bg-primary/10 text-primary',
    suporte: 'bg-purple-100 text-purple-700',
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ name: editName.trim() })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Perfil atualizado!');
      setIsEditing(false);
      window.location.reload();
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Configurações" description="Gerencie seu perfil e segurança" />

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Card de Usuário */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <AvatarUpload avatarUrl={user?.user_metadata?.avatar_url || null} displayName={displayName} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { setEditName(profile?.name || ''); setIsEditing(true); }}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">{displayEmail}</p>
              <div className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase mt-3', roleColors[profile?.role || ''])}>
                <Shield className="h-3.5 w-3.5" /> {displayRole}
              </div>
            </div>
            <Button variant="outline" onClick={signOut} className="rounded-xl text-destructive border-destructive/20 hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        {/* Card de Senha */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Segurança</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Nova Senha</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl h-11" placeholder="Mínimo 6 caracteres" />
            </div>
            <div className="grid gap-2">
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl h-11" />
            </div>
            <Button onClick={handleChangePassword} className="w-full h-11 rounded-xl font-bold shadow-glow" disabled={changingPassword || !newPassword}>
              Atualizar Senha
            </Button>
          </div>
        </div>

        {/* Info do App */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            © 2026 Eskimó Sorvetes • Versão Final 1.0
          </p>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader><DialogTitle className="font-bold">Editar Nome</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl h-11" />
            <Button onClick={handleSaveProfile} className="w-full h-11 rounded-xl font-bold" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}