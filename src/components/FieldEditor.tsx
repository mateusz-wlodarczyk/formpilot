"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Trash2, GripVertical, Settings } from "lucide-react";

export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "number"
  | "date";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function FieldEditor({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FieldEditorProps) {
  const [localField, setLocalField] = useState<FormField>(field);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleFieldChange = useCallback(
    (updates: Partial<FormField>) => {
      const updatedField = { ...localField, ...updates };
      setLocalField(updatedField);
      onUpdate(updatedField);
    },
    [localField, onUpdate]
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      const newOptions = [...(localField.options || [])];
      newOptions[index] = value;
      handleFieldChange({ options: newOptions });
    },
    [localField.options, handleFieldChange]
  );

  const handleAddOption = useCallback(() => {
    const newOptions = [
      ...(localField.options || []),
      `Option ${(localField.options?.length || 0) + 1}`,
    ];
    handleFieldChange({ options: newOptions });
  }, [localField.options, handleFieldChange]);

  const handleRemoveOption = useCallback(
    (index: number) => {
      const newOptions = (localField.options || []).filter(
        (_, i) => i !== index
      );
      handleFieldChange({ options: newOptions });
    },
    [localField.options, handleFieldChange]
  );

  const handleDelete = useCallback(() => {
    onDelete(field.id);
  }, [field.id, onDelete]);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <CardTitle className="text-lg">
              {localField.label || "New Field"}
            </CardTitle>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {localField.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={localField.label}
              onChange={(e) => handleFieldChange({ label: e.target.value })}
              placeholder="Field name"
            />
          </div>
          <div>
            <Label htmlFor="type">Field Type</Label>
            <Select
              value={localField.type}
              onValueChange={(value: FieldType) =>
                handleFieldChange({ type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="textarea">Long Text</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={localField.placeholder || ""}
            onChange={(e) => handleFieldChange({ placeholder: e.target.value })}
            placeholder="Helper text"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            checked={localField.required}
            onChange={(e) => handleFieldChange({ required: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="required">Required field</Label>
        </div>

        {expanded && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">Advanced Settings</h4>

            {(localField.type === "select" || localField.type === "radio") && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {(localField.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddOption}>
                    + Add Option
                  </Button>
                </div>
              </div>
            )}

            {localField.type === "number" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Value</Label>
                  <Input
                    type="number"
                    value={localField.validation?.min || ""}
                    onChange={(e) =>
                      handleFieldChange({
                        validation: {
                          ...localField.validation,
                          min: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    placeholder="Min"
                  />
                </div>
                <div>
                  <Label>Maximum Value</Label>
                  <Input
                    type="number"
                    value={localField.validation?.max || ""}
                    onChange={(e) =>
                      handleFieldChange({
                        validation: {
                          ...localField.validation,
                          max: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
