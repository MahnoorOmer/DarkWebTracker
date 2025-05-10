import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ThreatCategoryItem } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  growth: number;
}

export default function ThreatCategoriesChart() {
  const [timeRange, setTimeRange] = useState("7d");
  const chartRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading } = useQuery<ThreatCategoryItem[]>({
    queryKey: ['/api/categories'],
  });

  const transformedData: ChartDataItem[] = categories ? categories.map(category => ({
    name: category.category,
    value: category.percentage,
    color: category.color,
    growth: category.growth
  })) : [];

  const highestGrowth = categories ? 
    [...categories].sort((a, b) => b.growth - a.growth)[0] : 
    undefined;

  const mostFrequent = categories ? 
    [...categories].sort((a, b) => b.percentage - a.percentage)[0] : 
    undefined;

  const mostSevere = { 
    category: "Targeted Attacks", 
    severity: 8.2 
  };

  return (
    <Card className="border-neutral-dark bg-secondary">
      <CardHeader className="border-b border-neutral-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono font-semibold text-white">Threat Categories</CardTitle>
          <div className="flex items-center space-x-2">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-background border-neutral-dark h-8 w-[130px] text-xs">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-[300px] w-full rounded-md" />
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-[300px] w-full rounded-md overflow-hidden bg-secondary/50 grid-pattern">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {transformedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 33, 48, 0.9)',
                      borderColor: 'rgba(42, 46, 58, 1)',
                      borderRadius: '0.375rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-background p-3 rounded-md border border-neutral-dark">
                <div className="text-xs text-muted-foreground">Highest Growth</div>
                <div className="font-mono text-destructive">
                  {highestGrowth?.category || "Loading"}
                </div>
                <div className="text-xs">
                  +{highestGrowth?.growth || 0}% this month
                </div>
              </div>
              <div className="bg-background p-3 rounded-md border border-neutral-dark">
                <div className="text-xs text-muted-foreground">Most Frequent</div>
                <div className="font-mono text-yellow-500">
                  {mostFrequent?.category || "Loading"}
                </div>
                <div className="text-xs">
                  {mostFrequent?.percentage || 0}% of all threats
                </div>
              </div>
              <div className="bg-background p-3 rounded-md border border-neutral-dark">
                <div className="text-xs text-muted-foreground">Most Severe</div>
                <div className="font-mono text-primary">
                  {mostSevere.category}
                </div>
                <div className="text-xs">
                  Avg. severity: {mostSevere.severity}/10
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
