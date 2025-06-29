import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { TestSessionProvider } from "../../../src/components/TestSessionProvider";

// Mock fetch
global.fetch = jest.fn();

// Mock the forms API
jest.mock("../../../src/lib/forms-logic", () => ({
  getForms: jest.fn(),
}));

describe("Dashboard List Page", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders dashboard heading", () => {
    render(
      <TestSessionProvider>
        <DashboardPage />
      </TestSessionProvider>
    );
    expect(
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it("renders new form button", () => {
    render(
      <TestSessionProvider>
        <DashboardPage />
      </TestSessionProvider>
    );
    expect(
      screen.getByRole("button", {
        name: /new form|create first form/i,
      })
    ).toBeInTheDocument();
  });

  it("renders empty state if no forms", async () => {
    render(
      <TestSessionProvider>
        <DashboardPage />
      </TestSessionProvider>
    );

    // Wait for loading to finish and empty state to appear
    await waitFor(() => {
      expect(screen.getByText(/no forms yet/i)).toBeInTheDocument();
    });
  });
});
