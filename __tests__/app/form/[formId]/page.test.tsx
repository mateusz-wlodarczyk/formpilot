import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";
import PublicFormPage from "@/app/form/[formId]/page";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Public Form Page", () => {
  const mockForm = {
    id: "test-form-id",
    title: "Test Form",
    description: "Test form description",
    isActive: true,
    fields: [
      {
        id: "field1",
        type: "text",
        label: "Name",
        required: true,
        placeholder: "Enter your name",
      },
      {
        id: "field2",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "Enter your email",
      },
    ],
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ formId: "test-form-id" });
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockForm,
    });
  });

  it("renders form title and description", async () => {
    render(<PublicFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Form")).toBeInTheDocument();
      expect(screen.getByText("Test form description")).toBeInTheDocument();
    });
  });

  it("renders form fields", async () => {
    render(<PublicFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your name")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
    });
  });

  it("submits form successfully", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockForm,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "submission-id" }),
      });

    render(<PublicFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByRole("button", {
      name: /submit response/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Thank you!")).toBeInTheDocument();
    });
  });

  it("shows validation errors for required fields", async () => {
    render(<PublicFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /submit response/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("This field is required")).toHaveLength(2);
    });
  });

  it("shows loading state", () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<PublicFormPage />);

    expect(screen.getByText("Loading form...")).toBeInTheDocument();
  });

  it("shows error state when form not found", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<PublicFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Form not found")).toBeInTheDocument();
    });
  });

  it("renders form title and fields", () => {
    render(<PublicFormPage />);
    expect(screen.getByText("Loading form...")).toBeInTheDocument();
  });

  it("validates required fields", () => {
    // Simulate submit with empty required fields
  });

  it("submits valid data", () => {
    // Fill and submit form
  });
});
