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
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Checkbox } from "./components/ui/checkbox";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "./lib/queryClient";
import { useToast } from "./hooks/use-toast";
import { X, Settings, Eye } from "lucide-react";
export default function DarkWebSearch() {
    var _this = this;
    var toast = useToast().toast;
    var _a = useState(""), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = useState(""), newKeyword = _b[0], setNewKeyword = _b[1];
    var _c = useState(false), enableAlerts = _c[0], setEnableAlerts = _c[1];
    var _d = useState({
        networks: "all",
        contentType: "all",
        timeRange: "all",
        riskLevel: "all"
    }), searchOptions = _d[0], setSearchOptions = _d[1];
    var _e = useQuery({
        queryKey: ['/api/keywords'],
    }), monitoredKeywords = _e.data, keywordsLoading = _e.isLoading;
    var addKeywordMutation = useMutation({
        mutationFn: function (keyword) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('POST', '/api/keywords', {
                            keyword: keyword,
                            userId: 1, // Assuming the user ID is 1 for now
                            status: "active",
                            frequency: "24h"
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            setNewKeyword("");
            queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
            toast({
                title: "Keyword added",
                description: "The keyword has been added to monitoring.",
            });
        },
        onError: function (error) {
            toast({
                title: "Failed to add keyword",
                description: "There was an error adding the keyword.",
                variant: "destructive"
            });
        }
    });
    var deleteKeywordMutation = useMutation({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('DELETE', "/api/keywords/".concat(id), {})];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
            toast({
                title: "Keyword removed",
                description: "The keyword has been removed from monitoring.",
            });
        }
    });
    var searchMutation = useMutation({
        mutationFn: function (query) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('POST', '/api/search', __assign({ query: query }, searchOptions))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function (data) {
            toast({
                title: "Search complete",
                description: "Your search has been processed.",
            });
        },
        onError: function () {
            toast({
                title: "Search failed",
                description: "There was an error processing your search.",
                variant: "destructive"
            });
        }
    });
    var handleSearch = function (e) {
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
    var handleAddKeyword = function (e) {
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
    var handleDeleteKeyword = function (id) {
        deleteKeywordMutation.mutate(id);
    };
    var handleStartMonitoring = function () {
        toast({
            title: "Monitoring started",
            description: "Your keywords are now being monitored.",
        });
    };
    return (<Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <CardTitle className="font-mono font-semibold text-white">Dark Web Search</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSearch} className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Eye className="text-primary h-5 w-5"/>
          </div>
          <Input type="text" placeholder="Search the dark web for sensitive information..." className="bg-background border-neutral-dark pl-10 pr-4 py-3 text-sm w-full" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
          <Button type="submit" className="absolute inset-y-0 right-0 px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors" disabled={searchMutation.isPending}>
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        <div className="bg-background rounded-md border border-neutral-dark p-4 mb-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Advanced Search Options</h4>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              <Settings className="h-3 w-3 mr-1"/>
              <span>Configure</span>
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs block mb-1 text-muted-foreground">Search Networks</Label>
              <Select value={searchOptions.networks} onValueChange={function (value) { return setSearchOptions(__assign(__assign({}, searchOptions), { networks: value })); }}>
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
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
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
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
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
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
                <SelectTrigger className="w-full bg-secondary border-neutral-dark">
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
        </div>
        
        <div className="bg-background rounded-md border border-neutral-dark p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Add to Monitoring</h4>
            <span className="text-xs text-muted-foreground">Track results over time</span>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {keywordsLoading ? (<div className="text-xs text-muted-foreground">Loading keywords...</div>) : monitoredKeywords && monitoredKeywords.length > 0 ? (monitoredKeywords.map(function (keyword) { return (<div key={keyword.id} className="bg-secondary px-3 py-1 rounded-full text-xs flex items-center">
                    <span>"{keyword.keyword}"</span>
                    <button type="button" className="ml-2 text-muted-foreground hover:text-foreground" onClick={function () { return handleDeleteKeyword(keyword.id); }}>
                      <X className="h-3 w-3"/>
                    </button>
                  </div>); })) : (<div className="text-xs text-muted-foreground">No keywords monitored yet</div>)}
            </div>
            
            <form onSubmit={handleAddKeyword} className="flex items-center">
              <Input type="text" placeholder="Add new keyword to monitor..." className="flex-1 bg-secondary border-neutral-dark rounded-l-md" value={newKeyword} onChange={function (e) { return setNewKeyword(e.target.value); }}/>
              <Button type="submit" className="px-4 py-2 bg-green-500 text-background rounded-r-md hover:bg-green-500/90 transition-colors" disabled={addKeywordMutation.isPending}>
                Add
              </Button>
            </form>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="alert" checked={enableAlerts} onCheckedChange={function (checked) { return setEnableAlerts(checked); }} className="rounded bg-background border-neutral-dark text-primary focus:ring-primary"/>
                <Label htmlFor="alert" className="ml-2 text-xs">
                  Alert me when new results are found
                </Label>
              </div>
              <Button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs" onClick={handleStartMonitoring}>
                Start Monitoring
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);
}
