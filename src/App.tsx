import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/appState";
import AppLayout from "@/components/AppLayout";
import AccountsPage from "@/pages/AccountsPage";
import AccountMapPage from "@/pages/AccountMapPage";
import DealStrategyPage from "@/pages/DealStrategyPage";
import BusinessDevPage from "@/pages/BusinessDevPage";
import PlaybookPage from "@/pages/PlaybookPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<AccountsPage />} />
              <Route path="/account-map" element={<AccountMapPage />} />
              <Route path="/strategy" element={<DealStrategyPage />} />
              <Route path="/business-dev" element={<BusinessDevPage />} />
              <Route path="/playbook" element={<PlaybookPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
