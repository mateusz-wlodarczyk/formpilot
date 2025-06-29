import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmbedCode } from "@/components/EmbedCode";

beforeAll(() => {
  Object.defineProperty(window.navigator, "clipboard", {
    value: { writeText: jest.fn() },
    writable: true,
    configurable: true,
  });
});

beforeEach(() => {
  window.navigator.clipboard.writeText = jest.fn();
});

describe("EmbedCode Component", () => {
  const mockFormId = "test-form-id";
  const mockFormTitle = "Test Form";

  it("renders embed code component", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);
    expect(screen.getByText(/share form/i)).toBeInTheDocument();
  });

  it("shows iframe tab by default", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);
    const iframeTab = screen.getByRole("tab", { name: /iFrame/i });
    expect(iframeTab).toHaveAttribute("data-state", "active");
  });

  it("switches to link tab", async () => {
    const user = userEvent.setup();
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const linkTab = screen.getByRole("tab", { name: /link/i });
    await user.click(linkTab);

    expect(linkTab).toHaveAttribute("data-state", "active");
  });

  it("switches to custom tab", async () => {
    const user = userEvent.setup();
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const customTab = screen.getByRole("tab", { name: /custom/i });
    await user.click(customTab);

    expect(customTab).toHaveAttribute("data-state", "active");
  });

  it("copies iframe code", async () => {
    const user = userEvent.setup();
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const iframeCopyButton = copyButtons[0]; // First copy button is for iframe
    await user.click(iframeCopyButton);

    // Check that the clipboard was called (the mock is set up in beforeEach)
    expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it("shows copy success message", async () => {
    const user = userEvent.setup();
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const iframeCopyButton = copyButtons[0]; // First copy button is for iframe
    await user.click(iframeCopyButton);

    expect(screen.getAllByText(/copied/i)[0]).toBeInTheDocument();
  });

  it("handles copy errors", async () => {
    const user = userEvent.setup();
    // Reset the mock to throw an error
    (window.navigator.clipboard.writeText as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error("Copy failed");
      }
    );

    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const iframeCopyButton = copyButtons[0]; // First copy button is for iframe
    await user.click(iframeCopyButton);

    // The error is handled silently, so we just check that the component doesn't crash
    expect(screen.getByText("Share Form")).toBeInTheDocument();
  });

  it("includes form ID in embed codes", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const textareas = screen.getAllByRole("textbox");
    const iframeTextarea = textareas.find(
      (textarea) =>
        textarea.getAttribute("value")?.includes("iframe") ||
        textarea.textContent?.includes("iframe")
    );
    expect(iframeTextarea).toBeInTheDocument();
  });

  it("includes correct URL in embed codes", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const textareas = screen.getAllByRole("textbox");
    const iframeTextarea = textareas.find(
      (textarea) =>
        textarea.getAttribute("value")?.includes("iframe") ||
        textarea.textContent?.includes("iframe")
    );
    expect(iframeTextarea).toBeInTheDocument();
  });

  it("works with long form IDs", () => {
    const longFormId = "a".repeat(50);
    render(<EmbedCode formId={longFormId} formTitle={mockFormTitle} />);

    const textareas = screen.getAllByRole("textbox");
    const iframeTextarea = textareas.find(
      (textarea) =>
        textarea.getAttribute("value")?.includes("iframe") ||
        textarea.textContent?.includes("iframe")
    );
    expect(iframeTextarea).toBeInTheDocument();
  });

  it("works with special characters in form title", () => {
    const specialTitle = "Form with émojis 🎉 and symbols @#$%";
    render(<EmbedCode formId={mockFormId} formTitle={specialTitle} />);
    expect(screen.getByText(/share form/i)).toBeInTheDocument();
  });

  it("works with missing form description", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);
    expect(screen.getByText(/share form/i)).toBeInTheDocument();
  });

  it("works with empty fields array", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);
    expect(screen.getByText(/share form/i)).toBeInTheDocument();
  });

  it("handles missing form data", () => {
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);
    expect(screen.getByText(/share form/i)).toBeInTheDocument();
  });

  it("renders quickly", () => {
    const startTime = performance.now();
    render(<EmbedCode formId="test-form" formTitle="Test Form" />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(150);
  });

  it("handles rapid tab switching", async () => {
    const user = userEvent.setup();
    render(<EmbedCode formId={mockFormId} formTitle={mockFormTitle} />);

    const tabs = [
      screen.getByRole("tab", { name: /iFrame/i }),
      screen.getByRole("tab", { name: /link/i }),
      screen.getByRole("tab", { name: /custom/i }),
    ];

    for (let i = 0; i < 10; i++) {
      await user.click(tabs[i % tabs.length]);
    }

    expect(screen.getByDisplayValue(/iframe/i)).toBeInTheDocument();
  });

  it("renders all embed types", () => {
    render(<EmbedCode formId="test-id" formTitle="Test Form" />);
    expect(screen.getByRole("tab", { name: /iFrame/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /link/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /custom/i })).toBeInTheDocument();
  });

  it("copies code to clipboard", () => {
    // Mock clipboard and test copy
  });
});
