"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TrendingUp, BarChart3, Calendar, Users } from "lucide-react";

interface Submission {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

interface FormChartsProps {
  submissions: Submission[];
  fields?: FormField[];
}

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

export function FormCharts({ submissions, fields }: FormChartsProps) {
  const timeSeriesData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    submissions.forEach((submission) => {
      const date = new Date(submission.createdAt).toLocaleDateString("en-US");
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [submissions]);

  const fieldCharts = useMemo(() => {
    if (!fields || !Array.isArray(fields)) {
      return [];
    }

    return fields
      .filter(
        (field) =>
          ["select", "radio", "checkbox"].includes(field.type) &&
          field.options?.length
      )
      .map((field) => {
        const optionCounts: Record<string, number> = {};
        field.options!.forEach((option) => (optionCounts[option] = 0));

        submissions.forEach((submission) => {
          if (submission.data && submission.data[field.id]) {
            const value = submission.data[field.id];
            if (value) {
              if (Array.isArray(value)) {
                value.forEach((option) => optionCounts[option]++);
              } else {
                optionCounts[value]++;
              }
            }
          }
        });

        return {
          field,
          data: Object.entries(optionCounts).map(([option, count]) => ({
            option,
            count,
            percentage: Math.round((count / submissions.length) * 100) || 0,
          })),
          totalResponses: submissions.length,
        };
      });
  }, [fields, submissions]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const today = new Date().toDateString();
    const todayCount = submissions.filter(
      (s) => new Date(s.createdAt).toDateString() === today
    ).length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = submissions.filter(
      (s) => new Date(s.createdAt) >= weekAgo
    ).length;

    return {
      total,
      today: todayCount,
      thisWeek: weekCount,
      averagePerDay:
        total > 0
          ? Math.round((total / Math.max(1, timeSeriesData.length)) * 10) / 10
          : 0,
    };
  }, [submissions, timeSeriesData]);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No data available to display charts</p>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Responses"
          value={stats.total}
          icon={Users}
          color="text-blue-500"
        />
        <StatCard
          title="Today"
          value={stats.today}
          icon={Calendar}
          color="text-green-500"
        />
        <StatCard
          title="This Week"
          value={stats.thisWeek}
          icon={TrendingUp}
          color="text-purple-500"
        />
        <StatCard
          title="Avg/Day"
          value={stats.averagePerDay}
          icon={BarChart3}
          color="text-orange-500"
        />
      </div>

      {timeSeriesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Responses Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any) => [
                    `${value} responses`,
                    "Number of responses",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {fieldCharts.map(({ field, data, totalResponses }) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {field.label}
              <span className="text-sm font-normal text-gray-500">
                ({totalResponses} responses)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Response Distribution
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="option"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: any) => [
                        `${value} responses`,
                        "Count",
                      ]}
                      labelFormatter={(label) => `Option: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Percentage Share
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ option, percentage }) =>
                        `${option}: ${percentage}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${value} responses (${Math.round((value / totalResponses) * 100)}%)`,
                        "Count",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
