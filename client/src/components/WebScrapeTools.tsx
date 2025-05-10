import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Code, Globe, Network, TerminalSquare, Wrench, RotateCw, Play, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WebScrapeTools() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("scrape");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [scrapeInterval, setScrapeInterval] = useState("15min");
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [torRouting, setTorRouting] = useState(true);
  const [limitedThreads, setLimitedThreads] = useState(true);
  const [mockCommandOutput, setMockCommandOutput] = useState("");
  
  const handleNewSource = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sourceName.trim() || !sourceUrl.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a source name and URL",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Source added",
      description: `${sourceName} has been added to the scraping queue`,
    });
    
    // Simulate terminal output
    setMockCommandOutput(prev => 
      `${prev}\n> Adding new source: ${sourceName}\n> URL: ${sourceUrl}\n> Config: interval=${scrapeInterval}, proxy=${proxyEnabled ? "enabled" : "disabled"}, tor=${torRouting ? "enabled" : "disabled"}\n> Source added successfully\n`
    );
    
    // Reset form
    setSourceName("");
    setSourceUrl("");
  };
  
  const handleTestScraper = () => {
    // Simulate terminal output for test scraper
    setMockCommandOutput(prev => 
      `${prev}\n> Testing scraper configuration...\n> Proxy status: ${proxyEnabled ? "Connected" : "Disabled"}\n> Tor routing: ${torRouting ? "Active" : "Disabled"}\n> Anonymity check... PASSED\n> Connectivity test... PASSED\n> Test complete\n`
    );
    
    toast({
      title: "Test successful",
      description: "Scraper configuration tested successfully",
    });
  };
  
  const handleRunScraper = () => {
    // Simulate terminal output for running scraper
    setMockCommandOutput(prev => 
      `${prev}\n> Initializing web scraper...\n> Loading 5 sources\n> Establishing connection...\n> [SOURCE 1] Connecting to Dream Market Forums\n> [SOURCE 1] Starting extraction\n> [SOURCE 2] Connecting to Silk Road 4.0\n> [SOURCE 2] Starting extraction\n> ...\n`
    );
    
    toast({
      title: "Scraper started",
      description: "Web scraper is now running in the background",
    });
  };
  
  return (
    <Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono font-semibold text-white flex items-center">
            <Code className="mr-2 h-5 w-5 text-primary" />
            Web Scraping Tools
          </CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-background border border-neutral-dark h-8">
              <TabsTrigger value="scrape" className="text-xs h-6">Config</TabsTrigger>
              <TabsTrigger value="terminal" className="text-xs h-6">Terminal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {activeTab === "scrape" ? (
          <div className="space-y-4">
            <form onSubmit={handleNewSource}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source-name" className="text-sm">Source Name</Label>
                  <Input
                    id="source-name"
                    placeholder="e.g., Dark Forum"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="mt-1 bg-background border-neutral-dark"
                  />
                </div>
                <div>
                  <Label htmlFor="source-url" className="text-sm">Source URL (onion/i2p)</Label>
                  <Input
                    id="source-url"
                    placeholder="e.g., http://examplexyzabcd.onion"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="mt-1 bg-background border-neutral-dark"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="scrape-interval" className="text-sm">Scrape Interval</Label>
                <Select
                  value={scrapeInterval}
                  onValueChange={setScrapeInterval}
                >
                  <SelectTrigger id="scrape-interval" className="w-full bg-background border-neutral-dark mt-1">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">Every 5 minutes</SelectItem>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="30min">Every 30 minutes</SelectItem>
                    <SelectItem value="1h">Every hour</SelectItem>
                    <SelectItem value="12h">Every 12 hours</SelectItem>
                    <SelectItem value="24h">Every 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4 bg-neutral-dark" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Use Proxy Rotation</Label>
                    <p className="text-xs text-muted-foreground">Rotate through proxy servers for anonymity</p>
                  </div>
                  <Switch
                    checked={proxyEnabled}
                    onCheckedChange={setProxyEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Route Through Tor</Label>
                    <p className="text-xs text-muted-foreground">Send all requests through the Tor network</p>
                  </div>
                  <Switch
                    checked={torRouting}
                    onCheckedChange={setTorRouting}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Rate Limiting</Label>
                    <p className="text-xs text-muted-foreground">Limit threads and requests to avoid detection</p>
                  </div>
                  <Switch
                    checked={limitedThreads}
                    onCheckedChange={setLimitedThreads}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <Button type="button" variant="outline" className="bg-background/30 border-neutral-dark text-primary" onClick={handleTestScraper}>
                  <Wrench className="h-4 w-4 mr-2" />
                  Test Configuration
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  Add New Source
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-background rounded-md border border-neutral-dark h-64 p-3 font-mono text-xs overflow-auto">
              <div className="text-green-500">
                {mockCommandOutput || "> Web scraper terminal\n> Type commands or use the buttons below\n>"}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="bg-background/30 border-neutral-dark text-primary" onClick={handleRunScraper}>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Run Scraper
              </Button>
              <Button variant="outline" size="sm" className="bg-background/30 border-neutral-dark text-yellow-500">
                <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                Update Sources
              </Button>
              <Button variant="outline" size="sm" className="bg-background/30 border-neutral-dark text-destructive">
                <Network className="h-3.5 w-3.5 mr-1.5" />
                Test Tor Connection
              </Button>
              <Button variant="outline" size="sm" className="bg-background/30 border-neutral-dark text-muted-foreground">
                <TerminalSquare className="h-3.5 w-3.5 mr-1.5" />
                Clear Terminal
              </Button>
            </div>
            
            <div className="flex items-center p-2 bg-background/30 rounded-md border border-neutral-dark">
              <Input 
                placeholder="Enter command..." 
                className="flex-1 bg-transparent border-none text-xs focus-visible:ring-0 h-6 py-0 font-mono"
              />
              <Button size="sm" variant="ghost" className="h-6 px-2 py-0">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}