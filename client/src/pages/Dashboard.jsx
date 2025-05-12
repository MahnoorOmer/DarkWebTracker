import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, FileText, Key, Radar } from "lucide-react";
import StatusCard from "../components/StatusCard";
import ThreatMap from "../components/ThreatMap";
import AlertsList from "../components/AlertsList";
import ThreatCategoriesChart from "../components/ThreatCategoriesChart";
import DarkWebSearch from "../components/DarkWebSearch";
import SourcesDisplay from "../components/SourcesDisplay";
import WebScrapeTools from "../components/WebScrapeTools";
import { Skeleton } from "../components/ui/skeleton";
import { Helmet } from "react-helmet";
export default function Dashboard() {
    var _a = useQuery({
        queryKey: ['/api/stats'],
    }), threatStats = _a.data, isLoading = _a.isLoading;
    // Add grid background animation effect
    useEffect(function () {
        var addGridBackground = function () {
            var gridBg = document.createElement('div');
            gridBg.className = 'fixed inset-0 -z-10 grid-background';
            gridBg.style.backgroundSize = '50px 50px';
            gridBg.style.backgroundImage = "\n        linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px),\n        linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)\n      ";
            document.body.appendChild(gridBg);
            return function () {
                document.body.removeChild(gridBg);
            };
        };
        return addGridBackground();
    }, []);
    var statusCards = [
        {
            title: "Active Threats",
            value: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.activeThreats) || 0,
            changePercentage: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.weeklyChange.activeThreats) || 0,
            icon: <Shield className="text-destructive text-2xl"/>,
            progressPercentage: 65,
            progressColor: "destructive"
        },
        {
            title: "Data Leaks",
            value: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.dataLeaks) || 0,
            changePercentage: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.weeklyChange.dataLeaks) || 0,
            icon: <FileText className="text-yellow-500 text-2xl"/>,
            progressPercentage: 45,
            progressColor: "yellow-500"
        },
        {
            title: "Credentials Found",
            value: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.credentialsFound) || 0,
            changePercentage: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.weeklyChange.credentialsFound) || 0,
            icon: <Key className="text-primary text-2xl"/>,
            progressPercentage: 75,
            progressColor: "primary"
        },
        {
            title: "Monitored Keywords",
            value: (threatStats === null || threatStats === void 0 ? void 0 : threatStats.monitoredKeywords) || 0,
            changePercentage: 0,
            changeDescription: "across networks",
            icon: <Radar className="text-green-500 text-2xl"/>,
            progressPercentage: 90,
            progressColor: "green-500"
        }
    ];
    return (<>
      <Helmet>
        <title>Dashboard | DarkSentry - Dark Web Monitoring Platform</title>
        <meta name="description" content="Monitor dark web threats, data leaks, and credentials with real-time threat intelligence and visualization."/>
      </Helmet>
      
      <div className="p-6">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (Array.from({ length: 4 }).map(function (_, index) { return (<Skeleton key={index} className="h-32 w-full"/>); })) : (statusCards.map(function (card, index) { return (<StatusCard key={index} title={card.title} value={card.value} changePercentage={card.changePercentage} changeDescription={card.changeDescription} icon={card.icon} progressPercentage={card.progressPercentage} progressColor={card.progressColor}/>); }))}
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
        
        {/* New Dark Web Sources & Scraping Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Sources being monitored */}
          <SourcesDisplay />
          
          {/* Web Scraping Tools */}
          <WebScrapeTools />
        </div>
      </div>
    </>);
}
