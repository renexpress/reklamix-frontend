
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AdminRoute } from "@/components/shared/AdminRoute";
import MetaTags from "@/components/MetaTags";

// Existing pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Create from "./pages/Create";
// import CreateVideo from "./pages/CreateVideo"; // Temporarily hidden
import MyResults from "./pages/MyResults";
import Packages from "./pages/Packages";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminSamples from "./pages/admin/Samples";
import AdminVideos from "./pages/admin/Videos";
import AdminPackages from "./pages/admin/Packages";
import AdminPlatforms from "./pages/admin/Platforms";
import AdminLogs from "./pages/admin/Logs";
import AdminMarketplaceCategories from "./pages/admin/MarketplaceCategories";
import AdminMarketplaceTemplates from "./pages/admin/MarketplaceTemplates";
import AdminUserDetail from "./pages/admin/UserDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable automatic refetch on window focus to prevent
      // page feeling like it reloads when switching tabs
      refetchOnWindowFocus: false,
      // Keep data fresh for 5 minutes before considering it stale
      staleTime: 5 * 60 * 1000,
      // Don't retry failed requests automatically
      retry: 1,
      // Keep previous data while fetching new data
      placeholderData: (previousData: unknown) => previousData,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <MetaTags />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />
            {/* /create-video route - temporarily hidden
            <Route
              path="/create-video"
              element={
                <ProtectedRoute>
                  <CreateVideo />
                </ProtectedRoute>
              }
            />
            */}
            <Route
              path="/my-results"
              element={
                <ProtectedRoute>
                  <MyResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packages"
              element={
                <ProtectedRoute>
                  <Packages />
                </ProtectedRoute>
              }
            />

            {/* Payment routes */}
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancel />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:userId" element={<AdminUserDetail />} />
              <Route path="samples" element={<AdminSamples />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="platforms" element={<AdminPlatforms />} />
              <Route path="marketplace-categories" element={<AdminMarketplaceCategories />} />
              <Route path="marketplace-templates" element={<AdminMarketplaceTemplates />} />
              <Route path="logs" element={<AdminLogs />} />
            </Route>

            {/* 404 - Keep this last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
