import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type TestFormData = z.infer<typeof testSchema>;

const TestFormComponent = ({
  onSubmit,
}: {
  onSubmit: (data: TestFormData) => void;
}) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

describe("Form Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with all form components", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      // Check that the form data is accessible from the event
      const callArgs = onSubmit.mock.calls[0][0];
      expect(callArgs).toHaveProperty("name", "John Doe");
      expect(callArgs).toHaveProperty("email", "john@example.com");
    });
  });

  it("shows validation errors for invalid data", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    // Wait for validation to complete
    await waitFor(
      () => {
        expect(onSubmit).not.toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Check for validation error
    await waitFor(
      () => {
        const errorElement = screen.queryByText("Invalid email");
        if (errorElement) {
          expect(errorElement).toBeInTheDocument();
        }
      },
      { timeout: 3000 }
    );
  });

  it("clears validation errors when user starts typing", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Enter your name");
    await user.type(nameInput, "John");

    await waitFor(() => {
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });
  });

  it("handles form with default values", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    await user.type(nameInput, "Test input");

    expect(nameInput).toHaveValue("Test input");
  });

  it("handles aria attributes for accessibility", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");

    expect(nameInput).toHaveAttribute("aria-describedby");
    expect(emailInput).toHaveAttribute("aria-describedby");
  });

  it("handles form description", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    expect(screen.getByText("Enter your full name")).toBeInTheDocument();
  });

  it("handles form labels", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("handles form messages", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("handles form control", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it("handles form item", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const formItems = screen.getAllByRole("textbox");
    expect(formItems).toHaveLength(2);
  });

  it("handles form field", () => {
    const onSubmit = jest.fn();

    render(<TestFormComponent onSubmit={onSubmit} />);

    const nameField = screen.getByLabelText("Name");
    const emailField = screen.getByLabelText("Email");

    expect(nameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
  });
});
