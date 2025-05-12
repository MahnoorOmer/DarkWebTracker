import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FileText, Download, Calendar, Filter, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Helmet } from "react-helmet";

// Mock data for reports
const threatTrendData = [
  { month: 'Jan', threats: 12, leaks: 5, credentials: 28 },
  { month: 'Feb', threats: 19, leaks: 8, credentials: 42 },
  { month: 'Mar', threats: 15, leaks: 12, credentials: 35 },
  { month: 'Apr', threats: 27, leaks: 9, credentials: 64 },
  { month: 'May', threats: 32, leaks: 14, credentials: 89 },
  { month: 'Jun', threats: 24, leaks: 7, credentials: 73 },
];

const regionData = [
  { name: 'Eastern Europe', value: 32, color: '#FF5252' },
  { name: 'North America', value: 21, color: '#00E5FF' },
  { name: 'Asia Pacific', value: 18, color: '#00FF9D' },
  { name: 'Western Europe', value: 15, color: '#FFC107' },
  { name: 'Others', value: 14, color: '#7C4DFF' },
];

const attackTypeData = [
  { name: 'Data Breaches', value: 38, color: '#FF5252' },
  { name: 'Phishing', value: 26, color: '#FFC107' },
  { name: 'Malware', value: 18, color: '#00E5FF' },
  { name: 'Ransomware', value: 12, color: '#00FF9D' },
  { name: 'Other', value: 6, color: '#7C4DFF' },
];

const alertsOverTimeData = [
  { day: '1', alerts: 3 },
  { day: '2', alerts: 5 },
  { day: '3', alerts: 2 },
  { day: '4', alerts: 8 },
  { day: '5', alerts: 12 },
  { day: '6', alerts: 7 },
  { day: '7', alerts: 4 },
  { day: '8', alerts: 6 },
  { day: '9', alerts: 9 },
  { day: '10', alerts: 11 },
  { day: '11', alerts: 7 },
  { day: '12', alerts: 5 },
  { day: '13', alerts: 3 },
  { day: '14', alerts: 8 },
];

export default function Reports() {
  const [chartTimeRange, setChartTimeRange] = useState("30d");
  const [reportType, setReportType] = useState("threats");
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-neutral-dark rounded-md shadow-md">
          <p className="font-mono text-sm text-white">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const downloadReport = () => {
    // This would generate and download a report in a real application
  };

  return (
    <>
      <Helmet>
        <title>Reports | DarkSentry</title>
        <meta name="description" content="View and analyze dark web threat intelligence reports and visualizations." />
      </Helmet>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-mono text-white">Intelligence Reports</h1>
          <div className="flex items-center gap-3">
            <Select defaultValue={chartTimeRange} onValueChange={setChartTimeRange}>
              <SelectTrigger className="w-[180px] bg-secondary border-neutral-dark">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="bg-secondary border-neutral-dark">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            
            <Button onClick={downloadReport} className="bg-primary text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-neutral-dark bg-secondary">
            <CardHeader className="border-b border-neutral-dark">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Threat Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 h-80">
              <Tabs defaultValue="bar" className="mb-4">
                <TabsList className="bg-background border border-neutral-dark">
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                  <TabsTrigger value="line">Line</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" vertical={false} />
                  <XAxis dataKey="month" stroke="#adb5bd" />
                  <YAxis stroke="#adb5bd" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="threats" name="Active Threats" fill="#FF5252" />
                  <Bar dataKey="leaks" name="Data Leaks" fill="#FFC107" />
                  <Bar dataKey="credentials" name="Credentials" fill="#00E5FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-dark bg-secondary">
            <CardHeader className="border-b border-neutral-dark">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Alert Frequency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsOverTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" vertical={false} />
                  <XAxis dataKey="day" stroke="#adb5bd" />
                  <YAxis stroke="#adb5bd" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="alerts" name="Alerts" stroke="#00E5FF" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-neutral-dark bg-secondary">
            <CardHeader className="border-b border-neutral-dark">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Threats by Region
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-dark bg-secondary">
            <CardHeader className="border-b border-neutral-dark">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Attack Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {attackTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card className="border-neutral-dark bg-secondary">
            <CardHeader className="border-b border-neutral-dark">
              <CardTitle className="font-mono font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Recent Intelligence Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-dark">
                <div className="flex items-center p-4 hover:bg-background/20 transition-colors">
                  <div className="mr-4 h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Emerging Ransomware Groups Analysis</h3>
                    <p className="text-xs text-muted-foreground mt-1">Detailed analysis of new ransomware groups targeting the financial sector</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="text-xs font-medium text-yellow-500">High Priority</span>
                    <span className="text-xs text-muted-foreground">Published 2 days ago</span>
                  </div>
                </div>
                
                <div className="flex items-center p-4 hover:bg-background/20 transition-colors">
                  <div className="mr-4 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Quarterly Threat Landscape</h3>
                    <p className="text-xs text-muted-foreground mt-1">Overview of dark web trends and emerging threats for Q2 2023</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="text-xs font-medium text-primary">Medium Priority</span>
                    <span className="text-xs text-muted-foreground">Published 1 week ago</span>
                  </div>
                </div>
                
                <div className="flex items-center p-4 hover:bg-background/20 transition-colors">
                  <div className="mr-4 h-10 w-10 rounded-md bg-green-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Data Breach Tactics Analysis</h3>
                    <p className="text-xs text-muted-foreground mt-1">Technical analysis of recent data breach methodologies</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="text-xs font-medium text-green-500">Standard Priority</span>
                    <span className="text-xs text-muted-foreground">Published 2 weeks ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
