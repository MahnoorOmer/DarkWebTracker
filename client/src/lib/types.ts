export interface StatusCardProps {
  title: string;
  value: number;
  changePercentage?: number;
  changeDescription?: string;
  icon: React.ReactNode;
  progressPercentage: number;
  progressColor: string;
}

export interface AlertItem {
  id: number;
  title: string;
  description: string;
  type: string;
  riskLevel: string;
  createdAt: Date | string;
  isRead: boolean;
  timeAgo?: string;
}

export interface ThreatCategoryItem {
  id: number;
  category: string;
  percentage: number;
  growth: number;
  color: string;
}

export interface ThreatStatsData {
  id: number;
  activeThreats: number;
  dataLeaks: number;
  credentialsFound: number;
  monitoredKeywords: number;
  weeklyChange: {
    activeThreats: number;
    dataLeaks: number;
    credentialsFound: number;
    monitoredKeywords: number;
  };
  lastUpdated: Date | string;
}

export interface MonitoredKeyword {
  id: number;
  keyword: string;
  userId: number;
  status: string;
  frequency: string;
  createdAt: Date | string;
}

export interface SearchOptions {
  networks: string;
  contentType: string;
  timeRange: string;
  riskLevel: string;
}
