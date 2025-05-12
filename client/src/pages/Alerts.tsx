import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { AlertItem } from "../lib/types";
import { 
  AlertCircle, 
  FileSearch, 
  Database, 
  UserSearch, 
  ShieldAlert, 
  Shield,
  Bell,
  Trash,
  CheckCircle,
  Filter
} from "lucide-react";
import { cn } from "../lib/utils";
import { Helmet } from "react-helmet";

export default function Alerts() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: alerts, isLoading } = useQuery<AlertItem[]>({
    queryKey: ['/api/alerts'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest('PATCH', `/api/alerts/${alertId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert updated",
        description: "Alert has been marked as read",
      });
    }
  });

  // Function to get time ago text from date
  const getTimeAgo = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  // Function to get the icon for each alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'credentials':
        return <Shield className="h-5 w-5 text-destructive" />;
      case 'mention':
        return <FileSearch className="h-5 w-5 text-yellow-500" />;
      case 'database':
        return <Database className="h-5 w-5 text-destructive" />;
      case 'executive':
        return <UserSearch className="h-5 w-5 text-primary" />;
      case 'intelligence':
        return <ShieldAlert className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Function to get the background color for the icon container
  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'credentials':
        return "bg-destructive/20";
      case 'mention':
        return "bg-yellow-500/20";
      case 'database':
        return "bg-destructive/20";
      case 'executive':
        return "bg-primary/20";
      case 'intelligence':
        return "bg-green-500/20";
      default:
        return "bg-muted";
    }
  };

  // Function to get the color for risk level badge
  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'medium':
        return 'bg-yellow-500 text-primary-foreground';
      case 'low':
        return 'bg-green-500/80 text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Function to get the button text based on alert type
  const getActionButtonText = (type: string) => {
    return type === 'intelligence' ? 'View Report' : 'Investigate';
  };

  // Filter alerts based on active tab
  const filteredAlerts = alerts ? alerts.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !alert.isRead;
    if (activeTab === 'critical') return alert.riskLevel === 'critical' || alert.riskLevel === 'high';
    return alert.type === activeTab;
  }) : [];

  // Handle marking an alert as read
  const handleMarkAsRead = (alertId: number) => {
    markAsReadMutation.mutate(alertId);
  };
  
  // Convert risk level to title case for display
  const formatRiskLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <>
      <Helmet>
        <title>Alerts | DarkSentry - Dark Web Monitoring Platform</title>
        <meta name="description" content="Monitor and respond to dark web threats and alerts in real-time with DarkSentry's cybersecurity platform." />
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Bell className="mr-3 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold font-mono text-white">Security Alerts</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-secondary border border-neutral-dark">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="critical" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Critical
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" className="bg-secondary border-neutral-dark h-10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 h-10">
              <Trash className="h-4 w-4 mr-2" />
              Clear All Read
            </Button>
          </div>
        </div>
        
        <Card className="border-neutral-dark bg-secondary">
          <CardHeader className="border-b border-neutral-dark">
            <div className="flex justify-between items-center">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                Security Alerts
                {!isLoading && filteredAlerts.length > 0 && (
                  <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/20">
                    {filteredAlerts.length}
                  </Badge>
                )}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {!isLoading && alerts && (
                  <>
                    {alerts.filter(a => !a.isRead).length} unread / {alerts.length} total
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {isLoading ? (
                <div className="divide-y divide-neutral-dark">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-start">
                        <Skeleton className="h-10 w-10 rounded-full mr-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAlerts.length > 0 ? (
                <div className="divide-y divide-neutral-dark">
                  {filteredAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={cn(
                        "p-4 hover:bg-neutral-dark/30 transition-colors",
                        alert.isRead ? "opacity-70" : ""
                      )}
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "rounded-full p-3 mr-4",
                          getIconBgColor(alert.type)
                        )}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white">{alert.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(alert.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{alert.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge className={getRiskLevelClass(alert.riskLevel)}>
                              {formatRiskLevel(alert.riskLevel)} Risk
                            </Badge>
                            <div className="flex gap-2">
                              {!alert.isRead && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-primary bg-primary/10 border-primary/20 hover:bg-primary/20"
                                  onClick={() => handleMarkAsRead(alert.id)}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Mark as Read
                                </Button>
                              )}
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                {getActionButtonText(alert.type)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No alerts found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {activeTab === 'all' 
                      ? "There are no alerts to display. Check back later or adjust your monitoring settings."
                      : `No ${activeTab === 'unread' ? 'unread' : activeTab} alerts found. Try a different filter.`}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
