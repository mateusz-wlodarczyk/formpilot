import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

var mockSignOut: jest.Mock;

jest.mock("next-auth/react", () => {
  mockSignOut = jest.fn();
  return {
    signOut: (...args: any[]) => mockSignOut(...args),
  };
});

import SignOutButton from "../../src/components/SignOutButton";

describe("SignOutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign out button", () => {
    render(<SignOutButton />);
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls signOut with correct parameters when clicked", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);
    const button = screen.getByText("Sign out");
    await user.click(button);
    expect(mockSignOut).toHaveBeenCalledWith({
      callbackUrl: "/auth/signin",
    });
  });

  it("has correct styling classes", () => {
    render(<SignOutButton />);
    const button = screen.getByText("Sign out");
    expect(button).toHaveClass(
      "bg-red-500",
      "hover:bg-red-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-lg",
      "text-sm",
      "font-medium",
      "transition-colors"
    );
  });

  it("is accessible by keyboard", () => {
    render(<SignOutButton />);
    const button = screen.getByText("Sign out");
    button.focus();
    expect(button).toHaveFocus();
  });

  it("has proper button role", () => {
    render(<SignOutButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("handles multiple clicks correctly", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);
    const button = screen.getByText("Sign out");
    await user.click(button);
    await user.click(button);
    await user.click(button);
    expect(mockSignOut).toHaveBeenCalledTimes(3);
  });

  it("works with fireEvent for compatibility", () => {
    render(<SignOutButton />);
    const button = screen.getByText("Sign out");
    fireEvent.click(button);
    expect(mockSignOut).toHaveBeenCalledWith({
      callbackUrl: "/auth/signin",
    });
  });
});
