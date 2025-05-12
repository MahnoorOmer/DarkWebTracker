import { cn } from "../lib/utils";
import { Progress } from "../components/ui/progress";
export default function StatusCard(_a) {
    var title = _a.title, value = _a.value, _b = _a.changePercentage, changePercentage = _b === void 0 ? 0 : _b, _c = _a.changeDescription, changeDescription = _c === void 0 ? "from last week" : _c, icon = _a.icon, progressPercentage = _a.progressPercentage, progressColor = _a.progressColor;
    var isPositive = changePercentage >= 0;
    return (<div className="card p-5 border border-neutral-dark bg-secondary rounded-md transition-transform hover:-translate-y-1 shadow-md hover:shadow-primary/5 cyber-panel">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-mono font-bold text-foreground mt-1">{value}</h3>
          <div className="flex items-center mt-1">
            <span className={cn("text-xs", isPositive ? "text-primary" : "text-destructive")}>
              {isPositive && "+"}{changePercentage}%{" "}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{changeDescription}</span>
          </div>
        </div>
        <div className={cn("h-12 w-12 rounded-md flex items-center justify-center", "bg-".concat(progressColor, "/10"))}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <Progress value={progressPercentage} className={"h-1 w-full bg-primary/10"} 
    // Custom styling applied via CSS for the indicator
    style={{
            '--progress-color': "var(--".concat(progressColor, ")")
        }}/>
      </div>
    </div>);
}
