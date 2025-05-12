var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search as SearchIcon, Eye, Filter } from "lucide-react";
import { Helmet } from "react-helmet";
export default function Search() {
    var _this = this;
    var location = useLocation()[0];
    var toast = useToast().toast;
    var _a = useState(""), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = useState("all"), activeTab = _b[0], setActiveTab = _b[1];
    var _c = useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState([]), results = _d[0], setResults = _d[1];
    var _e = useState({
        networks: "all",
        contentType: "all",
        timeRange: "all",
        riskLevel: "all"
    }), searchOptions = _e[0], setSearchOptions = _e[1];
    // Parse search query from URL if present
    useEffect(function () {
        var searchParams = new URLSearchParams(location.split('?')[1]);
        var queryParam = searchParams.get('query');
        if (queryParam) {
            setSearchQuery(queryParam);
            handleSearch(queryParam);
        }
    }, [location]);
    var searchMutation = useMutation({
        mutationFn: function (query) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        return [4 /*yield*/, apiRequest('POST', '/api/search', __assign({ query: query }, searchOptions))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function (data) {
            setIsLoading(false);
            setResults(data.results || []);
            toast({
                title: "Search complete",
                description: "Search for \"".concat(searchQuery, "\" completed."),
            });
        },
        onError: function () {
            setIsLoading(false);
            toast({
                title: "Search failed",
                description: "There was an error processing your search.",
                variant: "destructive"
            });
        }
    });
    var handleSearch = function (query) {
        if (query === void 0) { query = searchQuery; }
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
    return (<>
      <Helmet>
        <title>Dark Web Search | DarkSentry</title>
        <meta name="description" content="Search the dark web for sensitive information, data breaches, and potential threats to your organization."/>
      </Helmet>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono text-white">Dark Web Search</h1>
          
          <Card className="mb-8 border-neutral-dark bg-secondary">
            <CardContent className="pt-6">
              <div className="mb-6">
                <form onSubmit={function (e) {
            e.preventDefault();
            handleSearch();
        }} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Eye className="text-primary h-5 w-5"/>
                  </div>
                  <Input type="text" placeholder="Search for sensitive information, data breaches, or potential threats..." className="bg-background border-neutral-dark pl-12 pr-4 py-6 text-lg w-full" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                  <Button type="submit" className="absolute inset-y-0 right-0 px-6 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                    <SearchIcon className="ml-2 h-4 w-4"/>
                  </Button>
                </form>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs block mb-1 text-muted-foreground">Search Networks</Label>
                  <Select value={searchOptions.networks} onValueChange={function (value) { return setSearchOptions(__assign(__assign({}, searchOptions), { networks: value })); }}>
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
                      <SelectValue placeholder="All Networks"/>
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
                  <Select value={searchOptions.contentType} onValueChange={function (value) { return setSearchOptions(__assign(__assign({}, searchOptions), { contentType: value })); }}>
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
                      <SelectValue placeholder="All Content"/>
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
                  <Select value={searchOptions.timeRange} onValueChange={function (value) { return setSearchOptions(__assign(__assign({}, searchOptions), { timeRange: value })); }}>
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
                      <SelectValue placeholder="All Time"/>
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
                  <Select value={searchOptions.riskLevel} onValueChange={function (value) { return setSearchOptions(__assign(__assign({}, searchOptions), { riskLevel: value })); }}>
                    <SelectTrigger className="w-full bg-background border-neutral-dark">
                      <SelectValue placeholder="All Levels"/>
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
              <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
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
              {isLoading ? (<div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching the dark web...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                </div>) : searchQuery ? (results.length > 0 ? (<div className="space-y-4">
                    {results.map(function (result, index) { return (<div key={index} className="border border-neutral-dark rounded-md p-4 bg-background/50">
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
                      </div>); })}
                  </div>) : (<div className="py-12 text-center">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-muted-foreground mt-2">Try adjusting your search terms or filters</p>
                  </div>)) : (<div className="py-12 text-center">
                  <p className="text-muted-foreground">Enter a search query to begin</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Search for sensitive information, mentions of your organization, or data breaches
                  </p>
                </div>)}
              
              <div className="bg-background/30 mt-6 rounded-md p-4 border border-neutral-dark">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <Eye className="h-4 w-4 text-primary"/>
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
    </>);
}
