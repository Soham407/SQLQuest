import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PillNav from "./components/PillNav";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import { AuthProvider } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

const queryClient = new QueryClient();

const MainContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup" },
  ];

  // Hide Login/Sign Up if logged in
  const filteredNavItems = user
    ? navItems.filter(
        (item) => item.label !== "Login" && item.label !== "Sign Up"
      )
    : navItems;

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons/:id" element={<Lesson />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PillNav
        items={filteredNavItems}
        activeHref={location.pathname}
        className="justify-center"
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <BrowserRouter>
            <MainContent />
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
