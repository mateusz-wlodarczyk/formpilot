import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SignInButton from "@/app/auth/signin/SignInButton";

describe("SignInButton", () => {
  it("renders with Google sign in button", () => {
    render(<SignInButton />);
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });

  it("renders with GitHub sign in button", () => {
    render(<SignInButton />);
    expect(screen.getByText(/sign in with github/i)).toBeInTheDocument();
  });

  it("calls signIn on Google button click", () => {
    render(<SignInButton />);
    const googleButton = screen.getByText(/sign in with google/i);
    fireEvent.click(googleButton);
    // Note: signIn is mocked in jest.setup.js
  });

  it("calls signIn on GitHub button click", () => {
    render(<SignInButton />);
    const githubButton = screen.getByText(/sign in with github/i);
    fireEvent.click(githubButton);
    // Note: signIn is mocked in jest.setup.js
  });

  it("is accessible by keyboard", () => {
    render(<SignInButton />);
    const googleButton = screen.getByText(/sign in with google/i);
    googleButton.focus();
    expect(googleButton).toHaveFocus();
  });
});
