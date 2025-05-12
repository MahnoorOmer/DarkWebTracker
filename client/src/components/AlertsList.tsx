import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { AlertItem } from "../lib/types";
import { apiRequest } from "../lib/queryClient";
import { Skeleton } from "../components/ui/skeleton";
import { cn } from "../lib/utils";
import {
  AlertCircle,
  FileSearch,
  Database,
  UserSearch,
  ShieldAlert,
  Shield
} from "lucide-react";

export default function AlertsList() {
  const { data: alerts, isLoading } = useQuery<AlertItem[]>({
    queryKey: ['/api/alerts'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest('PATCH', `/api/alerts/${alertId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });

  // Get time ago text from date
  useEffect(() => {
    if (!alerts) return;
  }, [alerts]);

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'credentials':
        return <Shield className="text-destructive" />;
      case 'mention':
        return <FileSearch className="text-yellow-500" />;
      case 'database':
        return <Database className="text-destructive" />;
      case 'executive':
        return <UserSearch className="text-primary" />;
      case 'intelligence':
        return <ShieldAlert className="text-green-500" />;
      default:
        return <AlertCircle className="text-muted-foreground" />;
    }
  };

  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'high':
        return 'bg-destructive/20 text-destructive';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-green-500/20 text-green-500';
    }
  };

  const handleInvestigate = (alertId: number) => {
    markAsReadMutation.mutate(alertId);
  };

  return (
    <Card className="border-neutral-dark bg-secondary h-full">
      <CardHeader className="border-b border-neutral-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono font-semibold text-white">Recent Alerts</CardTitle>
          <Button variant="link" size="sm" className="text-primary text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <ScrollArea className="h-[500px] border-0 rounded-none">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-neutral-dark p-4">
                <div className="flex items-start">
                  <Skeleton className="rounded-full h-10 w-10 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full mb-2" />
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24 ml-auto" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            alerts?.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "border-b border-neutral-dark hover:bg-neutral-dark/30 transition-colors p-4",
                  alert.isRead ? "opacity-60" : ""
                )}
              >
                <div className="flex items-start">
                  <div className={cn(
                    "rounded-full p-2 mr-3",
                    alert.type === 'credentials' ? "bg-destructive/20" :
                    alert.type === 'mention' ? "bg-yellow-500/20" :
                    alert.type === 'database' ? "bg-destructive/20" :
                    alert.type === 'executive' ? "bg-primary/20" :
                    "bg-green-500/20"
                  )}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                      <span className="text-xs text-neutral-light/50">{getTimeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="text-xs mt-1">{alert.description}</p>
                    <div className="flex items-center mt-2">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full",
                        getRiskLevelClass(alert.riskLevel)
                      )}>
                        {alert.riskLevel.charAt(0).toUpperCase() + alert.riskLevel.slice(1)} Risk
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-auto text-xs text-primary h-auto p-0"
                        onClick={() => handleInvestigate(alert.id)}
                      >
                        {alert.type === 'intelligence' ? 'View Report' : 'Investigate'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
