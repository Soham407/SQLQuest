import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cubicBezier } from "motion";
import PillNav from "./components/PillNav";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import { AuthProvider } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.2, ease: cubicBezier(0.4, 0, 1, 1) } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Index />
            </motion.div>
          }
        />
        <Route
          path="/pricing"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Pricing />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Signup />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/profile"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Profile />
            </motion.div>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Lesson />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const MainContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
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
        <AnimatedRoutes />
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
