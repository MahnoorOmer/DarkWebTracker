import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Eye, Filter } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Search() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchOptions, setSearchOptions] = useState({
    networks: "all",
    contentType: "all",
    timeRange: "all",
    riskLevel: "all"
  });

  // Parse search query from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    }
  }, [location]);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/search', {
        query,
        ...searchOptions
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setIsLoading(false);
      setResults(data.results || []);
      toast({
        title: "Search complete",
        description: `Search for "${searchQuery}" completed.`,
      });
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Search failed",
        description: "There was an error processing your search.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term.",
        variant: "destructive"
      });
      return;
    }
    
    searchMutation.mutate(query);
  };

  return (
    <>
      <Helmet>
        <title>Dark Web Search | DarkSentry</title>
        <meta name="description" content="Search the dark web for sensitive information, data breaches, and potential threats to your organization." />
      </Helmet>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono text-white">Dark Web Search</h1>
          
          <Card className="mb-8 border-neutral-dark bg-secondary">
            <CardContent className="pt-6">
              <div className="mb-6">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Eye className="text-primary h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for sensitive information, data breaches, or potential threats..."
                    className="bg-background border-neutral-dark pl-12 pr-4 py-6 text-lg w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="absolute inset-y-0 right-0 px-6 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                    <SearchIcon className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs block mb-1 text-muted-foreground">Search Networks</Label>
                  <Select 
                    value={searchOptions.networks} 
                    onValueChange={(value) => setSearchOptions({...searchOptions, networks: value})}
                  >
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
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
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
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
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
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
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
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
            </CardContent>
          </Card>
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-mono text-white">Search Results</h2>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-secondary border border-neutral-dark">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="forums">Forums</TabsTrigger>
                  <TabsTrigger value="marketplaces">Markets</TabsTrigger>
                  <TabsTrigger value="paste">Paste</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <Card className="border-neutral-dark bg-secondary">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching the dark web...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              ) : searchQuery ? (
                results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="border border-neutral-dark rounded-md p-4 bg-background/50">
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-muted-foreground mt-2">Try adjusting your search terms or filters</p>
                  </div>
                )
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Enter a search query to begin</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Search for sensitive information, mentions of your organization, or data breaches
                  </p>
                </div>
              )}
              
              <div className="bg-background/30 mt-6 rounded-md p-4 border border-neutral-dark">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Start Monitoring Search Terms</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add your search terms to continuous monitoring to receive alerts
                    </p>
                  </div>
                  <Button className="ml-auto bg-primary text-primary-foreground text-xs" size="sm">
                    Add to Monitoring
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
