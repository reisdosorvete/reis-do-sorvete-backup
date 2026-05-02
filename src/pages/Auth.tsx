import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import eskimoLogo from '@/assets/eskimo-logo-vermelha.png';
import eskimoBg from '@/assets/eskimo-bg-login.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }
    
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos');
      } else {
        toast.error(error.message);
      }
    } else {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    
    const result = signupSchema.safeParse({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
    });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setSignupErrors(errors);
      return;
    }
    
    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Este e-mail já está cadastrado');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Conta criada com sucesso!');
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Informe seu e-mail');
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
      setShowForgotPassword(false);
      setForgotEmail('');
    }
  };

  const inputClass = "h-12 bg-[hsl(0,0%,97%)] border-[hsl(0,0%,85%)] rounded-xl focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:border-[hsl(0,0%,85%)] transition-none placeholder:text-[hsl(0,0%,60%)]";
  const inputErrorClass = "ring-2 ring-destructive border-destructive";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Eskimó Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Background Image */}
        <img 
          src={eskimoBg} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay with brand gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,65%,35%,0.82)] via-[hsl(350,50%,28%,0.78)] to-[hsl(215,55%,32%,0.85)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img 
              src={eskimoLogo} 
              alt="Eskimó Sorvetes" 
              className="h-20 xl:h-24 object-contain brightness-0 invert drop-shadow-lg"
            />
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-snug drop-shadow-md">
                Sistema de Gestão<br />
                <span className="text-[hsl(45,100%,80%)]">de Pedidos</span>
              </h1>
              <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-[450px]">
                Pedidos, entregas e estoque, tudo organizado em um só lugar.
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {['Pedidos', 'Entregas', 'Estoque', 'Relatórios'].map((label, index) => (
                <motion.span
                  key={label}
                  className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

           {/* Footer */}
           <motion.p 
             className="text-white/50 text-sm"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 0.5 }}
           >
               © 2026 Eskimó Sorvetes. Todos os direitos reservados.
           </motion.p>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-8 lg:p-12 relative overflow-hidden">

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <motion.div 
            className="lg:hidden mb-10 flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={eskimoLogo} 
              alt="Eskimó Sorvetes" 
              className="h-16 object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(0,0%,15%)] mb-2">
                {showForgotPassword ? 'Recuperar senha' : showSignup ? 'Nova conta' : 'Acesse o sistema'}
              </h2>
              <p className="text-[hsl(0,0%,45%)]">
                {showForgotPassword
                  ? 'Informe seu e-mail para redefinir a senha'
                  : showSignup 
                    ? 'Preencha os dados para criar seu acesso' 
                    : 'Entre com suas credenciais para continuar'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {showForgotPassword ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                        E-mail
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-[hsl(215,50%,45%)] to-[hsl(215,55%,50%)] hover:from-[hsl(215,50%,40%)] hover:to-[hsl(215,55%,45%)] text-white shadow-lg shadow-[hsl(215,50%,45%,0.25)] hover:shadow-xl hover:shadow-[hsl(215,50%,45%,0.35)] transition-all duration-300"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar link de recuperação'
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-[hsl(0,0%,45%)] text-sm mt-8">
                    <button 
                      onClick={() => setShowForgotPassword(false)}
                      className="text-[hsl(215,50%,48%)] hover:text-[hsl(215,50%,38%)] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar ao login
                    </button>
                  </p>
                </motion.div>
              ) : !showSignup ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                        E-mail
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={`${inputClass} ${loginErrors.email ? inputErrorClass : ''}`}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-destructive">{loginErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                        Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={`${inputClass} pr-12 ${loginErrors.password ? inputErrorClass : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,30%)] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">{loginErrors.password}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="border-[hsl(0,0%,75%)] data-[state=checked]:bg-[hsl(215,50%,48%)] data-[state=checked]:border-[hsl(215,50%,48%)] rounded"
                        />
                        <label htmlFor="remember" className="text-sm text-[hsl(0,0%,45%)] cursor-pointer">
                          Lembrar-me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-[hsl(215,50%,48%)] hover:text-[hsl(215,50%,38%)] font-medium transition-colors"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-[hsl(215,50%,45%)] to-[hsl(215,55%,50%)] hover:from-[hsl(215,50%,40%)] hover:to-[hsl(215,55%,45%)] text-white shadow-lg shadow-[hsl(215,50%,45%,0.25)] hover:shadow-xl hover:shadow-[hsl(215,50%,45%,0.35)] transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          Entrar
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-[hsl(0,0%,45%)] text-sm mt-8">
                    Não tem uma conta?{' '}
                    <button 
                      onClick={() => setShowSignup(true)}
                      className="text-[hsl(215,50%,48%)] hover:text-[hsl(215,50%,38%)] font-semibold transition-colors"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                        Nome completo
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className={`${inputClass} ${signupErrors.name ? inputErrorClass : ''}`}
                      />
                      {signupErrors.name && (
                        <p className="text-sm text-destructive">{signupErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                        E-mail
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className={`${inputClass} ${signupErrors.email ? inputErrorClass : ''}`}
                      />
                      {signupErrors.email && (
                        <p className="text-sm text-destructive">{signupErrors.email}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                          Senha
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className={`${inputClass} ${signupErrors.password ? inputErrorClass : ''}`}
                        />
                        {signupErrors.password && (
                          <p className="text-sm text-destructive">{signupErrors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-sm font-medium text-[hsl(0,0%,20%)]">
                          Confirmar
                        </Label>
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          className={`${inputClass} ${signupErrors.confirmPassword ? inputErrorClass : ''}`}
                        />
                        {signupErrors.confirmPassword && (
                          <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-[hsl(215,50%,45%)] to-[hsl(215,55%,50%)] hover:from-[hsl(215,50%,40%)] hover:to-[hsl(215,55%,45%)] text-white shadow-lg shadow-[hsl(215,50%,45%,0.25)] hover:shadow-xl hover:shadow-[hsl(215,50%,45%,0.35)] transition-all duration-300 mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          Criar conta
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-[hsl(0,0%,45%)] text-sm mt-8">
                    Já tem uma conta?{' '}
                    <button 
                      onClick={() => setShowSignup(false)}
                      className="text-[hsl(215,50%,48%)] hover:text-[hsl(215,50%,38%)] font-semibold transition-colors"
                    >
                      Faça login
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

           {/* Mobile Footer */}
           <motion.p 
             className="lg:hidden text-center text-[hsl(0,0%,55%)] text-sm mt-10"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6, duration: 0.5 }}
           >
             © 2026 Eskimó Sorvetes. Todos os direitos reservados.
           </motion.p>
        </div>
      </div>
    </div>
  );
}