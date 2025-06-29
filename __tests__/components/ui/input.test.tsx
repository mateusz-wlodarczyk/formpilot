import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input element", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("handles value changes", async () => {
    const user = userEvent.setup();
    render(<Input onChange={mockOnChange} placeholder="Test" />);

    const input = screen.getByPlaceholderText("Test");
    await user.type(input, "Hello");

    expect(mockOnChange).toHaveBeenCalled();
    expect(input).toHaveValue("Hello");
  });

  it("applies different input types", () => {
    render(<Input type="email" placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("applies disabled state", () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText("Disabled");
    expect(input).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" placeholder="Custom" />);
    const input = screen.getByPlaceholderText("Custom");
    expect(input).toHaveClass("custom-input");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("handles placeholder text", () => {
    render(<Input placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();
  });

  it("handles controlled input", () => {
    render(
      <Input
        value="Controlled"
        onChange={mockOnChange}
        placeholder="Controlled"
      />
    );
    const input = screen.getByPlaceholderText("Controlled");
    expect(input).toHaveValue("Controlled");
  });

  it("supports min/max attributes for number input", () => {
    render(<Input type="number" min="0" max="100" placeholder="Number" />);
    const input = screen.getByPlaceholderText("Number");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("supports minlength/maxlength attributes", () => {
    render(<Input minLength={5} maxLength={10} placeholder="Length" />);
    const input = screen.getByPlaceholderText("Length");
    expect(input).toHaveAttribute("minlength", "5");
    expect(input).toHaveAttribute("maxlength", "10");
  });

  it("supports pattern attribute", () => {
    render(<Input pattern="[A-Za-z]{3}" placeholder="Pattern" />);
    const input = screen.getByPlaceholderText("Pattern");
    expect(input).toHaveAttribute("pattern", "[A-Za-z]{3}");
  });

  it("supports step attribute for number input", () => {
    render(<Input type="number" step="0.1" placeholder="Step" />);
    const input = screen.getByPlaceholderText("Step");
    expect(input).toHaveAttribute("step", "0.1");
  });

  it("supports ARIA labels", () => {
    render(<Input aria-label="Custom label" placeholder="Label" />);
    expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
  });

  it("supports keyboard navigation", () => {
    render(<Input placeholder="Keyboard" />);

    const input = screen.getByPlaceholderText("Keyboard");
    input.focus();

    expect(input).toHaveFocus();
  });

  it("supports validation error announcements", () => {
    render(
      <Input
        aria-invalid="true"
        aria-describedby="error-message"
        placeholder="Error"
      />
    );

    const input = screen.getByPlaceholderText("Error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "error-message");
  });

  it("manages focus properly", () => {
    render(<Input placeholder="Focus" />);

    const input = screen.getByPlaceholderText("Focus");
    input.focus();

    expect(input).toHaveFocus();
  });

  it("passes through additional props", () => {
    render(
      <Input
        data-testid="custom-input"
        className="custom-class"
        placeholder="Custom"
      />
    );

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveClass("custom-class");
  });

  it("supports name attribute", () => {
    render(<Input name="test-input" placeholder="Name" />);
    const input = screen.getByPlaceholderText("Name");
    expect(input).toHaveAttribute("name", "test-input");
  });

  it("supports id attribute", () => {
    render(<Input id="test-id" placeholder="ID" />);
    const input = screen.getByPlaceholderText("ID");
    expect(input).toHaveAttribute("id", "test-id");
  });

  it("supports autoComplete attribute", () => {
    render(<Input autoComplete="email" placeholder="Auto" />);
    const input = screen.getByPlaceholderText("Auto");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("handles empty value", () => {
    render(<Input value="" onChange={mockOnChange} placeholder="Empty" />);
    const input = screen.getByPlaceholderText("Empty");
    expect(input).toHaveValue("");
  });

  it("handles long values", () => {
    const longValue = "Lorem ipsum ".repeat(50);
    render(
      <Input value={longValue} onChange={mockOnChange} placeholder="Long" />
    );
    const input = screen.getByPlaceholderText("Long");
    expect(input).toHaveValue(longValue);
  });

  it("handles special characters", () => {
    const specialValue = "Text with émojis 🎉 and symbols @#$%";
    render(
      <Input
        value={specialValue}
        onChange={mockOnChange}
        placeholder="Special"
      />
    );
    const input = screen.getByPlaceholderText("Special");
    expect(input).toHaveValue(specialValue);
  });

  it("handles null onChange prop", () => {
    render(<Input onChange={null} placeholder="Null" />);
    const input = screen.getByPlaceholderText("Null");
    fireEvent.change(input, { target: { value: "Test" } });

    expect(input).toBeInTheDocument();
  });

  it("handles undefined type", () => {
    render(<Input type={undefined} placeholder="Undefined" />);
    const input = screen.getByPlaceholderText("Undefined");
    expect(input).toBeInTheDocument();
  });

  it("renders quickly", () => {
    const startTime = performance.now();
    render(<Input placeholder="Performance" />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50);
  });

  it("handles rapid changes", () => {
    render(<Input onChange={mockOnChange} placeholder="Rapid" />);

    const input = screen.getByPlaceholderText("Rapid");

    for (let i = 0; i < 100; i++) {
      fireEvent.change(input, { target: { value: `Value ${i}` } });
    }

    expect(mockOnChange).toHaveBeenCalledTimes(100);
  });

  it("works with form elements", () => {
    render(
      <form>
        <Input name="test" placeholder="Form Input" />
      </form>
    );

    const input = screen.getByPlaceholderText("Form Input");
    expect(input).toHaveAttribute("name", "test");
  });

  it("works with label elements", () => {
    render(
      <div>
        <label htmlFor="test-input">Test Label</label>
        <Input id="test-input" placeholder="Labeled" />
      </div>
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("works with validation messages", () => {
    render(
      <div>
        <Input aria-describedby="error" placeholder="Validation" />
        <div id="error">Error message</div>
      </div>
    );

    const input = screen.getByPlaceholderText("Validation");
    expect(input).toHaveAttribute("aria-describedby", "error");
  });
});
