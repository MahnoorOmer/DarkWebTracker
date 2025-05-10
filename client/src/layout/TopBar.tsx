import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Menu, 
  Search as SearchIcon, 
  Bell, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface TopBarProps {
  toggleSidebar: () => void;
}

export default function TopBar({ toggleSidebar }: TopBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [location, navigate] = useLocation();
  
  // Get alert count for notification badge
  const { data: alertsData } = useQuery({
    queryKey: ['/api/alerts'],
  });
  
  const unreadAlertsCount = alertsData?.filter((alert: any) => !alert.isRead).length || 0;
  
  // Get title based on current path
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/search":
        return "Search";
      case "/monitoring":
        return "Monitoring";
      case "/reports":
        return "Reports";
      case "/alerts":
        return "Alerts";
      case "/settings":
        return "Settings";
      default:
        return "DarkSentry";
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
    }
  };

  return (
    <header className="bg-secondary border-b border-neutral-dark p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-mono font-semibold text-white">
          {getPageTitle(location)}
        </h2>
      </div>
      
      <div className="flex items-center space-x-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search dark web..."
            className="bg-background border-input pl-10 pr-4 py-2 text-sm w-64"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate("/alerts")}
        >
          <Bell className="h-5 w-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
