"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTestSession } from "@/components/TestSessionProvider";
import { FormBuilder } from "./FormBuilder";
import { FormField } from "./FieldEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function FormCreator() {
  const router = useRouter();
  const { isTestMode } = useTestSession();
  const [saving, setSaving] = useState(false);

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

      const response = await fetch("/api/forms", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const form = await response.json();
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(`Failed to save form: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("An error occurred while saving the form");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    alert("Preview functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">New Form</h1>
          <p className="text-gray-600 mt-2">
            Create a new form using our intuitive builder
          </p>
        </div>

        <FormBuilder
          onSave={handleSave}
          onPreview={handlePreview}
          isSaving={saving}
        />
      </div>
    </div>
  );
}
