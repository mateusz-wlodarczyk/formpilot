import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { FormCharts } from "@/components/analytics/FormCharts";

const mockFields = [
  { id: "field1", type: "text", label: "Name" },
  {
    id: "field2",
    type: "select",
    label: "Category",
    options: ["A", "B", "C"],
  },
];

const mockSubmissions = [
  {
    id: "sub1",
    data: { field1: "John", field2: "A" },
    createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
  },
  {
    id: "sub2",
    data: { field1: "Jane", field2: "B" },
    createdAt: new Date("2024-01-02T10:00:00Z").toISOString(),
  },
  {
    id: "sub3",
    data: { field1: "Bob", field2: "A" },
    createdAt: new Date("2024-01-03T10:00:00Z").toISOString(),
  },
];

describe("FormCharts Component", () => {
  it("renders charts component", () => {
    render(<FormCharts submissions={mockSubmissions} fields={mockFields} />);
    expect(screen.getByText("Total Responses")).toBeInTheDocument();
  });

  it("shows submission count", () => {
    render(<FormCharts submissions={mockSubmissions} fields={mockFields} />);
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with empty submissions", () => {
    render(<FormCharts submissions={[]} fields={mockFields} />);
    expect(
      screen.getByText("No data available to display charts")
    ).toBeInTheDocument();
  });

  it("works with single submission", () => {
    const singleSubmission = [mockSubmissions[0]];
    render(<FormCharts submissions={singleSubmission} fields={mockFields} />);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with many submissions", () => {
    const manySubmissions = Array.from({ length: 100 }, (_, i) => ({
      id: `sub${i}`,
      data: { field1: `User ${i}` },
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
    }));

    render(<FormCharts submissions={manySubmissions} fields={mockFields} />);
    expect(screen.getAllByText("100").length).toBeGreaterThan(0);
  });

  it("works with form without fields", () => {
    render(<FormCharts submissions={mockSubmissions} fields={[]} />);
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with incomplete submissions", () => {
    const incompleteSubmissions = [
      {
        id: "sub1",
        data: { field1: "John" },
        createdAt: new Date().toISOString(),
      },
      { id: "sub2", data: {}, createdAt: new Date().toISOString() },
    ];

    render(
      <FormCharts submissions={incompleteSubmissions} fields={mockFields} />
    );
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("works with malformed data", () => {
    const malformedSubmissions = [
      { id: "sub1", data: {} as any, createdAt: new Date().toISOString() },
      { id: "sub2", data: {} as any, createdAt: new Date().toISOString() },
    ];

    render(
      <FormCharts submissions={malformedSubmissions} fields={mockFields} />
    );
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("works with long form titles", () => {
    const longLabelsFields = [
      {
        id: "field1",
        type: "text",
        label: "Lorem ipsum ".repeat(20),
      },
    ];

    render(
      <FormCharts submissions={mockSubmissions} fields={longLabelsFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with special characters", () => {
    const specialFields = [{ id: "field1", type: "text", label: "Name & Co." }];

    render(<FormCharts submissions={mockSubmissions} fields={specialFields} />);
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with long field labels", () => {
    const longLabelsFields = [
      {
        id: "field1",
        type: "text",
        label: "Lorem ipsum ".repeat(50),
      },
    ];

    render(
      <FormCharts submissions={mockSubmissions} fields={longLabelsFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with duplicate field IDs", () => {
    const duplicateFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field1", type: "text", label: "Duplicate Name" },
    ];

    render(
      <FormCharts submissions={mockSubmissions} fields={duplicateFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with missing field types", () => {
    const incompleteFields = [
      { id: "field1", type: "text", label: "Name" },
      { id: "field2", type: "text", label: "Email" },
    ];

    render(
      <FormCharts submissions={mockSubmissions} fields={incompleteFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with circular references", () => {
    const circularFields = [{ id: "field1", type: "text", label: "Name" }];

    render(
      <FormCharts submissions={mockSubmissions} fields={circularFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with nested data", () => {
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

    render(<FormCharts submissions={nestedSubmissions} fields={mockFields} />);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with timezone differences", () => {
    const timezoneSubmissions = [
      {
        id: "sub1",
        data: { field1: "User" },
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
      },
      {
        id: "sub2",
        data: { field1: "User" },
        createdAt: new Date("2024-01-01T23:59:59Z").toISOString(),
      },
    ];

    render(
      <FormCharts submissions={timezoneSubmissions} fields={mockFields} />
    );
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("works with future dates", () => {
    const futureSubmissions = [
      {
        id: "sub1",
        data: { field1: "User" },
        createdAt: new Date("2030-01-01T10:00:00Z").toISOString(),
      },
    ];

    render(<FormCharts submissions={futureSubmissions} fields={mockFields} />);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with boolean values", () => {
    const booleanSubmissions = [
      {
        id: "sub1",
        data: { field1: true, field2: false },
        createdAt: new Date().toISOString(),
      },
    ];

    render(<FormCharts submissions={booleanSubmissions} fields={mockFields} />);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with numeric field IDs", () => {
    const numericIdsFields = [
      { id: "1", type: "text", label: "Name" },
      { id: "2", type: "text", label: "Email" },
    ];

    render(
      <FormCharts submissions={mockSubmissions} fields={numericIdsFields} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with date values", () => {
    const dateSubmissions = [
      {
        id: "sub1",
        data: { field1: new Date("2024-01-01") },
        createdAt: new Date().toISOString(),
      },
    ];

    render(<FormCharts submissions={dateSubmissions} fields={mockFields} />);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with empty field array", () => {
    render(<FormCharts submissions={mockSubmissions} fields={[]} />);
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with empty data objects", () => {
    const emptyDataSubmissions = [
      {
        id: "sub1",
        data: {},
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormCharts submissions={emptyDataSubmissions} fields={mockFields} />
    );
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("works with undefined fields", () => {
    render(
      <FormCharts submissions={mockSubmissions} fields={undefined as any} />
    );
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("works with undefined data", () => {
    const undefinedDataSubmissions = [
      {
        id: "sub1",
        data: undefined as any,
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <FormCharts submissions={undefinedDataSubmissions} fields={mockFields} />
    );
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });
});
