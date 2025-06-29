"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTestSession } from "@/components/TestSessionProvider";
import { FormBuilder } from "@/components/FormBuilder";
import { FormField } from "@/components/FieldEditor";
import { EmbedCode } from "@/components/EmbedCode";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Eye, Share, BarChart3 } from "lucide-react";

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  submissions: any[];
}

const FormAnalytics = dynamic(
  () =>
    import("@/components/analytics/FormAnalytics").then(
      (mod) => mod.FormAnalytics
    ),
  { ssr: false }
);

export default function FormEditPage() {
  const params = useParams();
  const router = useRouter();
  const { isTestMode } = useTestSession();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"edit" | "preview" | "share">("edit");

  const formId = params.formId as string;

  useEffect(() => {
    loadForm();
  }, [formId, isTestMode]);

  const loadForm = async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isTestMode) {
        headers["x-test-user"] = "true";
      }

      const response = await fetch(`/api/forms/${formId}`, { headers });
      if (response.ok) {
        const formData = await response.json();
        setForm(formData);
      } else {
        alert("Failed to load form");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error loading form:", error);
      alert("An error occurred while loading the form");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: {
    title: string;
    description: string;
    fields: FormField[];
  }) => {
    setSaving(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isTestMode) {
        headers["x-test-user"] = "true";
      }

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedForm = await response.json();
        setForm(updatedForm);
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(`Error saving form: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating form:", error);
      alert("An error occurred while saving the form");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setView("preview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
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

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-gray-600 mt-2">{form.description}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={view === "edit" ? "default" : "outline"}
                onClick={() => setView("edit")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={view === "preview" ? "default" : "outline"}
                onClick={() => setView("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={view === "share" ? "default" : "outline"}
                onClick={() => setView("share")}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/${formId}/responses`)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Responses
              </Button>
            </div>
          </div>
        </div>

        {view === "edit" && (
          <FormBuilder
            initialData={{
              title: form.title,
              description: form.description,
              fields: form.fields,
            }}
            onSave={handleSave}
            onPreview={handlePreview}
            isSaving={saving}
          />
        )}

        {view === "preview" && (
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{form.title}</h2>
                {form.description && (
                  <p className="text-gray-600">{form.description}</p>
                )}

                <div className="space-y-4 mt-6">
                  {form.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "text" && (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      )}

                      {field.type === "email" && (
                        <input
                          type="email"
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled
                        >
                          <option value="">
                            {field.placeholder || "Select an option"}
                          </option>
                          {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "checkbox" && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            disabled
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Sample option
                          </span>
                        </div>
                      )}

                      {field.type === "radio" && (
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                name={`field-${field.id}`}
                                className="border-gray-300"
                                disabled
                              />
                              <span className="ml-2 text-sm">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {field.type === "number" && (
                        <input
                          type="number"
                          placeholder={field.placeholder}
                          min={field.validation?.min}
                          max={field.validation?.max}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button disabled className="w-full">
                    Submit (Preview)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {view === "share" && (
          <EmbedCode formId={form.id} formTitle={form.title} />
        )}
      </div>
    </div>
  );
}
