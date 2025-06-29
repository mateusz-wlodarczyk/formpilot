"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldEditor, FormField, FieldType } from "./FieldEditor";
import { Plus, Save, Eye } from "lucide-react";

interface FormBuilderProps {
  initialData?: {
    title: string;
    description: string;
    fields: FormField[];
  };
  onSave: (data: {
    title: string;
    description: string;
    fields: FormField[];
  }) => void;
  onPreview?: () => void;
  isSaving?: boolean;
}

export function FormBuilder({
  initialData,
  onSave,
  onPreview,
  isSaving = false,
}: FormBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);

  const handleAddField = useCallback((type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type}`,
      required: false,
    };

    if (type === "select" || type === "radio") {
      newField.options = ["Option 1", "Option 2"];
    }

    setFields((prev) => [...prev, newField]);
  }, []);

  const handleFieldChange = useCallback(
    (index: number, updatedField: FormField) => {
      setFields((prev) =>
        prev.map((field, i) => (i === index ? updatedField : field))
      );
    },
    []
  );

  const handleFieldRemove = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    onSave({
      title,
      description,
      fields,
    });
  }, [title, description, fields, onSave]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview();
    }
  }, [onPreview]);

  // Memoize field statistics
  const fieldStats = useMemo(
    () => ({
      total: fields.length,
      required: fields.filter((f) => f.required).length,
    }),
    [fields]
  );

  return (
    <div className="space-y-6">
      {/* Form Details */}
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              placeholder="Enter form title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter form description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Field Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add Field Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("text")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Text Input
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("textarea")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Text Area
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("email")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("number")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Number
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("select")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Select
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("radio")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Radio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("checkbox")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Checkbox
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddField("date")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Date
              </Button>
            </div>

            {/* Fields List */}
            {fields.length > 0 && (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FieldEditor
                    key={field.id}
                    field={field}
                    onUpdate={(updatedField) =>
                      handleFieldChange(index, updatedField)
                    }
                    onDelete={() => handleFieldRemove(index)}
                  />
                ))}
              </div>
            )}

            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>
                  No fields added yet. Click the buttons above to add fields.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {fields.length > 0 && (
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Summary</p>
                <p className="text-sm text-gray-600">
                  {fieldStats.total} fields • {fieldStats.required} required
                </p>
              </div>
              <div className="flex gap-2">
                {onPreview && (
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Form"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
