"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

// Types
interface TeamMetrics {
  totalResponses: number;
  responseRate: number;
  avgMood: number;
  avgEnergy: number;
  avgWorkload: number;
  burnoutRisk: number;
}

interface TrendData {
  date: string;
  mood: number;
  energy: number;
  workload: number;
  responses: number;
}

interface WorkloadDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

interface Alert {
  id: string;
  type: "warning" | "danger";
  message: string;
  timestamp: string;
}

const PulsecheckDashboard = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyLogin = async () => {
    const response = await fetch("/api/auth/verify-organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("organization_token"),
      }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("organization", JSON.stringify(data.organization));
      setIsAuthenticated(true);
    } else {
      toast.error(data.error);
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    verifyLogin();
  });
  // Mock data - replace with actual API calls
  const [teamMetrics] = useState<TeamMetrics>({
    totalResponses: 847,
    responseRate: 78,
    avgMood: 3.2,
    avgEnergy: 6.4,
    avgWorkload: 2.8,
    burnoutRisk: 15,
  });

  const [trendData] = useState<TrendData[]>([
    {
      date: "2024-01-01",
      mood: 3.5,
      energy: 7.2,
      workload: 2.1,
      responses: 42,
    },
    {
      date: "2024-01-02",
      mood: 3.3,
      energy: 6.8,
      workload: 2.4,
      responses: 38,
    },
    {
      date: "2024-01-03",
      mood: 3.1,
      energy: 6.5,
      workload: 2.7,
      responses: 41,
    },
    {
      date: "2024-01-04",
      mood: 2.9,
      energy: 6.1,
      workload: 3.1,
      responses: 35,
    },
    {
      date: "2024-01-05",
      mood: 2.8,
      energy: 5.9,
      workload: 3.3,
      responses: 39,
    },
    {
      date: "2024-01-06",
      mood: 3.0,
      energy: 6.2,
      workload: 3.0,
      responses: 43,
    },
    {
      date: "2024-01-07",
      mood: 3.2,
      energy: 6.4,
      workload: 2.8,
      responses: 45,
    },
  ]);

  const [workloadDistribution] = useState<WorkloadDistribution[]>([
    { level: "Light", count: 12, percentage: 28, color: "#10B981" },
    { level: "Moderate", count: 18, percentage: 42, color: "#F59E0B" },
    { level: "Heavy", count: 10, percentage: 23, color: "#F97316" },
    { level: "Overwhelming", count: 3, percentage: 7, color: "#EF4444" },
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      message: "Energy levels have decreased by 15% over the past week",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "danger",
      message:
        "3 team members reporting overwhelming workload for 3+ consecutive days",
      timestamp: "5 hours ago",
    },
  ]);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getMoodLabel = (mood: number): string => {
    if (mood >= 4) return "Great";
    if (mood >= 3) return "Good";
    if (mood >= 2) return "Okay";
    return "Poor";
  };

  const getMoodColor = (mood: number): string => {
    if (mood >= 4) return "text-green-600";
    if (mood >= 3) return "text-yellow-600";
    if (mood >= 2) return "text-orange-600";
    return "text-red-600";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1>You must be logged in to view this page.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Team Pulse Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as "7d" | "30d" | "90d")
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2 mb-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center p-4 rounded-lg ${
                    alert.type === "danger"
                      ? "bg-red-50 border border-red-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 mr-3 ${
                      alert.type === "danger"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMetrics.responseRate}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {teamMetrics.totalResponses} total responses
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Mood
                </p>
                <p
                  className={`text-2xl font-bold ${getMoodColor(
                    teamMetrics.avgMood
                  )}`}
                >
                  {getMoodLabel(teamMetrics.avgMood)}
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(teamMetrics.avgMood, 3.4)}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {teamMetrics.avgMood.toFixed(1)}/5.0 average score
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Energy Level
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMetrics.avgEnergy}/10
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(teamMetrics.avgEnergy, 6.8)}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Team average energy</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Burnout Risk
                </p>
                <p
                  className={`text-2xl font-bold ${
                    teamMetrics.burnoutRisk > 20
                      ? "text-red-600"
                      : teamMetrics.burnoutRisk > 10
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {teamMetrics.burnoutRisk}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Team members at risk</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pulse Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value: number) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value: number, name: string) => [
                    name === "mood"
                      ? `${value.toFixed(1)}/5`
                      : name === "energy"
                      ? `${value.toFixed(1)}/10`
                      : name === "workload"
                      ? `${value.toFixed(1)}/4`
                      : value,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="mood"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="energy"
                />
                <Line
                  type="monotone"
                  dataKey="workload"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="workload"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Workload Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Workload Distribution
            </h3>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={workloadDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="count"
                  >
                    {workloadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} team members (${props.payload.percentage}%)`,
                      props.payload.level,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {workloadDistribution.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.level}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Rate Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Response Rate
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value: number) =>
                  new Date(value).toLocaleDateString()
                }
                formatter={(value: number) => [
                  `${value} responses`,
                  "Responses",
                ]}
              />
              <Bar dataKey="responses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Consider workload redistribution
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  7% of team members report overwhelming workload. Consider
                  redistributing tasks or additional resources.
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingDown className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Schedule team check-in
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Energy levels trending downward. Consider scheduling a team
                  meeting to address concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsecheckDashboard;
