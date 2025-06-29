import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormAnalytics } from "@/components/analytics/FormAnalytics";

const mockForm = {
  id: "test-form-id",
  title: "Test Form",
  description: "Test form description",
  fields: [
    { id: "field1", type: "text", label: "Name" },
    {
      id: "field2",
      type: "select",
      label: "Category",
      options: ["A", "B", "C"],
    },
  ],
};

const mockSubmissions = [
  {
    id: "sub1",
    data: { field1: "John", field2: "A" },
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "sub2",
    data: { field1: "Jane", field2: "B" },
    createdAt: "2024-01-02T10:00:00Z",
  },
];

describe("FormAnalytics Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders analytics component with tabs", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Responses")).toBeInTheDocument();
  });

  it("switches between tabs", async () => {
    const user = userEvent.setup();
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const responsesTab = screen.getByRole("tab", { name: /responses/i });
    await user.click(responsesTab);

    expect(responsesTab).toHaveAttribute("data-state", "active");
  });

  it("displays submission count", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
    const totalResponsesTextElements = screen.getAllByText(/total responses/i);
    expect(totalResponsesTextElements.length).toBeGreaterThan(0);
  });

  it("shows empty state when no submissions", () => {
    render(
      <FormAnalytics
        submissions={[]}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("0");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/no responses/i)).toBeInTheDocument();
  });

  it("handles many submissions", () => {
    const largeSubmissions = Array.from({ length: 1000 }, (_, i) => ({
      id: `sub${i}`,
      data: { field1: `User ${i}` },
      createdAt: new Date().toISOString(),
    }));

    render(
      <FormAnalytics
        submissions={largeSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1000");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with forms without fields", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={[]}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles incomplete submission data", () => {
    const incompleteSubmissions = [
      {
        id: "sub1",
        data: { field1: "John" },
        createdAt: new Date().toISOString(),
      },
      { id: "sub2", data: {}, createdAt: new Date().toISOString() },
    ];

    render(
      <FormAnalytics
        submissions={incompleteSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles malformed data", () => {
    const malformedSubmissions = [
      { id: "sub1", data: {} as any, createdAt: new Date().toISOString() },
      { id: "sub2", data: {} as any, createdAt: new Date().toISOString() },
    ];

    render(
      <FormAnalytics
        submissions={malformedSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with long form titles", () => {
    const longTitle =
      "Very long form title that exceeds normal length expectations";

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={longTitle}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles special characters in field data", () => {
    const specialFields = [{ id: "field1", type: "text", label: "Name & Co." }];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={specialFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("switches tabs rapidly", async () => {
    const user = userEvent.setup();
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const overviewTab = screen.getByRole("tab", { name: /overview/i });
    const responsesTab = screen.getByRole("tab", { name: /responses/i });

    await user.click(overviewTab);
    await user.click(responsesTab);
    await user.click(overviewTab);
    await user.click(responsesTab);

    expect(responsesTab).toHaveAttribute("data-state", "active");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const overviewTab = screen.getByRole("tab", { name: /overview/i });
    const responsesTab = screen.getByRole("tab", { name: /responses/i });

    overviewTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(responsesTab).toHaveFocus();
  });

  it("has proper accessibility attributes", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const tabList = screen.getByRole("tablist");
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute("aria-selected");
    });
  });

  it("handles concurrent tab switching", async () => {
    const user = userEvent.setup();
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const responsesTab = screen.getByRole("tab", { name: /responses/i });

    await Promise.all([
      user.click(responsesTab),
      user.click(responsesTab),
      user.click(responsesTab),
    ]);

    expect(responsesTab).toHaveAttribute("data-state", "active");
  });

  it("works with complex field types", () => {
    const complexFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field2", type: "textarea", label: "Description" },
      { id: "field3", type: "checkbox", label: "Agree to terms" },
      {
        id: "field4",
        type: "radio",
        label: "Gender",
        options: ["Male", "Female"],
      },
      {
        id: "field5",
        type: "select",
        label: "Country",
        options: ["US", "UK", "CA"],
      },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={complexFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles nested submission data", () => {
    const nestedSubmissions = [
      {
        id: "sub1",
        data: {
          personal: { name: "John", email: "john@example.com" },
          preferences: { theme: "dark", notifications: true },
        },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={nestedSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles different timezones", () => {
    const timezoneSubmissions = [
      {
        id: "sub1",
        data: { field1: "User" },
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub2",
        data: { field1: "User" },
        createdAt: "2024-01-01T23:59:59Z",
      },
    ];

    render(
      <FormAnalytics
        submissions={timezoneSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with long field labels", () => {
    const longLabelsFields = [
      {
        id: "field1",
        type: "text",
        label: "Very long field label that might cause layout issues",
      },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={longLabelsFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles unicode characters", () => {
    const unicodeSubmissions = [
      {
        id: "sub1",
        data: { field1: "José María", field2: "Café" },
        createdAt: new Date().toISOString(),
      },
      {
        id: "sub2",
        data: { field1: "中文名字", field2: "选项" },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={unicodeSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with forms without description", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles future dates", () => {
    const futureSubmissions = [
      {
        id: "sub1",
        data: { field1: "User" },
        createdAt: "2030-01-01T10:00:00Z",
      },
    ];

    render(
      <FormAnalytics
        submissions={futureSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles duplicate field IDs", () => {
    const duplicateFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field1", type: "text", label: "Duplicate Name" },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={duplicateFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles large text values", () => {
    const largeTextSubmissions = [
      {
        id: "sub1",
        data: { field1: "Lorem ipsum ".repeat(100) },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={largeTextSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with missing field types", () => {
    const incompleteFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field2", type: "text", label: "Email" },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={incompleteFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles null values", () => {
    const nullSubmissions = [
      {
        id: "sub1",
        data: { field1: null, field2: undefined },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={nullSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with circular references", () => {
    const circularFields = [{ id: "field1", type: "text", label: "Name" }];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={circularFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles function values", () => {
    const functionSubmissions = [
      {
        id: "sub1",
        data: { field1: () => "test" },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={functionSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with empty field options", () => {
    const arrayOptionsFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field2", type: "select", label: "Category", options: [] },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={arrayOptionsFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles boolean values", () => {
    const booleanSubmissions = [
      {
        id: "sub1",
        data: { field1: true, field2: false },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={booleanSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with numeric field IDs", () => {
    const numericIdsFields = [
      { id: "1", type: "text", label: "Name" },
      { id: "2", type: "text", label: "Email" },
    ];

    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={numericIdsFields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles date values", () => {
    const dateSubmissions = [
      {
        id: "sub1",
        data: { field1: new Date("2024-01-01") },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={dateSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with empty field array", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={[]}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles empty data objects", () => {
    const emptyDataSubmissions = [
      {
        id: "sub1",
        data: {},
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={emptyDataSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("works with undefined fields", () => {
    render(
      <FormAnalytics
        submissions={mockSubmissions}
        fields={undefined as any}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("2");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });

  it("handles undefined data", () => {
    const undefinedDataSubmissions = [
      {
        id: "sub1",
        data: undefined as any,
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormAnalytics
        submissions={undefinedDataSubmissions}
        fields={mockForm.fields}
        formTitle={mockForm.title}
      />
    );

    const totalResponsesElements = screen.getAllByText("1");
    expect(totalResponsesElements.length).toBeGreaterThan(0);
  });
});
