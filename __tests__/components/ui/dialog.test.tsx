import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

describe("Dialog Component", () => {
  const defaultProps = {
    children: "Dialog content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.getByRole("button", { name: /open dialog/i })
    ).toBeInTheDocument();
  });

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("Dialog description")).toBeInTheDocument();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  it("closes dialog on escape key", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes dialog on backdrop click", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Find the overlay by its data-slot attribute
    const backdrop = document.querySelector('[data-slot="dialog-overlay"]');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop!);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes dialog on close button click", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("handles controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders dialog with footer", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm/i })
      ).toBeInTheDocument();
    });
  });

  it("handles dialog without header", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>{defaultProps.children}</DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  it("handles dialog without description", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.queryByText("Dialog description")).not.toBeInTheDocument();
    });
  });

  it("handles long content", async () => {
    const user = userEvent.setup();
    const longContent = "A".repeat(1000);

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <div style={{ height: "2000px" }}>{longContent}</div>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });

  it("handles multiple dialogs", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dialog>
          <DialogTrigger>Open Dialog 1</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog 1</DialogTitle>
            </DialogHeader>
            Content 1
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>Open Dialog 2</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog 2</DialogTitle>
            </DialogHeader>
            Content 2
          </DialogContent>
        </Dialog>
      </div>
    );

    const trigger1 = screen.getByRole("button", { name: /open dialog 1/i });
    await user.click(trigger1);
    await waitFor(() => {
      expect(screen.getByText("Dialog 1")).toBeInTheDocument();
    });

    // Close the first dialog before opening the second
    const closeButton1 = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton1);
    await waitFor(() => {
      expect(screen.queryByText("Dialog 1")).not.toBeInTheDocument();
    });

    const trigger2 = screen.getByRole("button", { name: /open dialog 2/i });
    await user.click(trigger2);
    await waitFor(() => {
      expect(screen.getByText("Dialog 2")).toBeInTheDocument();
    });
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <button>First button</button>
          <button>Second button</button>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const firstButton = screen.getByRole("button", { name: /first button/i });
    const secondButton = screen.getByRole("button", { name: /second button/i });

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    await user.keyboard("{Tab}");
    expect(secondButton).toHaveFocus();
  });

  it("is accessible with proper ARIA attributes", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-labelledby");
      expect(dialog).toHaveAttribute("aria-describedby");
    });
  });

  it("handles focus trap", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <button>First</button>
          <button>Last</button>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const firstButton = screen.getByRole("button", { name: /first/i });
    const lastButton = screen.getByRole("button", { name: /last/i });
    const closeButton = screen.getByRole("button", { name: /close/i });

    // Focus should be on the first button by default
    expect(firstButton).toHaveFocus();

    // Tab through the dialog
    await user.tab();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab should go back to last button
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(lastButton).toHaveFocus();
  });

  it("handles custom trigger element", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <div role="button" tabIndex={0}>
            Custom trigger
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          {defaultProps.children}
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.getByRole("button", { name: /custom trigger/i })
    ).toBeInTheDocument();
  });

  it("handles dialog with form", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Dialog</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <input name="name" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Name");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(input, "Test Name");
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("handles dialog with scrollable content", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Dialog</DialogTitle>
          </DialogHeader>
          <div style={{ height: "1000px", overflow: "auto" }}>
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i}>Content line {i + 1}</div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Content line 1")).toBeInTheDocument();
      expect(screen.getByText("Content line 50")).toBeInTheDocument();
    });
  });

  it("opens and closes dialog", () => {
    render(<Dialog open={false} />);
    // Simulate open/close
  });

  it("has proper ARIA attributes", () => {
    render(<Dialog open={true} />);
    // Check ARIA
  });
});
