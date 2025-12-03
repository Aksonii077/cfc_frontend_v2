import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { PortfolioStartup } from "./PortfolioManagement";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Flame,
  Target,
  Calendar,
  Edit,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

interface KPIDashboardProps {
  startup: PortfolioStartup;
}

interface KPITrend {
  period: string;
  value: number;
  change: number;
}

export function KPIDashboard({ startup }: KPIDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [editMode, setEditMode] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState(startup.metrics);

  // Mock historical data - in real app, this would come from the database
  const kpiTrends: Record<string, KPITrend[]> = {
    mrr: [
      { period: "Dec 2023", value: 18000, change: 0 },
      { period: "Jan 2024", value: 22000, change: 22.2 },
      { period: "Current", value: startup.metrics.mrr, change: 13.6 },
    ],
    userGrowth: [
      { period: "Dec 2023", value: 15, change: 0 },
      { period: "Jan 2024", value: 28, change: 86.7 },
      { period: "Current", value: startup.metrics.userGrowth, change: -17.9 },
    ],
    customerChurn: [
      { period: "Dec 2023", value: 7.2, change: 0 },
      { period: "Jan 2024", value: 6.1, change: -15.3 },
      { period: "Current", value: startup.metrics.customerChurn, change: -14.8 },
    ],
    cac: [
      { period: "Dec 2023", value: 180, change: 0 },
      { period: "Jan 2024", value: 165, change: -8.3 },
      { period: "Current", value: startup.metrics.cac, change: -9.1 },
    ],
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getKPIStatus = (metric: string, value: number) => {
    switch (metric) {
      case "mrr":
        if (value >= 30000) return { status: "excellent", color: "text-[#06CB1D]", bg: "bg-[#06CB1D]/10" };
        if (value >= 20000) return { status: "good", color: "text-[#114DFF]", bg: "bg-[#114DFF]/10" };
        if (value >= 10000) return { status: "moderate", color: "text-gray-700", bg: "bg-gray-100" };
        return { status: "needs improvement", color: "text-[#FF220E]", bg: "bg-[#FF220E]/10" };
      
      case "userGrowth":
        if (value >= 20) return { status: "excellent", color: "text-[#06CB1D]", bg: "bg-[#06CB1D]/10" };
        if (value >= 10) return { status: "good", color: "text-[#114DFF]", bg: "bg-[#114DFF]/10" };
        if (value >= 0) return { status: "moderate", color: "text-gray-700", bg: "bg-gray-100" };
        return { status: "concerning", color: "text-[#FF220E]", bg: "bg-[#FF220E]/10" };
      
      case "customerChurn":
        if (value <= 3) return { status: "excellent", color: "text-[#06CB1D]", bg: "bg-[#06CB1D]/10" };
        if (value <= 7) return { status: "good", color: "text-[#114DFF]", bg: "bg-[#114DFF]/10" };
        if (value <= 12) return { status: "moderate", color: "text-gray-700", bg: "bg-gray-100" };
        return { status: "concerning", color: "text-[#FF220E]", bg: "bg-[#FF220E]/10" };
      
      case "cac":
        if (value <= 100) return { status: "excellent", color: "text-[#06CB1D]", bg: "bg-[#06CB1D]/10" };
        if (value <= 200) return { status: "good", color: "text-[#114DFF]", bg: "bg-[#114DFF]/10" };
        if (value <= 350) return { status: "moderate", color: "text-gray-700", bg: "bg-gray-100" };
        return { status: "concerning", color: "text-[#FF220E]", bg: "bg-[#FF220E]/10" };
      
      default:
        return { status: "unknown", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const handleSaveMetrics = () => {
    // In real app, this would save to database
    setEditMode(false);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-[#06CB1D]" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-[#FF220E]" />;
    return <div className="w-4 h-4" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-[#06CB1D]";
    if (change < 0) return "text-[#FF220E]";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">KPI Dashboard</h2>
          <p className="text-gray-600">Monitor key performance indicators and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 border-[#C8D6FF]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last3">Last 3 Months</SelectItem>
              <SelectItem value="last6">Last 6 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          
          {editMode ? (
            <div className="flex gap-2">
              <Button onClick={handleSaveMetrics} size="sm" className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditMode(false)} size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <Edit className="w-4 h-4" />
              Update KPIs
            </Button>
          )}
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Recurring Revenue */}
        <Card className="border-[#C8D6FF]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Monthly Recurring Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-[#3CE5A7]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editMode ? (
                <Input
                  type="number"
                  value={editedMetrics.mrr}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, mrr: Number(e.target.value) })}
                  className="border-[#C8D6FF]"
                />
              ) : (
                <div className="text-gray-900">{formatCurrency(startup.metrics.mrr)}</div>
              )}
              
              {kpiTrends.mrr[2].change !== 0 && (
                <div className="flex items-center gap-1">
                  {getChangeIcon(kpiTrends.mrr[2].change)}
                  <span className={`text-sm ${getChangeColor(kpiTrends.mrr[2].change)}`}>
                    {kpiTrends.mrr[2].change > 0 ? "+" : ""}{kpiTrends.mrr[2].change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              )}
              
              <Badge variant="outline" className={getKPIStatus("mrr", startup.metrics.mrr).bg + " " + getKPIStatus("mrr", startup.metrics.mrr).color}>
                {getKPIStatus("mrr", startup.metrics.mrr).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="border-[#C8D6FF]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">User Growth Rate</CardTitle>
              <Users className="w-4 h-4 text-[#114DFF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editMode ? (
                <Input
                  type="number"
                  value={editedMetrics.userGrowth}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, userGrowth: Number(e.target.value) })}
                  className="border-[#C8D6FF]"
                />
              ) : (
                <div className="text-gray-900">
                  {startup.metrics.userGrowth > 0 ? "+" : ""}{startup.metrics.userGrowth}%
                </div>
              )}
              
              {kpiTrends.userGrowth[2].change !== 0 && (
                <div className="flex items-center gap-1">
                  {getChangeIcon(kpiTrends.userGrowth[2].change)}
                  <span className={`text-sm ${getChangeColor(kpiTrends.userGrowth[2].change)}`}>
                    {kpiTrends.userGrowth[2].change > 0 ? "+" : ""}{kpiTrends.userGrowth[2].change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              )}
              
              <Badge variant="outline" className={getKPIStatus("userGrowth", startup.metrics.userGrowth).bg + " " + getKPIStatus("userGrowth", startup.metrics.userGrowth).color}>
                {getKPIStatus("userGrowth", startup.metrics.userGrowth).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Customer Churn */}
        <Card className="border-[#C8D6FF]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Customer Churn Rate</CardTitle>
              <Target className="w-4 h-4 text-[#114DFF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editMode ? (
                <Input
                  type="number"
                  step="0.1"
                  value={editedMetrics.customerChurn}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, customerChurn: Number(e.target.value) })}
                  className="border-[#C8D6FF]"
                />
              ) : (
                <div className="text-gray-900">{startup.metrics.customerChurn}%</div>
              )}
              
              {kpiTrends.customerChurn[2].change !== 0 && (
                <div className="flex items-center gap-1">
                  {getChangeIcon(-kpiTrends.customerChurn[2].change)} {/* Negative change is good for churn */}
                  <span className={`text-sm ${getChangeColor(-kpiTrends.customerChurn[2].change)}`}>
                    {kpiTrends.customerChurn[2].change > 0 ? "+" : ""}{kpiTrends.customerChurn[2].change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              )}
              
              <Badge variant="outline" className={getKPIStatus("customerChurn", startup.metrics.customerChurn).bg + " " + getKPIStatus("customerChurn", startup.metrics.customerChurn).color}>
                {getKPIStatus("customerChurn", startup.metrics.customerChurn).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition Cost */}
        <Card className="border-[#C8D6FF]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Customer Acquisition Cost</CardTitle>
              <Flame className="w-4 h-4 text-[#FF220E]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editMode ? (
                <Input
                  type="number"
                  value={editedMetrics.cac}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, cac: Number(e.target.value) })}
                  className="border-[#C8D6FF]"
                />
              ) : (
                <div className="text-gray-900">{formatCurrency(startup.metrics.cac)}</div>
              )}
              
              {kpiTrends.cac[2].change !== 0 && (
                <div className="flex items-center gap-1">
                  {getChangeIcon(-kpiTrends.cac[2].change)} {/* Negative change is good for CAC */}
                  <span className={`text-sm ${getChangeColor(-kpiTrends.cac[2].change)}`}>
                    {kpiTrends.cac[2].change > 0 ? "+" : ""}{kpiTrends.cac[2].change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              )}
              
              <Badge variant="outline" className={getKPIStatus("cac", startup.metrics.cac).bg + " " + getKPIStatus("cac", startup.metrics.cac).color}>
                {getKPIStatus("cac", startup.metrics.cac).status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health */}
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#114DFF]" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <span className="text-sm">Burn Rate</span>
              {editMode ? (
                <Input
                  type="number"
                  value={editedMetrics.burnRate}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, burnRate: Number(e.target.value) })}
                  className="w-32 border-[#C8D6FF]"
                />
              ) : (
                <span>{formatCurrency(startup.metrics.burnRate)}/mo</span>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <span className="text-sm">Cash Runway</span>
              {editMode ? (
                <Input
                  type="number"
                  value={editedMetrics.cashRunway}
                  onChange={(e) => setEditedMetrics({ ...editedMetrics, cashRunway: Number(e.target.value) })}
                  className="w-32 border-[#C8D6FF]"
                />
              ) : (
                <span className={startup.metrics.cashRunway <= 6 ? 'text-[#FF220E]' : startup.metrics.cashRunway <= 12 ? 'text-gray-700' : 'text-[#06CB1D]'}>
                  {startup.metrics.cashRunway} months
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <span className="text-sm">Revenue Multiple</span>
              <span>{(startup.metrics.mrr / (startup.metrics.burnRate || 1)).toFixed(1)}x</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Trends */}
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#114DFF]" />
              KPI Trends (3 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(kpiTrends).map(([key, trends]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key === "mrr" ? "MRR" : key === "cac" ? "CAC" : key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(trends[2].change)}
                      <span className={`text-sm ${getChangeColor(trends[2].change)}`}>
                        {trends[2].change > 0 ? "+" : ""}{trends[2].change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {trends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] rounded-full"></div>
                        <span>{trend.period}: {key === "mrr" || key === "cac" ? formatCurrency(trend.value) : trend.value}{key === "userGrowth" || key === "customerChurn" ? "%" : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Alerts */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#114DFF]" />
            KPI Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {startup.metrics.cashRunway <= 12 && (
              <div className="flex items-start gap-3 p-3 bg-[#FF220E]/5 border border-[#FF220E]/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#FF220E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#FF220E]">Low Cash Runway Alert</p>
                  <p className="text-sm text-gray-700">
                    Current runway of {startup.metrics.cashRunway} months is below recommended 18+ months. 
                    Consider fundraising or reducing burn rate.
                  </p>
                </div>
              </div>
            )}

            {startup.metrics.customerChurn > 10 && (
              <div className="flex items-start gap-3 p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#114DFF]">High Churn Rate</p>
                  <p className="text-sm text-gray-700">
                    Customer churn of {startup.metrics.customerChurn}% is above healthy threshold. 
                    Focus on customer retention strategies.
                  </p>
                </div>
              </div>
            )}

            {startup.metrics.userGrowth < 0 && (
              <div className="flex items-start gap-3 p-3 bg-[#FF220E]/5 border border-[#FF220E]/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-[#FF220E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#FF220E]">Negative User Growth</p>
                  <p className="text-sm text-gray-700">
                    User growth of {startup.metrics.userGrowth}% indicates declining user base. 
                    Immediate action required on user acquisition and retention.
                  </p>
                </div>
              </div>
            )}

            {startup.metrics.cashRunway > 18 && startup.metrics.customerChurn <= 7 && startup.metrics.userGrowth > 15 && (
              <div className="flex items-start gap-3 p-3 bg-[#06CB1D]/5 border border-[#06CB1D]/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#06CB1D] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#06CB1D]">Strong Performance</p>
                  <p className="text-sm text-gray-700">
                    All key metrics are performing well. Consider scaling growth initiatives or exploring new markets.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}