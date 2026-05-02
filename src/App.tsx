import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder";
import OrderPreview from "./pages/OrderPreview";
import OrderReview from "./pages/OrderReview";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import UsersList from "./pages/UsersList";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SeedProduct from "./pages/SeedProduct";

const queryClient = new QueryClient();

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
        <TooltipProvider>
          <AuthProvider>
            <AppProvider>
              <Routes>
                <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
                <Route element={<ProtectedLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/novo-pedido" element={<NewOrder />} />
                  <Route path="/pedido-review" element={<OrderReview />} />
                  <Route path="/pedido-preview" element={<OrderPreview />} />
                  <Route path="/pedidos" element={<Orders />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/usuarios" element={<UsersList />} />
                  <Route path="/historico" element={<History />} />
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="/seed-product" element={<SeedProduct />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;