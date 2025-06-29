"use client";

import { useState, useEffect, useCallback } from "react";
import { useTestSession } from "@/components/TestSessionProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const FormCharts = dynamic(
  () =>
    import("@/components/analytics/FormCharts").then((mod) => mod.FormCharts),
  { ssr: false }
);

interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  _count: {
    submissions: number;
  };
}

interface Submission {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isTestMode } = useTestSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalyticsData = useCallback(async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (isTestMode) {
        headers["x-test-user"] = "true";
      }
      // Load all forms
      const formsResponse = await fetch("/api/forms", { headers });
      if (formsResponse.ok) {
        const formsData = await formsResponse.json();
        setForms(formsData);
        // Load submissions for each form
        const allSubmissions: Submission[] = [];
        for (const form of formsData) {
          const formResponse = await fetch(`/api/forms/${form.id}`, {
            headers,
          });
          if (formResponse.ok) {
            const formData = await formResponse.json();
            allSubmissions.push(...formData.submissions);
          }
        }
        setAllSubmissions(allSubmissions);
      }
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, [isTestMode]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const totalResponses = allSubmissions.length;
  const totalForms = forms.length;

  const todayResponses = allSubmissions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekResponses = allSubmissions.filter(
    (s) => new Date(s.createdAt) >= weekAgo
  ).length;

  const uniqueDays = new Set(
    allSubmissions.map((s) => new Date(s.createdAt).toDateString())
  ).size;
  const averagePerDay =
    totalResponses > 0
      ? Math.round((totalResponses / Math.max(1, uniqueDays)) * 10) / 10
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Overview
          </h1>
          <p className="text-gray-600 mt-2">
            View insights and trends across all your forms
          </p>
        </div>

        {/* Quick statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Responses
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalResponses}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Forms
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalForms}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {thisWeekResponses}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg/Day</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {averagePerDay}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Response Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {allSubmissions.length > 0 ? (
              <FormCharts submissions={allSubmissions} fields={[]} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No data available for charts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Forms */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Performing Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length > 0 ? (
              <div className="space-y-4">
                {forms
                  .sort((a, b) => b._count.submissions - a._count.submissions)
                  .slice(0, 10)
                  .map((form) => (
                    <div
                      key={form.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold">{form.title}</h3>
                        <p className="text-sm text-gray-500">
                          {form.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {form._count.submissions}
                        </p>
                        <p className="text-xs text-gray-500">responses</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No forms available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
