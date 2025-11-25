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
import FutureGoals from "./pages/FutureGoal"; // Imported FutureGoals
import NotFound from "./pages/NotFound";
import AuthSuccess from "./pages/AuthSuccess";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

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
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/future-goals" element={<FutureGoals />} /> {/* New Route Added */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;