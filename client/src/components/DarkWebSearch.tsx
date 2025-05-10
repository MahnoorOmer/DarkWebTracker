import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SearchOptions, MonitoredKeyword } from "@/lib/types";
import { X, Search, Settings, Eye } from "lucide-react";

export default function DarkWebSearch() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    networks: "all",
    contentType: "all",
    timeRange: "all",
    riskLevel: "all"
  });

  const { data: monitoredKeywords, isLoading: keywordsLoading } = useQuery<MonitoredKeyword[]>({
    queryKey: ['/api/keywords'],
  });

  const addKeywordMutation = useMutation({
    mutationFn: async (keyword: string) => {
      return await apiRequest('POST', '/api/keywords', {
        keyword,
        userId: 1, // Assuming the user ID is 1 for now
        status: "active",
        frequency: "24h"
      });
    },
    onSuccess: () => {
      setNewKeyword("");
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      toast({
        title: "Keyword added",
        description: "The keyword has been added to monitoring.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add keyword",
        description: "There was an error adding the keyword.",
        variant: "destructive"
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

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest('POST', '/api/search', {
        query,
        ...searchOptions
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Search complete",
        description: "Your search has been processed.",
      });
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "There was an error processing your search.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term.",
        variant: "destructive"
      });
      return;
    }
    
    searchMutation.mutate(searchQuery);
  };

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
    
    addKeywordMutation.mutate(newKeyword);
  };

  const handleDeleteKeyword = (id: number) => {
    deleteKeywordMutation.mutate(id);
  };

  const handleStartMonitoring = () => {
    toast({
      title: "Monitoring started",
      description: "Your keywords are now being monitored.",
    });
  };

  return (
    <Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <CardTitle className="font-mono font-semibold text-white">Dark Web Search</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSearch} className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Eye className="text-primary h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Search the dark web for sensitive information..."
            className="bg-background border-neutral-dark pl-10 pr-4 py-3 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit"
            className="absolute inset-y-0 right-0 px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
            disabled={searchMutation.isPending}
          >
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        <div className="bg-background rounded-md border border-neutral-dark p-4 mb-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Advanced Search Options</h4>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              <Settings className="h-3 w-3 mr-1" />
              <span>Configure</span>
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs block mb-1 text-muted-foreground">Search Networks</Label>
              <Select 
                value={searchOptions.networks} 
                onValueChange={(value) => setSearchOptions({...searchOptions, networks: value})}
              >
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
                  <SelectValue placeholder="All Networks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="tor">Tor Network</SelectItem>
                  <SelectItem value="i2p">I2P</SelectItem>
                  <SelectItem value="forums">Closed Forums</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs block mb-1 text-muted-foreground">Content Type</Label>
              <Select 
                value={searchOptions.contentType} 
                onValueChange={(value) => setSearchOptions({...searchOptions, contentType: value})}
              >
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
                  <SelectValue placeholder="All Content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="marketplaces">Marketplaces</SelectItem>
                  <SelectItem value="forums">Forums</SelectItem>
                  <SelectItem value="paste">Paste Sites</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs block mb-1 text-muted-foreground">Time Range</Label>
              <Select 
                value={searchOptions.timeRange} 
                onValueChange={(value) => setSearchOptions({...searchOptions, timeRange: value})}
              >
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="24h">Past 24 Hours</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs block mb-1 text-muted-foreground">Risk Level</Label>
              <Select 
                value={searchOptions.riskLevel} 
                onValueChange={(value) => setSearchOptions({...searchOptions, riskLevel: value})}
              >
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-md border border-neutral-dark p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Add to Monitoring</h4>
            <span className="text-xs text-muted-foreground">Track results over time</span>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {keywordsLoading ? (
                <div className="text-xs text-muted-foreground">Loading keywords...</div>
              ) : monitoredKeywords && monitoredKeywords.length > 0 ? (
                monitoredKeywords.map((keyword) => (
                  <div key={keyword.id} className="bg-secondary px-3 py-1 rounded-full text-xs flex items-center">
                    <span>"{keyword.keyword}"</span>
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleDeleteKeyword(keyword.id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">No keywords monitored yet</div>
              )}
            </div>
            
            <form onSubmit={handleAddKeyword} className="flex items-center">
              <Input
                type="text"
                placeholder="Add new keyword to monitor..."
                className="flex-1 bg-secondary border-neutral-dark rounded-l-md"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
              <Button 
                type="submit"
                className="px-4 py-2 bg-green-500 text-background rounded-r-md hover:bg-green-500/90 transition-colors"
                disabled={addKeywordMutation.isPending}
              >
                Add
              </Button>
            </form>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="alert"
                  checked={enableAlerts}
                  onCheckedChange={(checked) => setEnableAlerts(checked as boolean)}
                  className="rounded bg-background border-neutral-dark text-primary focus:ring-primary"
                />
                <Label htmlFor="alert" className="ml-2 text-xs">
                  Alert me when new results are found
                </Label>
              </div>
              <Button
                className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs"
                onClick={handleStartMonitoring}
              >
                Start Monitoring
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
