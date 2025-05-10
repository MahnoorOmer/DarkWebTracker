import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { MonitoredKeyword } from "@/lib/types";
import { PlusCircle, Eye, Radar, AlertTriangle, X, Clock, Activity } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Monitoring() {
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");
  const [frequency, setFrequency] = useState("24h");
  const [formattedResults, setFormattedResults] = useState(true);
  const [autoAlerts, setAutoAlerts] = useState(true);
  
  const { data: keywords, isLoading } = useQuery<MonitoredKeyword[]>({
    queryKey: ['/api/keywords'],
  });
  
  const addKeywordMutation = useMutation({
    mutationFn: async (data: { keyword: string; frequency: string }) => {
      return await apiRequest('POST', '/api/keywords', {
        keyword: data.keyword,
        userId: 1,
        status: "active",
        frequency: data.frequency
      });
    },
    onSuccess: () => {
      setNewKeyword("");
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      toast({
        title: "Keyword added",
        description: "The keyword has been added to monitoring.",
      });
    }
  });
  
  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/keywords/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      toast({
        title: "Keyword removed",
        description: "The keyword has been removed from monitoring.",
      });
    }
  });
  
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to monitor.",
        variant: "destructive"
      });
      return;
    }
    
    addKeywordMutation.mutate({
      keyword: newKeyword,
      frequency
    });
  };
  
  // Get keyword status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "danger":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  // Get color based on frequency
  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case "12h":
        return "text-primary";
      case "24h":
        return "text-yellow-500";
      case "7d":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  // Last scan time for keywords (mock data)
  const getLastScanTime = (keywordId: number) => {
    const times = ['2 minutes ago', '15 minutes ago', '1 hour ago', '3 hours ago', '6 hours ago'];
    return times[keywordId % times.length];
  };
  
  // Simulate keyword status based on content
  const getKeywordStatus = (keyword: string) => {
    if (keyword.includes("cybercrime") || keyword.includes("ransom")) {
      return "warning";
    } else if (keyword.includes("data breach") || keyword.includes("leak")) {
      return "danger";
    } else if (keyword.includes("credit") || keyword.includes("card")) {
      return "active";
    } else {
      return "default";
    }
  };
  
  // Mock found matches for keywords
  const getFoundMatches = (keywordId: number) => {
    const counts = [0, 3, 12, 8, 21, 5];
    return counts[keywordId % counts.length];
  };

  return (
    <>
      <Helmet>
        <title>Monitoring | DarkSentry</title>
        <meta name="description" content="Monitor the dark web for keywords and sensitive information relevant to your organization." />
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Monitoring Configuration */}
          <div className="md:w-1/3">
            <Card className="border-neutral-dark bg-secondary h-full">
              <CardHeader className="border-b border-neutral-dark">
                <CardTitle className="font-mono font-semibold text-white">
                  <div className="flex items-center">
                    <Radar className="mr-2 h-5 w-5 text-primary" />
                    Monitoring Configuration
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleAddKeyword}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyword" className="text-sm">Add Keyword</Label>
                      <div className="flex mt-1">
                        <Input
                          id="keyword"
                          placeholder="Enter keyword to monitor..."
                          className="flex-1 bg-background border-neutral-dark rounded-l-md"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                        />
                        <Button 
                          type="submit"
                          className="bg-primary text-primary-foreground rounded-r-md px-3"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency" className="text-sm">Scan Frequency</Label>
                      <Select 
                        value={frequency} 
                        onValueChange={setFrequency}
                      >
                        <SelectTrigger id="frequency" className="w-full bg-background border-neutral-dark mt-1">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">Every 12 hours</SelectItem>
                          <SelectItem value="24h">Daily</SelectItem>
                          <SelectItem value="3d">Every 3 days</SelectItem>
                          <SelectItem value="7d">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator className="my-4 bg-neutral-dark" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Formatted Results</Label>
                          <p className="text-xs text-muted-foreground">Clean and normalize found data</p>
                        </div>
                        <Switch
                          checked={formattedResults}
                          onCheckedChange={setFormattedResults}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Automatic Alerts</Label>
                          <p className="text-xs text-muted-foreground">Notify when new matches found</p>
                        </div>
                        <Switch
                          checked={autoAlerts}
                          onCheckedChange={setAutoAlerts}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-background/30 rounded-md p-3 border border-neutral-dark mt-4">
                      <div className="flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        <span>Monitoring Status:</span>
                        <span className="ml-auto font-semibold text-green-500">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Next scan scheduled in 32 minutes
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Monitored Keywords */}
          <div className="md:w-2/3">
            <Card className="border-neutral-dark bg-secondary h-full">
              <CardHeader className="border-b border-neutral-dark">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-mono font-semibold text-white">
                    <div className="flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-primary" />
                      Monitored Keywords
                    </div>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Total: {keywords?.length || 0} keywords
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-background/30">
                    <TableRow className="hover:bg-transparent border-neutral-dark">
                      <TableHead>Keyword</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Scan</TableHead>
                      <TableHead>Found</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Loading monitored keywords...
                        </TableCell>
                      </TableRow>
                    ) : keywords && keywords.length > 0 ? (
                      keywords.map((keyword) => (
                        <TableRow key={keyword.id} className="border-neutral-dark hover:bg-background/10">
                          <TableCell className="font-mono">"{keyword.keyword}"</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(getKeywordStatus(keyword.keyword))}`}>
                              {getKeywordStatus(keyword.keyword) === "active" ? "Active" : 
                               getKeywordStatus(keyword.keyword) === "warning" ? "Warning" : 
                               getKeywordStatus(keyword.keyword) === "danger" ? "Alert" : "Normal"}
                            </span>
                          </TableCell>
                          <TableCell className={getFrequencyColor(keyword.frequency)}>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Every {keyword.frequency}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {getLastScanTime(keyword.id)}
                          </TableCell>
                          <TableCell>
                            {getFoundMatches(keyword.id) > 0 ? (
                              <div className="flex items-center">
                                <span className="text-destructive font-semibold">{getFoundMatches(keyword.id)}</span>
                                <AlertTriangle className="h-3 w-3 ml-1 text-yellow-500" />
                              </div>
                            ) : (
                              <span className="text-green-500">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteKeywordMutation.mutate(keyword.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No keywords being monitored. Add keywords to start monitoring.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
