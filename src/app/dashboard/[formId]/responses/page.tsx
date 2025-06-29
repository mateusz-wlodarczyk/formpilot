"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  User,
  MessageSquare,
  BarChart3,
  Share,
  Copy,
  Check,
} from "lucide-react";
import { useTestSession } from "@/components/TestSessionProvider";
import { TEST_USER_ID } from "@/lib/test-data";
import { FormCharts } from "@/components/analytics/FormCharts";

interface Submission {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [copied, setCopied] = useState(false);
  const { isTestMode } = useTestSession();

  const fetchFormAndSubmissions = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (isTestMode) {
        headers["x-test-user"] = "true";
      }

      // Fetch form details
      const formResponse = await fetch(`/api/forms/${formId}`, { headers });
      if (formResponse.ok) {
        const formData = await formResponse.json();
        setForm(formData);
        setSubmissions(formData.submissions || []);
      }
    } catch (error) {
      console.error("Error fetching form and submissions:", error);
    } finally {
      setLoading(false);
    }
  }, [formId, isTestMode]);

  useEffect(() => {
    fetchFormAndSubmissions();
  }, [fetchFormAndSubmissions]);

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  const handleExportCSV = () => {
    if (!form || submissions.length === 0) return;

    // Create CSV header
    const headers = form.fields.map((field) => field.label).join(",");
    const csvRows = [headers];

    // Add data rows
    submissions.forEach((submission) => {
      const row = form.fields.map((field) => {
        const value = submission.data[field.id];
        if (Array.isArray(value)) {
          return `"${value.join(", ")}"`;
        }
        return `"${value || ""}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    const baseUrl = window.location.origin;
    const formUrl = `${baseUrl}/form/${formId}`;

    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const handleOpenForm = () => {
    const baseUrl = window.location.origin;
    const formUrl = `${baseUrl}/form/${formId}`;
    window.open(formUrl, "_blank");
  };

  const formatFieldValue = (field: FormField, value: any): string => {
    if (!value) return "-";

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (field.type === "date") {
      return new Date(value).toLocaleDateString();
    }

    return String(value);
  };

  const getFieldPreview = (field: FormField, value: any): string => {
    const formatted = formatFieldValue(field, value);
    return formatted.length > 50
      ? formatted.substring(0, 50) + "..."
      : formatted;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Form not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form.title}</h1>
            <p className="text-gray-600">Responses</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary">{submissions.length} responses</Badge>
          <Button
            variant="default"
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleOpenForm}>
            <Eye className="h-4 w-4 mr-2" />
            Open Form
          </Button>
          {submissions.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowCharts(!showCharts)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showCharts ? "Hide Charts" : "Show Charts"}
              </Button>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Copy notification */}
      {copied && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2 text-green-800">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">
              Form link copied to clipboard!
            </span>
          </div>
        </div>
      )}

      {/* Analytics and Charts */}
      {showCharts && submissions.length > 0 && (
        <FormCharts submissions={submissions} fields={form.fields} />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Responses</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4 mr-1" />
                    Share Form
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenForm}>
                <Eye className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>
          </div>
          {submissions.length > 0 && (
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Latest:{" "}
                {new Date(submissions[0].createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                First:{" "}
                {new Date(
                  submissions[submissions.length - 1].createdAt
                ).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Avg/day:{" "}
                {Math.round(
                  (submissions.length /
                    Math.max(
                      1,
                      Math.ceil(
                        (new Date(submissions[0].createdAt).getTime() -
                          new Date(
                            submissions[submissions.length - 1].createdAt
                          ).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )) *
                    10
                ) / 10}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No responses yet
              </h3>
              <p className="text-gray-500 mb-6">
                Share your form to start collecting responses
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="default"
                  onClick={handleCopyLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleOpenForm}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open Form
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {form.fields.slice(0, 3).map((field) => (
                      <TableHead key={field.id}>{field.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      {form.fields.slice(0, 3).map((field) => (
                        <TableCell key={field.id}>
                          {getFieldPreview(field, submission.data[field.id])}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && form && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(selectedSubmission.createdAt).toLocaleString()}
              </div>
              <div className="space-y-4">
                {form.fields.map((field) => (
                  <div key={field.id} className="border-b pb-3">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                    <p className="text-gray-700">
                      {formatFieldValue(
                        field,
                        selectedSubmission.data[field.id]
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
