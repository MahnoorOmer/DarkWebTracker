import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Globe, Shield, AlertTriangle, Database, User } from "lucide-react";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
export default function SourcesDisplay() {
    var _a = useState(true), scrapeActive = _a[0], setScrapeActive = _a[1];
    // Mock data for sources being monitored
    var sources = [
        {
            id: 1,
            name: "Dream Market Forums",
            type: "forum",
            status: "active",
            lastScrape: "10 minutes ago",
            recordsCollected: 2342,
            threatLevel: "high"
        },
        {
            id: 2,
            name: "Silk Road 4.0",
            type: "marketplace",
            status: "active",
            lastScrape: "15 minutes ago",
            recordsCollected: 1587,
            threatLevel: "critical"
        },
        {
            id: 3,
            name: "BlackHat Security",
            type: "forum",
            status: "active",
            lastScrape: "25 minutes ago",
            recordsCollected: 891,
            threatLevel: "medium"
        },
        {
            id: 4,
            name: "Hydra Market",
            type: "marketplace",
            status: "paused",
            lastScrape: "2 hours ago",
            recordsCollected: 3210,
            threatLevel: "high"
        },
        {
            id: 5,
            name: "DeepPaste",
            type: "paste",
            status: "active",
            lastScrape: "32 minutes ago",
            recordsCollected: 756,
            threatLevel: "low"
        }
    ];
    var getSourceIcon = function (type) {
        switch (type) {
            case "forum":
                return <User className="h-5 w-5 text-primary"/>;
            case "marketplace":
                return <Database className="h-5 w-5 text-destructive"/>;
            case "paste":
                return <Shield className="h-5 w-5 text-yellow-500"/>;
            default:
                return <Globe className="h-5 w-5 text-muted-foreground"/>;
        }
    };
    var getSourceTypeLabel = function (type) {
        switch (type) {
            case "forum":
                return "Forum";
            case "marketplace":
                return "Marketplace";
            case "paste":
                return "Paste Site";
            default:
                return "Unknown";
        }
    };
    var getStatusClass = function (status) {
        switch (status) {
            case "active":
                return "bg-green-500 text-white";
            case "paused":
                return "bg-yellow-500 text-white";
            case "error":
                return "bg-destructive text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    var getThreatLevelClass = function (level) {
        switch (level) {
            case "critical":
                return "bg-destructive text-white";
            case "high":
                return "bg-red-500/80 text-white";
            case "medium":
                return "bg-yellow-500 text-white";
            case "low":
                return "bg-green-500 text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    var toggleScrape = function () {
        setScrapeActive(!scrapeActive);
    };
    var totalRecords = sources.reduce(function (sum, source) { return sum + source.recordsCollected; }, 0);
    return (<Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono font-semibold text-white flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary"/>
            Dark Web Sources
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="scrape-mode" className="text-xs">
              {scrapeActive ? "Scraping Active" : "Scraping Paused"}
            </Label>
            <Switch id="scrape-mode" checked={scrapeActive} onCheckedChange={toggleScrape}/>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-background/30 border-b border-neutral-dark grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-3">
            <div className="text-3xl font-mono text-primary">{sources.length}</div>
            <div className="text-xs text-muted-foreground">Active Sources</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3">
            <div className="text-3xl font-mono text-yellow-500">{totalRecords.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Records Collected</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3">
            <div className="text-3xl font-mono text-destructive">15min</div>
            <div className="text-xs text-muted-foreground">Average Scan Frequency</div>
          </div>
        </div>
        
        <div className="divide-y divide-neutral-dark">
          {sources.map(function (source) { return (<div key={source.id} className="p-4 hover:bg-background/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={"rounded-full p-2 mr-3 ".concat(source.type === "forum" ? "bg-primary/20" :
                source.type === "marketplace" ? "bg-destructive/20" :
                    "bg-yellow-500/20")}>
                    {getSourceIcon(source.type)}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-white">{source.name}</h3>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2 text-[10px] px-1 py-0">
                        {getSourceTypeLabel(source.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Last scan: {source.lastScrape}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getThreatLevelClass(source.threatLevel)}>
                    {source.threatLevel.charAt(0).toUpperCase() + source.threatLevel.slice(1)}
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={getStatusClass(source.status)}>
                          {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Source is {source.status}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="mt-2 text-xs">
                <span className="text-primary">{source.recordsCollected.toLocaleString()}</span>
                <span className="text-muted-foreground"> records collected from this source</span>
              </div>
            </div>); })}
        </div>
        
        <div className="p-4 border-t border-neutral-dark">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" className="text-xs bg-background/30 border-neutral-dark text-primary">
              <Shield className="h-3.5 w-3.5 mr-1.5"/>
              Configure Sources
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-background/30 border-neutral-dark text-yellow-500">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5"/>
              Threat Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
}
