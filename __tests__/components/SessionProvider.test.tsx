import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SessionProvider from "@/components/SessionProvider";

describe("SessionProvider", () => {
  it("renders children with session context", () => {
    render(
      <SessionProvider session={{ user: { name: "Test" } }}>
        <div>Child</div>
      </SessionProvider>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
  it("handles unauthenticated state", () => {
    render(
      <SessionProvider session={null}>
        <div>Child</div>
      </SessionProvider>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
