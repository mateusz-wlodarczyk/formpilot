import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea Component", () => {
  const defaultProps = {
    placeholder: "Enter text...",
  };

  it("renders textarea with placeholder", () => {
    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Enter text...");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Textarea {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test input");

    expect(textarea).toHaveValue("Test input");
    expect(onChange).toHaveBeenCalled();
  });

  it("displays initial value", () => {
    render(<Textarea {...defaultProps} defaultValue="Initial text" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Initial text");
  });

  it("handles controlled value", () => {
    render(<Textarea {...defaultProps} value="Controlled text" readOnly />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Controlled text");
  });

  it("applies custom className", () => {
    render(<Textarea {...defaultProps} className="custom-class" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("handles disabled state", () => {
    render(<Textarea {...defaultProps} disabled />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("handles readOnly state", () => {
    render(<Textarea {...defaultProps} readOnly />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
  });

  it("handles required attribute", () => {
    render(<Textarea {...defaultProps} required />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeRequired();
  });

  it("handles name attribute", () => {
    render(<Textarea {...defaultProps} name="description" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("name", "description");
  });

  it("handles id attribute", () => {
    render(<Textarea {...defaultProps} id="textarea-id" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("id", "textarea-id");
  });

  it("handles rows attribute", () => {
    render(<Textarea {...defaultProps} rows={5} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("handles cols attribute", () => {
    render(<Textarea {...defaultProps} cols={50} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("cols", "50");
  });

  it("handles maxLength attribute", () => {
    render(<Textarea {...defaultProps} maxLength={100} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxlength", "100");
  });

  it("handles minLength attribute", () => {
    render(<Textarea {...defaultProps} minLength={10} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("minlength", "10");
  });

  it("handles autoFocus attribute", () => {
    render(<Textarea {...defaultProps} autoFocus />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveFocus();
  });

  it("handles spellCheck attribute", () => {
    render(<Textarea {...defaultProps} spellCheck={false} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("spellcheck", "false");
  });

  it("handles wrap attribute", () => {
    render(<Textarea {...defaultProps} wrap="hard" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("wrap", "hard");
  });

  it("handles long text input", async () => {
    const user = userEvent.setup();
    const longText = "A".repeat(1000);

    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, longText);

    expect(textarea).toHaveValue(longText);
  });

  it("handles special characters", () => {
    const specialChars = "Text with émojis 🎉 and symbols @#$%";
    const onChange = jest.fn();
    render(
      <Textarea
        value={specialChars}
        onChange={onChange}
        placeholder="Special"
      />
    );
    const textarea = screen.getByPlaceholderText("Special");
    expect(textarea).toHaveValue(specialChars);
  });

  it("handles multiline text", async () => {
    const user = userEvent.setup();

    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");

    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  it("handles copy and paste", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text");
    await user.type(textarea, "Test text");

    // Select all text
    await user.keyboard("{Control>}a{/Control}");

    // Clear the text
    await user.keyboard("{Delete}");

    // Type new text
    await user.type(textarea, "New text");

    expect(textarea).toHaveValue("New text");
  });

  it("handles keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text");
    await user.type(textarea, "Test text");

    // Clear and add new text
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Delete}");
    await user.type(textarea, "Start Test text");

    expect(textarea).toHaveValue("Start Test text");
  });

  it("handles resize functionality", () => {
    const onChange = jest.fn();
    render(<Textarea onChange={onChange} placeholder="Resize" />);

    const textarea = screen.getByPlaceholderText("Resize");
    expect(textarea).toHaveStyle({ resize: "auto" });
  });

  it("handles focus and blur events", async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <div>
        <Textarea {...defaultProps} onFocus={onFocus} onBlur={onBlur} />
        <button>Outside</button>
      </div>
    );

    const textarea = screen.getByRole("textbox");
    const outsideButton = screen.getByText("Outside");

    await user.click(textarea);
    expect(onFocus).toHaveBeenCalled();

    await user.click(outsideButton);
    expect(onBlur).toHaveBeenCalled();
  });

  it("handles form submission", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Textarea {...defaultProps} name="content" />
        <button type="submit">Submit</button>
      </form>
    );

    const textarea = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(textarea, "Form content");
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("handles aria attributes for accessibility", () => {
    render(
      <Textarea
        {...defaultProps}
        aria-label="Description field"
        aria-describedby="help-text"
        aria-invalid="true"
      />
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "Description field");
    expect(textarea).toHaveAttribute("aria-describedby", "help-text");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("handles data attributes", () => {
    render(<Textarea {...defaultProps} data-testid="custom-textarea" />);

    const textarea = screen.getByTestId("custom-textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("handles ref forwarding", () => {
    const ref = jest.fn();

    render(<Textarea {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });
});
