import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ComposePage from "@/pages/compose";
import RecipientsPage from "@/pages/recipients";
import ScheduledPage from "@/pages/scheduled";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function App() {
  const [location, setLocation] = useLocation();

  // Redirect to login if not on login page and not authenticated
  const isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
  useEffect(() => {
    if (!isAuthenticated && location !== "/login" && location !== "/") {
      setLocation("/login");
    }
    if (isAuthenticated && (location === "/login" || location === "/")) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/" component={LoginPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/compose" component={ComposePage} />
          <Route path="/recipients" component={RecipientsPage} />
          <Route path="/scheduled" component={ScheduledPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
