import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthSuccess from "./pages/AuthSuccess"; // Import AuthSuccess component
import ForgotPassword from "./pages/ForgotPassword"; // Import ForgotPassword component
import ResetPassword from "./pages/ResetPassword"; // Import ResetPassword component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth-success" element={<AuthSuccess />} /> {/* New route for Google OAuth success */}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password Route */}
          <Route path="/reset-password/:resettoken" element={<ResetPassword />} /> {/* Reset Password Route */}
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />       {/* Income Page */}
          <Route path="/expenses" element={<Expenses />} />   {/* Expenses Page */}
          <Route path="/analytics" element={<Analytics />} /> {/* Analytics Page */}
          <Route path="/settings" element={<Settings />} />   {/* Settings Page */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;