import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import SignIn from "@/pages/signin";
import Dashboard from "@/pages/dashboard";
import CreateInvoice from "@/pages/create-invoice";
import Subscription from "@/pages/subscription";
import NotFound from "@/pages/not-found";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import TemplateSelectionPage from "./pages/TemplateSelectionPage";
import ThemeSelectionPage from "./pages/ThemeSelectionPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";

// --- NAYA IMPORT ---
// Settings context ko import karein
import { SettingsProvider } from "./contexts/SettingsContext";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Routes */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
          {/* Agar user logged in nahi hai, toh baaki saare anjaan routes ko signin par bhej dein */}
          <Route>
            <Redirect to="/signin" />
          </Route>
        </>
      ) : (
      // Authenticated Routes
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/choose-template" component={TemplateSelectionPage} />
          <Route path="/choose-theme" component={ThemeSelectionPage} />
          <Route path="/create-invoice" component={CreateInvoice} />
          <Route path="/clients" component={ClientsPage} />
          <Route path="/clients/:id" component={ClientDetailPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/subscription" component={Subscription} />
          {/* Faltu /LayoutTemplate route hata diya gaya hai */}
        </>
      )}
      {/* 404 Not Found page hamesha aakhir mein */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* --- YAHAN UPDATE KIYA GAYA HAI --- */}
        {/* Poore app ko SettingsProvider se wrap kar diya hai */}
        <SettingsProvider>
          <Router />
        </SettingsProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

