import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Admin Pages
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Production from "./pages/Production";
import Suppliers from "./pages/Suppliers";

// Auth Pages
import Login from "./pages/Login";

// User Pages
import Shop from "./pages/user/Shop";
import Cart from "./pages/user/Cart";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Smart redirect component
function HomeRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  
  return <Navigate to="/shop" replace />;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Smart Home Redirect */}
      <Route path="/" element={<HomeRedirect />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/production"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Production />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suppliers />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/orders"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
