import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

describe("Select Component", () => {
  const defaultProps = {
    onValueChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders select trigger", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("displays selected value", async () => {
    render(
      <Select {...defaultProps} defaultValue="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  it("is accessible with proper ARIA attributes", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("handles disabled state", async () => {
    render(
      <Select {...defaultProps} disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });

  it("handles empty options gracefully", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>{/* No options */}</SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("handles long option text", async () => {
    const longText =
      "A very long option text that may be problematic for display in the select component";

    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="long">{longText}</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("handles special characters in option text", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="special">
            Option with &lt;tags&gt; and "quotes"
          </SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("handles multiple options", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
          <SelectItem value="option4">Option 4</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("handles numeric values", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select a number" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
          <SelectItem value="3">Three</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("handles custom trigger element", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <div role="button" tabIndex={0}>
            Custom trigger
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /custom trigger/i })
      ).toBeInTheDocument();
    });
  });

  it("handles aria attributes for accessibility", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded");
    });
  });

  it("handles data attributes", () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger data-testid="custom-select">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const select = screen.getByTestId("custom-select");
    expect(select).toBeInTheDocument();
  });

  it("handles controlled value", () => {
    render(
      <Select {...defaultProps} value="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("handles default value", () => {
    render(
      <Select {...defaultProps} defaultValue="option2">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("handles empty value", () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("handles custom className", () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger className="custom-select">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveClass("custom-select");
  });

  it("handles custom styling", async () => {
    render(
      <Select {...defaultProps}>
        <SelectTrigger style={{ color: "red" }}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    await waitFor(() => {
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });
  });
});
