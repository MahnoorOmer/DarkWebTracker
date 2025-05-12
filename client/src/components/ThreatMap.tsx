import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface ThreatMapProps {
  activeScans?: number;
  threats?: number;
  dataAnalyzed?: number;
  topRegion?: string;
  topRegionPercentage?: number;
  topAttack?: string;
  topAttackPercentage?: number;
  networkStatus?: "online" | "offline" | "degraded";
  lastUpdate?: string;
}

export default function ThreatMap({
  activeScans = 14,
  threats = 37,
  dataAnalyzed = 1.3,
  topRegion = "Eastern Europe",
  topRegionPercentage = 32,
  topAttack = "Credential Theft",
  topAttackPercentage = 24,
  networkStatus = "online",
  lastUpdate = "2m ago"
}: ThreatMapProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const mapRef = useRef<HTMLDivElement>(null);
  
  // This would be replaced with actual visualization code in a production app
  // using D3.js, Three.js, or a similar visualization library
  useEffect(() => {
    if (!mapRef.current) return;
    
    // For demo purposes, we'll just create a simple grid with animated threat nodes
    const container = mapRef.current;
    
    // Clear previous content
    container.innerHTML = "";
    
    // Create world map grid background
    container.style.background = "radial-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px)";
    container.style.backgroundSize = "30px 30px";
    
    // Add scanner line
    const scannerLine = document.createElement("div");
    scannerLine.className = "absolute h-0.5 w-full animate-scan";
    scannerLine.style.background = "linear-gradient(90deg, rgba(0,229,255,0) 0%, rgba(0,229,255,0.8) 50%, rgba(0,229,255,0) 100%)";
    container.appendChild(scannerLine);
    
    // Add threat nodes
    const threatLocations = [
      { top: "30%", left: "25%", size: "2", color: "bg-destructive" },
      { top: "50%", left: "33%", size: "3", color: "bg-yellow-500" },
      { top: "66%", right: "25%", size: "2", color: "bg-primary" },
      { top: "25%", right: "33%", size: "2", color: "bg-destructive" },
      { top: "75%", left: "33%", size: "3", color: "bg-green-500" }
    ];
    
    threatLocations.forEach((location) => {
      const node = document.createElement("div");
      const positioning: Record<string, string> = {};
      
      Object.entries(location).forEach(([key, value]) => {
        if (key !== "size" && key !== "color") {
          positioning[key] = value;
        }
      });
      
      Object.assign(node.style, positioning);
      
      node.className = cn(
        "absolute h-" + location.size + " w-" + location.size + " rounded-full animate-pulse",
        location.color
      );
      
      container.appendChild(node);
    });
    
    return () => {
      // Cleanup
      container.innerHTML = "";
    };
  }, [timeRange]);
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "online":
        return "before:bg-green-500";
      case "degraded":
        return "before:bg-yellow-500";
      case "offline":
        return "before:bg-red-500";
      default:
        return "";
    }
  };

  return (
    <Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono font-semibold text-white">Global Threat Activity</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === "24h" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleTimeRangeChange("24h")}
              className="text-xs"
            >
              24h
            </Button>
            <Button 
              variant={timeRange === "7d" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleTimeRangeChange("7d")}
              className="bg-primary/20 text-primary text-xs"
            >
              7d
            </Button>
            <Button 
              variant={timeRange === "30d" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleTimeRangeChange("30d")}
              className="text-xs"
            >
              30d
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="relative h-[400px] overflow-hidden">
          {/* Map visualization */}
          <div 
            ref={mapRef}
            className="relative w-full h-full rounded-md overflow-hidden bg-background/50 glow-border cyber-panel"
          ></div>
          
          {/* Stats overlays */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-md border border-neutral-dark text-xs font-mono">
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-muted-foreground">Active Scans</div>
                <div className="text-primary">{activeScans} <span className="text-muted-foreground">networks</span></div>
              </div>
              <div>
                <div className="text-muted-foreground">Threats</div>
                <div className="text-destructive">{threats} <span className="text-muted-foreground">detected</span></div>
              </div>
              <div>
                <div className="text-muted-foreground">Data</div>
                <div className="text-green-500">{dataAnalyzed} <span className="text-muted-foreground">TB analyzed</span></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-secondary border border-neutral-dark rounded-md p-3">
            <div className="text-xs text-muted-foreground">Top Region</div>
            <div className="text-sm font-mono mt-1">{topRegion}</div>
            <div className="text-xs text-destructive">{topRegionPercentage}% of threats</div>
          </div>
          <div className="bg-secondary border border-neutral-dark rounded-md p-3">
            <div className="text-xs text-muted-foreground">Top Attack</div>
            <div className="text-sm font-mono mt-1">{topAttack}</div>
            <div className="text-xs text-yellow-500">{topAttackPercentage}% of attacks</div>
          </div>
          <div className="bg-secondary border border-neutral-dark rounded-md p-3">
            <div className="text-xs text-muted-foreground">Network Status</div>
            <div className={cn("text-sm font-mono mt-1 relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full", getStatusClass(networkStatus))}>
              Monitoring {networkStatus === "online" ? "Active" : networkStatus === "degraded" ? "Degraded" : "Offline"}
            </div>
            <div className="text-xs text-muted-foreground">Updated {lastUpdate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
