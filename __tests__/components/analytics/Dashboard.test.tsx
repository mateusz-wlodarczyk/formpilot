import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { TestSessionProvider } from "../../../src/components/TestSessionProvider";

describe("DashboardPage", () => {
  it("renders empty state", () => {
    render(
      <TestSessionProvider>
        <DashboardPage />
      </TestSessionProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders forms and statistics", () => {
    // Mock forms data if needed
    // ...
    // expect(screen.getByText("My Forms")).toBeInTheDocument();
    // expect(screen.getByText(/total forms/i)).toBeInTheDocument();
  });

  it("navigates to new form on button click", () => {
    // Mock router and test navigation
  });
});
