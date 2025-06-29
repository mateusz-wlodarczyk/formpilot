import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

describe("Table Components", () => {
  it("renders basic table", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("renders table with header", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("renders table with caption", () => {
    render(
      <Table>
        <TableCaption>Table description</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Table description")).toBeInTheDocument();
  });

  it("renders complex table structure", () => {
    render(
      <Table>
        <TableCaption>User data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("custom-table");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("handles empty table", () => {
    render(
      <Table>
        <TableBody></TableBody>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("handles long content", () => {
    const longContent =
      "This is a very long content that should be handled properly by the table component";
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{longContent}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("handles special characters", () => {
    const specialContent = "Content with émojis 🎉 and symbols @#$%";
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{specialContent}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });

  it("handles many rows", () => {
    const manyRows = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }));

    const startTime = performance.now();
    render(
      <Table>
        <TableBody>
          {manyRows.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000);
  });

  it("renders quickly", () => {
    const startTime = performance.now();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(10);
  });
});
