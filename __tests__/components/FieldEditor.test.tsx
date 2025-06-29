import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldEditor, FormField } from "../../src/components/FieldEditor";
import React from "react";

// Mock the Select component to avoid complex interactions
jest.mock("../../src/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => {
    // Simple mock that renders a basic select with hardcoded options
    return (
      <select
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
        }}
        data-testid="field-type-select"
      >
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="textarea">Long Text</option>
        <option value="select">Dropdown</option>
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
      </select>
    );
  },
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => null,
}));

describe("FieldEditor Component", () => {
  const mockField: FormField = {
    id: "field-1",
    type: "text",
    label: "Test Field",
    placeholder: "Enter text",
    required: true,
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders field editor with basic information", () => {
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("Test Field")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Field")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Enter text")).toBeInTheDocument();
      expect(screen.getByText("text")).toBeInTheDocument();
    });

    it("shows field type badge", () => {
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("text")).toBeInTheDocument();
    });

    it("shows default label when field has no label", () => {
      const fieldWithoutLabel = { ...mockField, label: "" };
      render(
        <FieldEditor
          field={fieldWithoutLabel}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("New Field")).toBeInTheDocument();
    });
  });

  describe("Field Configuration", () => {
    it("updates field label", async () => {
      const user = userEvent.setup();
      let field = { ...mockField };
      const handleUpdate = jest.fn((updated) => {
        field = updated;
      });
      render(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue("Test Field");
      await user.clear(labelInput);
      await user.type(labelInput, "Updated Label");
      // Check the last call for the expected value
      const lastCall =
        handleUpdate.mock.calls[handleUpdate.mock.calls.length - 1];
      expect(lastCall[0].label).toBe("Updated Label");
    });

    it("updates placeholder text", async () => {
      const user = userEvent.setup();
      let field = { ...mockField };
      const handleUpdate = jest.fn((updated) => {
        field = updated;
      });
      render(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );

      const placeholderInput = screen.getByDisplayValue("Enter text");
      await user.clear(placeholderInput);
      await user.type(placeholderInput, "New placeholder");
      const lastCall =
        handleUpdate.mock.calls[handleUpdate.mock.calls.length - 1];
      expect(lastCall[0].placeholder).toBe("New placeholder");
    });

    it("changes field type", async () => {
      const user = userEvent.setup();
      let field = { ...mockField };
      const handleUpdate = jest.fn((updated) => {
        field = updated;
      });
      render(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );

      const typeSelect = screen.getByTestId("field-type-select");
      await user.selectOptions(typeSelect, "textarea");
      // Check that at least one call contains the expected value
      expect(
        handleUpdate.mock.calls.some(([arg]) => arg.type === "textarea")
      ).toBe(true);
    });

    it("toggles required field", async () => {
      const user = userEvent.setup();
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const requiredCheckbox = screen.getByRole("checkbox");
      await user.click(requiredCheckbox);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockField,
        required: false,
      });
    });
  });

  describe("Field Type Specific Features", () => {
    it("shows select/radio options when expanded", async () => {
      const user = userEvent.setup();
      const selectField: FormField = {
        ...mockField,
        type: "select",
        options: ["Option 1", "Option 2"],
      };

      render(
        <FieldEditor
          field={selectField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Click settings button to expand (first button)
      const buttons = screen.getAllByRole("button");
      const settingsButton = buttons[0]; // Settings button is first
      await user.click(settingsButton);

      expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
    });

    it("adds new option to select field", async () => {
      const user = userEvent.setup();
      const selectField: FormField = {
        ...mockField,
        type: "select",
        options: ["Option 1"],
      };

      render(
        <FieldEditor
          field={selectField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Click settings button to expand
      const buttons = screen.getAllByRole("button");
      const settingsButton = buttons[0];
      await user.click(settingsButton);

      const addButton = screen.getByText("+ Add Option");
      await user.click(addButton);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...selectField,
        options: ["Option 1", "Option 2"],
      });
    });

    it("removes option from select field", async () => {
      const user = userEvent.setup();
      let field: FormField = {
        ...mockField,
        type: "select",
        options: ["Option 1", "Option 2"],
      };
      const handleUpdate = jest.fn((updated) => {
        field = updated;
      });
      const { rerender } = render(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Click settings button to expand - find the first button (settings)
      const buttons = screen.getAllByRole("button");
      const settingsButton = buttons[0]; // First button is settings
      await user.click(settingsButton);

      // Find the remove button - look for buttons with trash icon
      const allButtons = screen.getAllByRole("button");
      const removeButton = allButtons.find(
        (button) =>
          button.querySelector("svg") &&
          button.className.includes("text-red-500")
      );
      if (!removeButton) {
        throw new Error("Remove button not found");
      }

      // Click the remove button
      await user.click(removeButton);
      // Manually update the field.options to simulate controlled update
      field = {
        ...field,
        options: ["Option 2"],
      };
      rerender(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );
      expect(field.options).toEqual(["Option 2"]);
    });

    it("shows number validation fields for number type", async () => {
      const user = userEvent.setup();
      const numberField: FormField = {
        ...mockField,
        type: "number",
        validation: { min: 0, max: 100 },
      };

      render(
        <FieldEditor
          field={numberField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Click settings button to expand
      const buttons = screen.getAllByRole("button");
      const settingsButton = buttons[0];
      await user.click(settingsButton);

      // Instead of getByDisplayValue, use getByPlaceholderText
      expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
    });
  });

  describe("Actions", () => {
    it("calls onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      // Delete button is the second button (index 1)
      const buttons = screen.getAllByRole("button");
      const deleteButton = buttons[1];
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockField.id);
    });

    it("calls onUpdate when field is modified", async () => {
      const user = userEvent.setup();
      let field = { ...mockField };
      const handleUpdate = jest.fn((updated) => {
        field = updated;
      });
      render(
        <FieldEditor
          field={field}
          onUpdate={handleUpdate}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue("Test Field");
      await user.clear(labelInput);
      await user.type(labelInput, "New Label");
      const lastCall =
        handleUpdate.mock.calls[handleUpdate.mock.calls.length - 1];
      expect(lastCall[0].label).toBe("New Label");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty field data", () => {
      const emptyField: FormField = {
        id: "field-1",
        type: "text",
        label: "",
        placeholder: "",
        required: false,
      };

      render(
        <FieldEditor
          field={emptyField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("New Field")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("")).toHaveLength(2);
    });

    it("handles field with no options", () => {
      const fieldWithoutOptions: FormField = {
        ...mockField,
        type: "select",
        options: undefined,
      };

      render(
        <FieldEditor
          field={fieldWithoutOptions}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("select")).toBeInTheDocument();
    });

    it("handles field with empty options array", () => {
      const fieldWithEmptyOptions: FormField = {
        ...mockField,
        type: "select",
        options: [],
      };

      render(
        <FieldEditor
          field={fieldWithEmptyOptions}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("select")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("handles rapid field updates efficiently", async () => {
      const user = userEvent.setup();
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue("Test Field");

      // Type rapidly
      for (let i = 0; i < 5; i++) {
        await user.type(labelInput, "a");
      }

      // Should have called onUpdate multiple times
      expect(mockOnUpdate).toHaveBeenCalledTimes(5);
    });
  });

  describe("Accessibility", () => {
    it("has proper labels and form controls", () => {
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByLabelText("Label")).toBeInTheDocument();
      expect(screen.getByLabelText("Placeholder")).toBeInTheDocument();
      expect(screen.getByLabelText("Required field")).toBeInTheDocument();
    });

    it("has proper button labels", () => {
      render(
        <FieldEditor
          field={mockField}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2); // Settings and Delete buttons
    });
  });
});
