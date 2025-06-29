import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import FormEditPage from "@/app/dashboard/[formId]/page";
import { TestSessionProvider } from "../../../../src/components/TestSessionProvider";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Dashboard Form Page", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ formId: "test-form-id" });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "test-form-id",
        title: "Test Form",
        description: "Test Description",
        fields: [],
        submissions: [],
      }),
    });
  });

  it("renders dashboard form heading", async () => {
    render(
      <TestSessionProvider>
        <FormEditPage />
      </TestSessionProvider>
    );
    // Wait for loading to finish
    await screen.findByRole("heading", { name: "Test Form" });
    expect(
      screen.getByRole("heading", { name: "Test Form" })
    ).toBeInTheDocument();
    // There may be multiple elements with the same description text (e.g., <p> and <textarea>), so use getAllByText
    expect(screen.getAllByText("Test Description").length).toBeGreaterThan(0);
  });

  it("renders analytics section", async () => {
    render(
      <TestSessionProvider>
        <FormEditPage />
      </TestSessionProvider>
    );
    // Wait for loading to finish
    await screen.findByRole("heading", { name: "Test Form" });
    expect(screen.getAllByText("Edit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preview").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Share").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View Responses").length).toBeGreaterThan(0);
  });
});
