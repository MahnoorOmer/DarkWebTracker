import { cn } from "../lib/utils";
import { Progress } from "../components/ui/progress";
import { StatusCardProps } from "../lib/types";

export default function StatusCard({
  title,
  value,
  changePercentage = 0,
  changeDescription = "from last week",
  icon,
  progressPercentage,
  progressColor
}: StatusCardProps) {
  const isPositive = changePercentage >= 0;
  
  return (
    <div className="card p-5 border border-neutral-dark bg-secondary rounded-md transition-transform hover:-translate-y-1 shadow-md hover:shadow-primary/5 cyber-panel">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-mono font-bold text-foreground mt-1">{value}</h3>
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-xs",
              isPositive ? "text-primary" : "text-destructive"
            )}>
              {isPositive && "+"}{changePercentage}%{" "}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{changeDescription}</span>
          </div>
        </div>
        <div className={cn(
          "h-12 w-12 rounded-md flex items-center justify-center",
          `bg-${progressColor}/10`
        )}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <Progress 
          value={progressPercentage} 
          className={`h-1 w-full bg-primary/10`}
          // Custom styling applied via CSS for the indicator
          style={{
            '--progress-color': `var(--${progressColor})`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
