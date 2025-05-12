import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import { RadarIcon, LayoutDashboard, Search, Eye, FileText, Bell, Settings, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../components/ui/scroll-area";
export default function Sidebar(_a) {
    var isOpen = _a.isOpen, setIsOpen = _a.setIsOpen;
    var location = useLocation()[0];
    var keywordsData = useQuery({
        queryKey: ['/api/keywords'],
    }).data;
    var alertsData = useQuery({
        queryKey: ['/api/alerts'],
    }).data;
    var unreadAlertsCount = alertsData ? alertsData.filter(function (alert) { return !alert.isRead; }).length : 0;
    var navItems = [
        { path: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5"/> },
        { path: "/search", label: "Search", icon: <Search className="mr-3 h-5 w-5"/> },
        { path: "/monitoring", label: "Monitoring", icon: <Eye className="mr-3 h-5 w-5"/> },
        { path: "/reports", label: "Reports", icon: <FileText className="mr-3 h-5 w-5"/> },
        {
            path: "/alerts",
            label: "Alerts",
            icon: <Bell className="mr-3 h-5 w-5"/>,
            badge: unreadAlertsCount ? unreadAlertsCount : undefined
        },
        { path: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5"/> },
    ];
    // Function to determine keyword status class
    var getStatusClass = function (status) {
        switch (status) {
            case "active":
                return "before:bg-green-500"; // online
            case "warning":
                return "before:bg-yellow-500"; // warning
            case "danger":
                return "before:bg-red-500"; // danger
            default:
                return "before:bg-neutral-400"; // default
        }
    };
    // Hide sidebar on small screens if not open
    var sidebarClass = cn("w-full md:w-64 lg:w-72 bg-secondary border-r border-neutral-dark flex flex-col", "fixed md:static inset-0 z-50 transition-transform duration-300 ease-in-out", {
        "translate-x-0": isOpen,
        "-translate-x-full md:translate-x-0": !isOpen,
    });
    // Get a more user-friendly time format
    var formatFrequency = function (freq) {
        switch (freq) {
            case "24h": return "24h";
            case "12h": return "12h";
            case "7d": return "7d";
            case "3d": return "3d";
            default: return freq;
        }
    };
    var getKeywordStatus = function (keyword) {
        if (keyword.includes("cybercrime") || keyword.includes("ransom")) {
            return "warning";
        }
        else if (keyword.includes("data breach") || keyword.includes("leak")) {
            return "danger";
        }
        else if (keyword.includes("credit") || keyword.includes("card")) {
            return "active";
        }
        else {
            return "default";
        }
    };
    return (<aside className={sidebarClass}>
      <div className="p-5 border-b border-neutral-dark">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center glow-border">
            <RadarIcon className="text-primary h-6 w-6"/>
          </div>
          <h1 className="text-xl font-mono font-bold text-white glow-text">
            Dark<span className="text-primary cyber-glitch">Sentry</span>
          </h1>
        </div>
        <p className="text-xs mt-1 opacity-70">Dark Web Intelligence Platform</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <nav>
          <ul className="space-y-1">
            {navItems.map(function (item) { return (<li key={item.path}>
                <Link href={item.path}>
                  <span className={cn("flex items-center p-3 rounded-md transition-colors", location === item.path
                ? "bg-primary/10 text-primary"
                : "hover:bg-neutral-dark/50")}>
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && (<span className="ml-auto bg-destructive text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>)}
                  </span>
                </Link>
              </li>); })}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-neutral-dark/50">
            <h3 className="text-xs font-semibold uppercase text-neutral-light/50 mb-3 px-3">
              Monitored Keywords
            </h3>
            <ul className="space-y-1">
              {keywordsData ? (keywordsData.map(function (keyword) { return (<li key={keyword.id} className="flex items-center p-3 rounded-md hover:bg-neutral-dark/50 transition-colors">
                    <span className={cn("text-sm relative flex items-center pulse-dot", getStatusClass(getKeywordStatus(keyword.keyword)))}>
                      "{keyword.keyword}"
                    </span>
                    <span className="ml-auto text-xs text-neutral-light/50">
                      {formatFrequency(keyword.frequency)}
                    </span>
                  </li>); })) : (<li className="p-3 text-sm opacity-50">Loading keywords...</li>)}
            </ul>
          </div>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-neutral-dark">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-neutral-dark flex items-center justify-center">
            <User className="h-4 w-4"/>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Analyst</p>
            <p className="text-xs text-neutral-light/50">Security Team</p>
          </div>
          <button className="ml-auto text-neutral-light/50 hover:text-neutral-light">
            <LogOut className="h-4 w-4"/>
          </button>
        </div>
      </div>
    </aside>);
}
