import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import CitizenDashboard from "@/pages/citizen-dashboard";
import AgencyDashboard from "@/pages/agency-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ghana-green"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {user.role === 'citizen' && <Route path="/" component={CitizenDashboard} />}
          {user.role === 'agency' && <Route path="/" component={AgencyDashboard} />}
          {user.role === 'admin' && <Route path="/" component={AdminDashboard} />}
          <Route path="/citizen" component={CitizenDashboard} />
          <Route path="/agency" component={AgencyDashboard} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
