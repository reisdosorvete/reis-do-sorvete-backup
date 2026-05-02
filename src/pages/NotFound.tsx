import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Página não encontrada</p>
        <Button onClick={() => navigate('/')} className="mt-6 gap-2">
          <Home className="h-4 w-4" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
