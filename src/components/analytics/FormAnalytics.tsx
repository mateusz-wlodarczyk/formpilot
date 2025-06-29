"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Table,
  TrendingUp,
  Users,
  Calendar,
  Download,
} from "lucide-react";

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

interface FormAnalyticsProps {
  submissions?: Submission[];
  fields?: FormField[];
  formTitle?: string;
}

// Dynamic imports for heavy components
const SubmissionsTable = dynamic(
  () => import("./SubmissionsTable").then((mod) => mod.SubmissionsTable),
  { ssr: false }
);
const FormCharts = dynamic(
  () => import("./FormCharts").then((mod) => mod.FormCharts),
  { ssr: false }
);

export function FormAnalytics({
  submissions = [],
  fields = [],
  formTitle = "Form",
}: FormAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Memoize expensive calculations
  const stats = useMemo(() => {
    const totalResponses = submissions?.length || 0;
    const todayResponses =
      submissions?.filter(
        (s) =>
          new Date(s.createdAt).toDateString() === new Date().toDateString()
      ).length || 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekResponses =
      submissions?.filter((s) => new Date(s.createdAt) >= weekAgo).length || 0;

    const uniqueDays = new Set(
      submissions?.map((s) => new Date(s.createdAt).toDateString()) || []
    ).size;
    const averagePerDay =
      totalResponses > 0
        ? Math.round((totalResponses / Math.max(1, uniqueDays)) * 10) / 10
        : 0;

    return {
      totalResponses,
      todayResponses,
      thisWeekResponses,
      averagePerDay,
    };
  }, [submissions]);

  // Memoize tab change handler
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Responses
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalResponses}
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
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.todayResponses}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.thisWeekResponses}
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
                  {stats.averagePerDay}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <FormCharts submissions={submissions || []} fields={fields || []} />
        </TabsContent>

        <TabsContent value="responses" className="mt-6">
          <SubmissionsTable
            submissions={submissions || []}
            fields={fields || []}
            formTitle={formTitle || "Form"}
          />
        </TabsContent>
      </Tabs>

      {/* Additional information */}
      {(!submissions || submissions.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              No Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">
                This form hasn't received any responses yet.
              </p>
              <p className="text-sm">
                Share the form to start collecting data and analyzing responses.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
