import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, FileText, Key, Radar, AlertCircle } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import ThreatMap from "@/components/ThreatMap";
import AlertsList from "@/components/AlertsList";
import ThreatCategoriesChart from "@/components/ThreatCategoriesChart";
import DarkWebSearch from "@/components/DarkWebSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreatStatsData } from "@/lib/types";
import { Helmet } from "react-helmet";

export default function Dashboard() {
  const { data: threatStats, isLoading } = useQuery<ThreatStatsData>({
    queryKey: ['/api/stats'],
  });

  // Add grid background animation effect
  useEffect(() => {
    const addGridBackground = () => {
      const gridBg = document.createElement('div');
      gridBg.className = 'fixed inset-0 -z-10 grid-background';
      gridBg.style.backgroundSize = '50px 50px';
      gridBg.style.backgroundImage = `
        linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)
      `;
      document.body.appendChild(gridBg);
      
      return () => {
        document.body.removeChild(gridBg);
      };
    };
    
    return addGridBackground();
  }, []);

  const statusCards = [
    {
      title: "Active Threats",
      value: threatStats?.activeThreats || 0,
      changePercentage: threatStats?.weeklyChange.activeThreats || 0,
      icon: <Shield className="text-destructive text-2xl" />,
      progressPercentage: 65,
      progressColor: "destructive"
    },
    {
      title: "Data Leaks",
      value: threatStats?.dataLeaks || 0,
      changePercentage: threatStats?.weeklyChange.dataLeaks || 0,
      icon: <FileText className="text-yellow-500 text-2xl" />,
      progressPercentage: 45,
      progressColor: "yellow-500"
    },
    {
      title: "Credentials Found",
      value: threatStats?.credentialsFound || 0,
      changePercentage: threatStats?.weeklyChange.credentialsFound || 0,
      icon: <Key className="text-primary text-2xl" />,
      progressPercentage: 75,
      progressColor: "primary"
    },
    {
      title: "Monitored Keywords",
      value: threatStats?.monitoredKeywords || 0,
      changePercentage: 0,
      changeDescription: "across networks",
      icon: <Radar className="text-green-500 text-2xl" />,
      progressPercentage: 90,
      progressColor: "green-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | DarkSentry - Dark Web Monitoring Platform</title>
        <meta name="description" content="Monitor dark web threats, data leaks, and credentials with real-time threat intelligence and visualization." />
      </Helmet>
      
      <div className="p-6">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : (
            statusCards.map((card, index) => (
              <StatusCard
                key={index}
                title={card.title}
                value={card.value}
                changePercentage={card.changePercentage}
                changeDescription={card.changeDescription}
                icon={card.icon}
                progressPercentage={card.progressPercentage}
                progressColor={card.progressColor}
              />
            ))
          )}
        </div>
        
        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Map Section (Larger Column) */}
          <div className="lg:col-span-2">
            <ThreatMap />
          </div>
          
          {/* Recent Activity Column */}
          <div className="lg:col-span-1">
            <AlertsList />
          </div>
        </div>
        
        {/* Bottom Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Threat Types Analysis */}
          <ThreatCategoriesChart />
          
          {/* Search and Monitor */}
          <DarkWebSearch />
        </div>
      </div>
    </>
  );
}
