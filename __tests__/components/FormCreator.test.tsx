import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormCreator } from "../../src/components/FormCreator";

// Mock useTestSession hook
jest.mock("../../src/components/TestSessionProvider", () => ({
  useTestSession: () => ({ isTestMode: true }),
}));

// Mock the FormBuilder component
jest.mock("../../src/components/FormBuilder", () => ({
  FormBuilder: ({ onSave, onPreview, isSaving }: any) => (
    <div data-testid="form-builder">
      <button
        onClick={() =>
          onSave({ title: "Test Form", description: "Test", fields: [] })
        }
      >
        Save Form
      </button>
      <button onClick={onPreview}>Preview</button>
      {isSaving && <span>Saving...</span>}
    </div>
  ),
}));

// Mock router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("FormCreator", () => {
  const renderFormCreator = () => {
    return render(<FormCreator />);
  };

  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders form creator with title and description", () => {
    renderFormCreator();
    expect(screen.getByText("New Form")).toBeInTheDocument();
    expect(screen.getByText(/create a new form/i)).toBeInTheDocument();
  });

  it("renders back button", () => {
    renderFormCreator();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders FormBuilder component", () => {
    renderFormCreator();
    expect(screen.getByTestId("form-builder")).toBeInTheDocument();
  });

  it("handles form save successfully", async () => {
    const user = userEvent.setup();
    const mockForm = { id: "test-form-id", title: "Test Form" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockForm,
    });
    renderFormCreator();
    const saveButton = screen.getByText("Save Form");
    await user.click(saveButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-user": "true",
        },
        body: JSON.stringify({
          title: "Test Form",
          description: "Test",
          fields: [],
        }),
      });
    });
  });

  it("handles form save with test mode", async () => {
    const user = userEvent.setup();
    const mockForm = { id: "test-form-id", title: "Test Form" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockForm,
    });
    renderFormCreator();
    const saveButton = screen.getByText("Save Form");
    await user.click(saveButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-user": "true",
        },
        body: JSON.stringify({
          title: "Test Form",
          description: "Test",
          fields: [],
        }),
      });
    });
  });

  it("handles save error", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );
    renderFormCreator();
    const saveButton = screen.getByText("Save Form");
    await user.click(saveButton);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving form:",
        expect.any(Error)
      );
      expect(alertSpy).toHaveBeenCalledWith(
        "An error occurred while saving the form"
      );
    });
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it("handles save response error", async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Validation failed" }),
    });
    renderFormCreator();
    const saveButton = screen.getByText("Save Form");
    await user.click(saveButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Failed to save form: Validation failed"
      );
    });
    alertSpy.mockRestore();
  });

  it("handles preview button click", async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    renderFormCreator();
    const previewButton = screen.getByText("Preview");
    await user.click(previewButton);
    expect(alertSpy).toHaveBeenCalledWith("Preview functionality coming soon!");
    alertSpy.mockRestore();
  });

  it("shows loading state during save", async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ id: "test-form-id" }),
              }),
            100
          )
        )
    );
    renderFormCreator();
    const saveButton = screen.getByText("Save Form");
    await user.click(saveButton);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", async () => {
    const user = userEvent.setup();
    renderFormCreator();
    const backButton = screen.getByText("Back");
    await user.click(backButton);
    expect(mockRouter.back).toHaveBeenCalled();
  });
});
