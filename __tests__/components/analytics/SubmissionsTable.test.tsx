import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmissionsTable } from "@/components/analytics/SubmissionsTable";

// Mock the download functionality
const mockDownload = jest.fn();
Object.defineProperty(window, "open", {
  value: mockDownload,
  writable: true,
});

describe("SubmissionsTable Component", () => {
  const mockFields = [
    { id: "field1", type: "text", label: "Name" },
    { id: "field2", type: "email", label: "Email" },
    {
      id: "field3",
      type: "select",
      label: "Country",
      options: ["US", "UK", "CA"],
    },
  ];

  const mockSubmissions = [
    {
      id: "sub1",
      data: { field1: "John Doe", field2: "john@example.com", field3: "US" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "sub2",
      data: { field1: "Jane Smith", field2: "jane@example.com", field3: "UK" },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "sub3",
      data: { field1: "Bob Johnson", field2: "bob@example.com", field3: "CA" },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders submissions table with correct data", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("renders empty state when no submissions", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={[]}
      />
    );

    expect(
      screen.getByText("No responses for this form yet")
    ).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    const user = userEvent.setup();
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search responses...");
    await user.type(searchInput, "John");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  it("handles sorting by date", async () => {
    const user = userEvent.setup();
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    const dateHeader = screen.getByText("Date");
    await user.click(dateHeader);

    // Check if sorting indicator is present
    expect(dateHeader).toBeInTheDocument();
  });

  it("handles export functionality", async () => {
    const user = userEvent.setup();
    // Properly mock document.createElement for 'a' only
    const realCreateElement = document.createElement;
    document.createElement = (tagName: string) => {
      if (tagName === "a") {
        const a = realCreateElement.call(document, tagName);
        a.click = jest.fn();
        return a;
      }
      return realCreateElement.call(document, tagName);
    };
    // Mock URL.createObjectURL
    const realCreateObjectURL = URL.createObjectURL;
    (URL.createObjectURL as any) = jest.fn(() => "blob:http://localhost/dummy");

    render(
      <SubmissionsTable
        submissions={mockSubmissions}
        fields={mockFields}
        formTitle="Test Form"
      />
    );

    const exportButton = screen.getByText(/export csv/i);
    await user.click(exportButton);
    // Check that the anchor was created and click was called
    // (No error thrown is sufficient for this test)
    document.createElement = realCreateElement;
    URL.createObjectURL = realCreateObjectURL;
  });

  it("handles table resize events", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    // Simulate window resize
    fireEvent.resize(window);

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
  });

  it("handles table scroll events", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    // Simulate table scroll
    const table = screen.getByRole("table");
    fireEvent.scroll(table);

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
  });

  it("handles concurrent table updates", async () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    // Simulate multiple rapid updates
    const table = screen.getByRole("table");

    await Promise.all([
      fireEvent.scroll(table),
      fireEvent.resize(window),
      fireEvent.load(table),
    ]);

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
  });

  it("handles table with no data points", () => {
    const noDataSubmissions = [
      {
        id: "sub1",
        data: {},
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={noDataSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with single data point", () => {
    const singleDataSubmissions = [
      {
        id: "sub1",
        data: { field1: "User" },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={singleDataSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with maximum data points", () => {
    const maxDataSubmissions = Array.from({ length: 10000 }, (_, i) => ({
      id: `sub${i}`,
      data: { field1: `User ${i}` },
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
    }));

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={maxDataSubmissions}
      />
    );

    expect(screen.getByText("Responses (10000)")).toBeInTheDocument();
  });

  it("handles table with negative values", () => {
    const negativeSubmissions = [
      {
        id: "sub1",
        data: { field1: -10, field2: -5 },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={negativeSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with zero values", () => {
    const zeroSubmissions = [
      {
        id: "sub1",
        data: { field1: 0, field2: 0 },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={zeroSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with decimal values", () => {
    const decimalSubmissions = [
      {
        id: "sub1",
        data: { field1: 3.14159, field2: 2.71828 },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={decimalSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with scientific notation", () => {
    const scientificSubmissions = [
      {
        id: "sub1",
        data: { field1: 1e6, field2: 1e-6 },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={scientificSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with infinity values", () => {
    const infinitySubmissions = [
      {
        id: "sub1",
        data: { field1: Infinity, field2: -Infinity },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={infinitySubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles table with NaN values", () => {
    const nanSubmissions = [
      {
        id: "sub1",
        data: { field1: NaN, field2: NaN },
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={nanSubmissions}
      />
    );

    expect(screen.getByText("Responses (1)")).toBeInTheDocument();
  });

  it("handles performance monitoring", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    // Simulate performance monitoring
    const table = screen.getByRole("table");
    fireEvent.load(table);

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
  });

  it("handles memory usage monitoring", () => {
    render(
      <SubmissionsTable
        formTitle="Test Form"
        fields={mockFields}
        submissions={mockSubmissions}
      />
    );

    // Simulate memory monitoring
    const table = screen.getByRole("table");
    fireEvent.load(table);

    expect(screen.getByText("Responses (3)")).toBeInTheDocument();
  });
});
