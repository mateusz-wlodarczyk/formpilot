import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label } from "@/components/ui/label";
import React from "react";

describe("Label Component", () => {
  describe("Basic Rendering", () => {
    it("renders with text content", () => {
      render(<Label>Test Label</Label>);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders with htmlFor attribute", () => {
      render(<Label htmlFor="test-input">Test Label</Label>);
      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("for", "test-input");
    });

    it("renders with custom className", () => {
      render(<Label className="custom-class">Test Label</Label>);
      const label = screen.getByText("Test Label");
      expect(label).toHaveClass("custom-class");
    });

    it("handles empty children", () => {
      render(<Label />);
      const label = screen.getByRole("generic");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Content Types", () => {
    it("handles string content", () => {
      render(<Label>Simple text</Label>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("handles JSX content", () => {
      render(
        <Label>
          <span>Text with</span> <strong>formatting</strong>
        </Label>
      );
      expect(screen.getByText("Text with")).toBeInTheDocument();
      expect(screen.getByText("formatting")).toBeInTheDocument();
    });

    it("handles mixed content types", () => {
      render(
        <Label>
          Text content <span>with span</span> and <strong>bold text</strong>
        </Label>
      );
      expect(screen.getByText(/text content/i)).toBeInTheDocument();
      expect(screen.getByText("with span")).toBeInTheDocument();
      expect(screen.getByText("bold text")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Label aria-label="Custom label">Test</Label>);
      expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <div id="description">Description</div>
          <Label aria-describedby="description">Test</Label>
        </div>
      );
      const label = screen.getByText("Test");
      expect(label).toHaveAttribute("aria-describedby", "description");
    });

    it("supports role attribute", () => {
      render(<Label role="presentation">Test</Label>);
      expect(screen.getByRole("presentation")).toBeInTheDocument();
    });
  });

  describe("Styling and Customization", () => {
    it("applies default styling classes", () => {
      render(<Label>Test Label</Label>);
      const label = screen.getByText("Test Label");
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("font-medium");
    });

    it("applies custom styles", () => {
      render(
        <Label style={{ color: "red", fontWeight: "bold" }}>Test Label</Label>
      );
      const label = screen.getByText("Test Label");
      expect(label).toHaveStyle({
        color: "rgb(255, 0, 0)",
        fontWeight: "bold",
      });
    });

    it("combines custom className with default classes", () => {
      render(<Label className="custom-class">Test Label</Label>);
      const label = screen.getByText("Test Label");
      expect(label).toHaveClass("custom-class");
      expect(label).toHaveClass("text-sm");
    });

    it("applies custom className", () => {
      render(<Label className="error-label">Test Label</Label>);

      const label = screen.getByText("Test Label");
      expect(label).toHaveClass("error-label");
    });
  });

  describe("Form Integration", () => {
    it("associates with form controls", () => {
      render(
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
        </div>
      );
      const label = screen.getByText("Email");
      expect(label).toHaveAttribute("for", "email");
    });

    it("works with form validation", () => {
      render(
        <Label htmlFor="required-field" className="required">
          Required Field
        </Label>
      );
      const label = screen.getByText("Required Field");
      expect(label).toHaveClass("required");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long text", () => {
      const longText =
        "A very long label text that may be problematic for display in the user interface and may require special styling";
      render(<Label>{longText}</Label>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles special characters", () => {
      const specialText =
        'Label with &lt;tags&gt; and "quotes" and characters: !@#$%^&*()';
      render(<Label>{specialText}</Label>);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("handles unicode characters", () => {
      render(<Label>Label with émojis 🎉 and 中文</Label>);
      expect(
        screen.getByText("Label with émojis 🎉 and 中文")
      ).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards additional props", () => {
      render(
        <Label data-testid="test-label" title="Tooltip" tabIndex={0}>
          Test Label
        </Label>
      );
      const label = screen.getByTestId("test-label");
      expect(label).toHaveAttribute("title", "Tooltip");
      expect(label).toHaveAttribute("tabIndex", "0");
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Test Label</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  it("handles long text content", () => {
    const longText =
      "A very long label text that may be problematic for display in the user interface and may require special styling";

    render(<Label>{longText}</Label>);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("handles special characters in text", () => {
    const specialText =
      'Label with &lt;tags&gt; and "quotes" and characters: !@#$%^&*()';

    render(<Label>{specialText}</Label>);

    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it("handles numeric content", () => {
    render(<Label>123</Label>);

    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("handles label with input association", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  it("handles label with textarea association", () => {
    render(
      <div>
        <Label htmlFor="test-textarea">Description</Label>
        <textarea id="test-textarea" />
      </div>
    );

    const label = screen.getByText("Description");
    const textarea = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "test-textarea");
    expect(textarea).toHaveAttribute("id", "test-textarea");
  });

  it("handles label with select association", () => {
    render(
      <div>
        <Label htmlFor="test-select">Choose option</Label>
        <select id="test-select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
    );

    const label = screen.getByText("Choose option");
    const select = screen.getByRole("combobox");

    expect(label).toHaveAttribute("for", "test-select");
    expect(select).toHaveAttribute("id", "test-select");
  });

  it("handles label with checkbox association", () => {
    render(
      <div>
        <Label htmlFor="test-checkbox">Accept terms</Label>
        <input id="test-checkbox" type="checkbox" />
      </div>
    );

    const label = screen.getByText("Accept terms");
    const checkbox = screen.getByRole("checkbox");

    expect(label).toHaveAttribute("for", "test-checkbox");
    expect(checkbox).toHaveAttribute("id", "test-checkbox");
  });

  it("handles label with radio association", () => {
    render(
      <div>
        <Label htmlFor="test-radio">Select option</Label>
        <input id="test-radio" type="radio" name="test" />
      </div>
    );

    const label = screen.getByText("Select option");
    const radio = screen.getByRole("radio");

    expect(label).toHaveAttribute("for", "test-radio");
    expect(radio).toHaveAttribute("id", "test-radio");
  });

  it("handles click on label to focus associated input", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor="test-input">Click me</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText("Click me");
    const input = screen.getByRole("textbox");

    await user.click(label);

    expect(input).toHaveFocus();
  });

  it("handles click on label to focus associated textarea", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor="test-textarea">Click me</Label>
        <textarea id="test-textarea" />
      </div>
    );

    const label = screen.getByText("Click me");
    const textarea = screen.getByRole("textbox");

    await user.click(label);

    expect(textarea).toHaveFocus();
  });

  it("handles click on label to toggle associated checkbox", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor="test-checkbox">Click me</Label>
        <input id="test-checkbox" type="checkbox" />
      </div>
    );

    const label = screen.getByText("Click me");
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    await user.click(label);

    expect(checkbox).toBeChecked();
  });

  it("handles click on label to select associated radio", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor="test-radio">Click me</Label>
        <input id="test-radio" type="radio" name="test" />
      </div>
    );

    const label = screen.getByText("Click me");
    const radio = screen.getByRole("radio");

    expect(radio).not.toBeChecked();

    await user.click(label);

    expect(radio).toBeChecked();
  });

  it("handles aria attributes for accessibility", () => {
    render(
      <Label aria-describedby="help-text" aria-invalid="true">
        Test Label
      </Label>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("aria-describedby", "help-text");
    expect(label).toHaveAttribute("aria-invalid", "true");
  });

  it("handles data attributes", () => {
    render(<Label data-testid="custom-label" />);

    const label = screen.getByTestId("custom-label");
    expect(label).toBeInTheDocument();
  });

  it("handles label with error state styling", () => {
    render(<Label className="error-label">Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("error-label");
  });

  it("handles label with disabled state", () => {
    render(
      <div>
        <Label htmlFor="disabled-input" className="disabled">
          Disabled Label
        </Label>
        <input id="disabled-input" type="text" disabled />
      </div>
    );

    const label = screen.getByText("Disabled Label");
    const input = screen.getByRole("textbox");

    expect(label).toHaveClass("disabled");
    expect(input).toBeDisabled();
  });

  it("handles label with tooltip or help text", () => {
    render(
      <div>
        <Label htmlFor="input-with-help">Field with help</Label>
        <input id="input-with-help" type="text" />
        <span id="help-text">This field is required</span>
      </div>
    );

    const label = screen.getByText("Field with help");
    const helpText = screen.getByText("This field is required");

    expect(label).toBeInTheDocument();
    expect(helpText).toBeInTheDocument();
  });
});
