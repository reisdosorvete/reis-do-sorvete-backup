import { useState, useRef, useCallback } from 'react';
import { Camera, Loader2, Trash2, ImagePlus, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';

interface AvatarUploadProps {
  avatarUrl: string | null;
  displayName: string;
}

export function AvatarUpload({ avatarUrl, displayName }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(avatarUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  }, [offset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setOffset({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const renderToCanvas = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!previewUrl) return;
      const img = new Image();
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();

        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const scale = zoom;
        const drawW = img.width > img.height
          ? size * scale
          : (img.width / img.height) * size * scale;
        const drawH = img.height > img.width
          ? size * scale
          : (img.height / img.width) * size * scale;

        // Map offset from preview (240px) to canvas (200px)
        const ratio = size / 240;
        ctx.drawImage(
          img,
          -drawW / 2 + offset.x * ratio,
          -drawH / 2 + offset.y * ratio,
          drawW,
          drawH
        );

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = previewUrl;
    });
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      const dataUrl = await renderToCanvas();
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: dataUrl },
      });
      if (error) throw error;
      setCurrentUrl(dataUrl);
      setShowEditor(false);
      setPreviewUrl(null);
      toast.success('Foto atualizada!');
    } catch (error: any) {
      console.error('Erro ao salvar foto:', error);
      toast.error('Erro ao salvar foto');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
      if (error) throw error;
      setCurrentUrl(null);
      toast.success('Foto removida!');
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      toast.error('Erro ao remover foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative group cursor-pointer">
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full overflow-hidden',
              'bg-primary text-xl font-bold text-primary-foreground',
              'ring-2 ring-background transition-all group-hover:ring-primary/50'
            )}>
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : currentUrl ? (
                <img src={currentUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className={cn(
              'absolute inset-0 flex items-center justify-center rounded-full',
              'bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'
            )}>
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-4 w-4 mr-2" />
            {currentUrl ? 'Alterar foto' : 'Adicionar foto'}
          </DropdownMenuItem>
          {currentUrl && (
            <DropdownMenuItem
              onClick={handleRemove}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover foto
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Image Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={(open) => { if (!open) { setShowEditor(false); setPreviewUrl(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {/* Preview area */}
            <div
              className="relative w-60 h-60 rounded-full overflow-hidden bg-muted border-2 border-dashed border-border cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="absolute pointer-events-none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Controls */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3">
                <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={0.5}
                  max={3}
                  step={0.05}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Girar
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setShowEditor(false); setPreviewUrl(null); }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
