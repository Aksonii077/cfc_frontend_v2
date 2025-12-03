import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { PortfolioStartup } from "./PortfolioManagement";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MessageCircle,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
  Eye,
} from "lucide-react";

interface PortfolioDashboardProps {
  startups: PortfolioStartup[];
  viewMode: "grid" | "list";
  onStartupSelect: (startupId: string) => void;
}

export function PortfolioDashboard({ startups, viewMode, onStartupSelect }: PortfolioDashboardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getHealthScoreColor = (score: string) => {
    switch (score) {
      case "green": return "text-green-600 bg-green-100 border-green-200";
      case "yellow": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "red": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getHealthScoreIcon = (score: string) => {
    switch (score) {
      case "green": return <CheckCircle className="w-4 h-4" />;
      case "yellow": return <Clock className="w-4 h-4" />;
      case "red": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (viewMode === "list") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Startups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {startups.map((startup) => (
              <div
                key={startup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onStartupSelect(startup.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {startup.companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{startup.companyName}</h3>
                      <Badge variant="outline" className={getHealthScoreColor(startup.healthScore)}>
                        {getHealthScoreIcon(startup.healthScore)}
                        <span className="ml-1 capitalize">{startup.healthScore}</span>
                      </Badge>
                      {startup.unreadMessages > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {startup.unreadMessages}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{startup.founderName} • {startup.industry}</span>
                      <span>{formatCurrency(startup.metrics.mrr)} MRR</span>
                      <span>{startup.metrics.cashRunway}mo runway</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {startup.metrics.userGrowth > 0 ? "+" : ""}{startup.metrics.userGrowth}% growth
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last updated</p>
                    <p className="text-sm font-medium">{formatDate(startup.lastUpdate)}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <Card key={startup.id} className="hover:shadow-lg transition-shadow cursor-pointer border-[#C8D6FF]" onClick={() => onStartupSelect(startup.id)}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                  <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                    {startup.companyName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-gray-900">{startup.companyName}</h3>
                  <p className="text-sm text-gray-600">{startup.founderName}</p>
                </div>
              </div>
              <Badge variant="outline" className={getHealthScoreColor(startup.healthScore)}>
                {getHealthScoreIcon(startup.healthScore)}
                <span className="ml-1 capitalize">{startup.healthScore}</span>
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="text-xs border-[#C8D6FF] bg-[#EDF2FF] text-[#114DFF]">
                {startup.industry}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#C8D6FF] bg-[#F7F9FF] text-[#114DFF]">
                {startup.stage}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#C8D6FF] bg-[#F5F5F5] text-gray-700">
                {startup.agreementType}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-[#06CB1D]" />
                  <span className="text-xs text-gray-700">MRR</span>
                </div>
                <p className="text-[#06CB1D]">{formatCurrency(startup.metrics.mrr)}</p>
              </div>

              <div className="text-center p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-[#114DFF]" />
                  <span className="text-xs text-gray-700">Runway</span>
                </div>
                <p className="text-[#114DFF]">{startup.metrics.cashRunway}mo</p>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">User Growth</span>
                <div className="flex items-center gap-1">
                  {startup.metrics.userGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-[#06CB1D]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[#FF220E]" />
                  )}
                  <span className={startup.metrics.userGrowth >= 0 ? "text-[#06CB1D]" : "text-[#FF220E]"}>
                    {startup.metrics.userGrowth > 0 ? "+" : ""}{startup.metrics.userGrowth}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Customer Churn</span>
                <span className="text-gray-900">{startup.metrics.customerChurn}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">CAC</span>
                <span className="text-gray-900">{formatCurrency(startup.metrics.cac)}</span>
              </div>
            </div>

            {/* Communication Status */}
            <div className="flex items-center justify-between pt-2 border-t border-[#C8D6FF]">
              <div className="flex items-center gap-2">
                {startup.unreadMessages > 0 ? (
                  <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {startup.unreadMessages} new
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-500">No new messages</span>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                <Eye className="w-3 h-3" />
                View Details
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>

            {/* Last Update */}
            <div className="text-xs text-gray-500 text-center">
              Last updated {formatDate(startup.lastUpdate)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}