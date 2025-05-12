import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from ".tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Monitoring from "./pages/Monitoring";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/not-found";
import { ThemeProvider } from "./components/ui/theme-provider";
function Router() {
    var _a = useState(true), sidebarOpen = _a[0], setSidebarOpen = _a[1];
    var toggleSidebar = function () {
        setSidebarOpen(!sidebarOpen);
    };
    return (<div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}/>
      <main className="flex-1 flex flex-col min-h-screen">
        <TopBar toggleSidebar={toggleSidebar}/>
        <div className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard}/>
            <Route path="/search" component={Search}/>
            <Route path="/monitoring" component={Monitoring}/>
            <Route path="/reports" component={Reports}/>
            <Route path="/alerts" component={Alerts}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </main>
    </div>);
}
function App() {
    return (<ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>);
}
export default App;
