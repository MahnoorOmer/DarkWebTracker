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
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useQuery, useMutation } from "./tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { apiRequest } from "./lib/queryClient";
import { Skeleton } from "./components/ui/skeleton";
import { cn } from "./lib/utils";
import { AlertCircle, FileSearch, Database, UserSearch, ShieldAlert, Shield } from "lucide-react";
export default function AlertsList() {
    var _this = this;
    var _a = useQuery({
        queryKey: ['/api/alerts'],
    }), alerts = _a.data, isLoading = _a.isLoading;
    var markAsReadMutation = useMutation({
        mutationFn: function (alertId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('PATCH', "/api/alerts/".concat(alertId, "/read"), {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
        }
    });
    // Get time ago text from date
    useEffect(function () {
        if (!alerts)
            return;
    }, [alerts]);
    var getTimeAgo = function (dateString) {
        var date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        var now = new Date();
        var diffMs = now.getTime() - date.getTime();
        var diffSec = Math.round(diffMs / 1000);
        var diffMin = Math.round(diffSec / 60);
        var diffHour = Math.round(diffMin / 60);
        var diffDay = Math.round(diffHour / 24);
        if (diffSec < 60)
            return "".concat(diffSec, "s ago");
        if (diffMin < 60)
            return "".concat(diffMin, "m ago");
        if (diffHour < 24)
            return "".concat(diffHour, "h ago");
        if (diffDay < 7)
            return "".concat(diffDay, "d ago");
        return date.toLocaleDateString();
    };
    var getAlertIcon = function (type) {
        switch (type) {
            case 'credentials':
                return <Shield className="text-destructive"/>;
            case 'mention':
                return <FileSearch className="text-yellow-500"/>;
            case 'database':
                return <Database className="text-destructive"/>;
            case 'executive':
                return <UserSearch className="text-primary"/>;
            case 'intelligence':
                return <ShieldAlert className="text-green-500"/>;
            default:
                return <AlertCircle className="text-muted-foreground"/>;
        }
    };
    var getRiskLevelClass = function (level) {
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
    var handleInvestigate = function (alertId) {
        markAsReadMutation.mutate(alertId);
    };
    return (<Card className="border-neutral-dark bg-secondary h-full">
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
          {isLoading ? (Array.from({ length: 5 }).map(function (_, i) { return (<div key={i} className="border-b border-neutral-dark p-4">
                <div className="flex items-start">
                  <Skeleton className="rounded-full h-10 w-10 mr-3"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32 mb-2"/>
                      <Skeleton className="h-3 w-12"/>
                    </div>
                    <Skeleton className="h-3 w-full mb-2"/>
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-3 w-16"/>
                      <Skeleton className="h-3 w-24 ml-auto"/>
                    </div>
                  </div>
                </div>
              </div>); })) : (alerts === null || alerts === void 0 ? void 0 : alerts.map(function (alert) { return (<div key={alert.id} className={cn("border-b border-neutral-dark hover:bg-neutral-dark/30 transition-colors p-4", alert.isRead ? "opacity-60" : "")}>
                <div className="flex items-start">
                  <div className={cn("rounded-full p-2 mr-3", alert.type === 'credentials' ? "bg-destructive/20" :
                alert.type === 'mention' ? "bg-yellow-500/20" :
                    alert.type === 'database' ? "bg-destructive/20" :
                        alert.type === 'executive' ? "bg-primary/20" :
                            "bg-green-500/20")}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                      <span className="text-xs text-neutral-light/50">{getTimeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="text-xs mt-1">{alert.description}</p>
                    <div className="flex items-center mt-2">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full", getRiskLevelClass(alert.riskLevel))}>
                        {alert.riskLevel.charAt(0).toUpperCase() + alert.riskLevel.slice(1)} Risk
                      </span>
                      <Button variant="link" size="sm" className="ml-auto text-xs text-primary h-auto p-0" onClick={function () { return handleInvestigate(alert.id); }}>
                        {alert.type === 'intelligence' ? 'View Report' : 'Investigate'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>); }))}
        </ScrollArea>
      </CardContent>
    </Card>);
}
