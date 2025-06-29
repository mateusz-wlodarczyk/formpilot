"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTestSession } from "@/components/TestSessionProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface Form {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    submissions: number;
  };
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isTestMode } = useTestSession();

  const fetchForms = useCallback(async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isTestMode) {
        headers["x-test-user"] = "true";
      }

      const response = await fetch("/api/forms?pageSize=100", { headers });
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  }, [isTestMode]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreateForm = useCallback(() => {
    router.push("/dashboard/new");
  }, [router]);

  const handleEditForm = useCallback(
    (formId: string) => {
      router.push(`/dashboard/${formId}`);
    },
    [router]
  );

  const handleViewForm = useCallback(
    (formId: string) => {
      router.push(`/form/${formId}`);
    },
    [router]
  );

  const handleViewAnalytics = useCallback(
    (formId: string) => {
      router.push(`/dashboard/${formId}`);
    },
    [router]
  );

  const handleToggleActive = useCallback(
    async (formId: string, currentStatus: boolean) => {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (isTestMode) {
          headers["x-test-user"] = "true";
        }

        const response = await fetch(`/api/forms/${formId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ isActive: !currentStatus }),
        });

        if (response.ok) {
          // Refresh forms after toggle
          fetchForms();
        } else {
          console.error("Failed to toggle form status");
        }
      } catch (error) {
        console.error("Error toggling form status:", error);
      }
    },
    [isTestMode, fetchForms]
  );

  // Memoize form statistics
  const formStats = useMemo(() => {
    const totalForms = forms.length;
    const totalSubmissions = forms.reduce(
      (sum, form) => sum + form._count.submissions,
      0
    );
    const activeForms = forms.filter((form) => form.isActive).length;
    const recentForms = forms.filter((form) => {
      const formDate = new Date(form.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return formDate >= weekAgo;
    }).length;

    return {
      totalForms,
      totalSubmissions,
      activeForms,
      recentForms,
    };
  }, [forms]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Forms</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formStats.totalForms}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Responses
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {formStats.totalSubmissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Active</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {formStats.activeForms}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No forms yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first form to start collecting responses
              </p>
              <Button onClick={handleCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Form
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{form.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          form.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {form.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {form.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {form._count.submissions} responses
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(form.id, form.isActive)}
                      className={
                        form.isActive ? "text-green-600" : "text-gray-600"
                      }
                    >
                      {form.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditForm(form.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/form/${form.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {form._count.submissions > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/${form.id}/responses`)
                        }
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Responses
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
