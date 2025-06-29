"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
  };
}

interface Form {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  fields: FormField[];
}

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchForm = useCallback(async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const formData = await response.json();
        setForm(formData);

        // Initialize form data
        const initialData: Record<string, any> = {};
        formData.fields.forEach((field: FormField) => {
          if (field.type === "checkbox") {
            initialData[field.id] = [];
          } else {
            initialData[field.id] = "";
          }
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const validateField = useCallback((field: FormField, value: any): string => {
    if (field.required) {
      if (field.type === "checkbox") {
        if (!Array.isArray(value) || value.length === 0) {
          return "This field is required";
        }
      } else if (!value || value.toString().trim() === "") {
        return "This field is required";
      }
    }

    if (value && field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (value && field.type === "number") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return "Please enter a valid number";
      }
      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Minimum value is ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Maximum value is ${field.validation.max}`;
      }
    }

    return "";
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [form, formData, validateField]);

  const handleInputChange = useCallback(
    (fieldId: string, value: any) => {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));

      // Clear error when user starts typing
      if (errors[fieldId]) {
        setErrors((prev) => ({ ...prev, [fieldId]: "" }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId,
            data: formData,
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          console.error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formId, formData, validateForm]
  );

  const renderField = useCallback(
    (field: FormField) => {
      const value = formData[field.id];
      const error = errors[field.id];

      switch (field.type) {
        case "text":
        case "email":
        case "number":
        case "date":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );

        case "textarea":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea
                id={field.id}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );

        case "select":
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select
                value={value}
                onValueChange={(val: string) =>
                  handleInputChange(field.id, val)
                }
              >
                <SelectTrigger className={error ? "border-red-500" : ""}>
                  <SelectValue
                    placeholder={field.placeholder || "Select an option"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );

        case "checkbox":
          return (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${field.id}-${option}`}
                      checked={Array.isArray(value) && value.includes(option)}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v) => v !== option);
                        handleInputChange(field.id, newValues);
                      }}
                    />
                    <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );

        case "radio":
          return (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${field.id}-${option}`}
                      name={field.id}
                      value={option}
                      checked={value === option}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                    />
                    <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );

        default:
          return null;
      }
    },
    [formData, errors, handleInputChange]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading form...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Form not found</div>
        </div>
      </div>
    );
  }

  if (!form.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                Form Unavailable
              </h1>
              <p className="text-gray-500">
                This form is currently inactive and not accepting responses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                Thank you!
              </h1>
              <p className="text-gray-600">
                Your response has been submitted successfully.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            <p className="text-gray-600">{form.description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map(renderField)}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
