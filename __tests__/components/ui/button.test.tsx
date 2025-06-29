import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with default styles", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("applies variant styles", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size styles", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    render(<Button style={{ backgroundColor: "red" }}>Styled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("style", "background-color: red;");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles empty children", () => {
    render(<Button></Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("handles long text content", () => {
    const longText = "Lorem ipsum ".repeat(20);
    render(<Button>{longText}</Button>);
    const button = screen.getByRole("button");
    expect(button.textContent).toContain("Lorem ipsum");
  });

  it("handles special characters", () => {
    const specialText = "Button with émojis 🎉 and symbols @#$%";
    render(<Button>{specialText}</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(specialText);
  });

  it("handles null onClick prop", () => {
    render(<Button onClick={undefined}>No Click</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it("handles undefined variant", () => {
    render(<Button variant={undefined}>Undefined</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders quickly", () => {
    const startTime = performance.now();
    render(<Button>Performance</Button>);
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(100);
  });

  it("handles rapid clicks", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Rapid</Button>);

    const button = screen.getByRole("button");

    for (let i = 0; i < 10; i++) {
      await user.click(button);
    }

    expect(handleClick).toHaveBeenCalledTimes(10);
  });

  it("works with form elements", () => {
    render(
      <form>
        <Button type="submit">Submit</Button>
      </form>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("works with keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Button>Keyboard</Button>);

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(button).toBeInTheDocument();
  });

  it("works with screen readers", () => {
    render(<Button aria-label="Custom label">Button</Button>);
    expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
  });
});
