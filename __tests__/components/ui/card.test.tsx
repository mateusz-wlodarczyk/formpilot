import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card Components", () => {
  it("renders card with content", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders card header", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
  });

  it("renders card content", () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders card footer", () => {
    render(
      <Card>
        <CardFooter>Card footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Card footer")).toBeInTheDocument();
  });

  it("renders complete card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-card">Custom</Card>);
    const card = screen.getByText("Custom").closest("div");
    expect(card).toHaveClass("custom-card");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("handles empty children", () => {
    render(<Card></Card>);
    const cards = screen.getAllByRole("generic");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("handles null children", () => {
    render(<Card>{null}</Card>);
    const cards = screen.getAllByRole("generic");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("handles long content", () => {
    const longContent =
      "This is a very long content that should be handled properly by the card component";
    render(<CardContent>{longContent}</CardContent>);
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it("handles special characters", () => {
    const specialContent = "Content with émojis 🎉 and symbols @#$%";
    render(<CardContent>{specialContent}</CardContent>);
    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });

  it("renders quickly", () => {
    const startTime = performance.now();
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(10);
  });

  it("handles many cards", () => {
    const startTime = performance.now();
    render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Card {i + 1}</CardTitle>
              <CardDescription>Description for card {i + 1}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content for card {i + 1}</p>
            </CardContent>
            <CardFooter>
              <p>Footer for card {i + 1}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(200);
  });
});
