import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import viaurbLogo from '@/assets/viaurb-logo.png';

interface WelcomeProps {
  onEnter: () => void;
}

const Welcome = ({ onEnter }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-2xl scale-110" />
          <img
            src={viaurbLogo}
            alt="VIAURB"
            className="relative h-32 md:h-40 drop-shadow-2xl"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4 mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Sistema de Gestão
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Mais controle e eficiência na gestão de pedidos
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            Acessar Sistema
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          © 2026 Eskimó Sorvetes. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;
