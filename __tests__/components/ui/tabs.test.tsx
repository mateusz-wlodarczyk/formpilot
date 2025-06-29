import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import userEvent from "@testing-library/user-event";

describe("Tabs Components", () => {
  describe("Tabs", () => {
    it("renders tabs with children", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <Tabs defaultValue="tab1" className="custom-tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const tabs = screen.getByRole("tablist").closest('[data-slot="tabs"]');
      expect(tabs).toHaveClass("custom-tabs");
    });

    it("passes through additional props", () => {
      render(
        <Tabs defaultValue="tab1" data-testid="test-tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId("test-tabs")).toBeInTheDocument();
    });
  });

  describe("TabsList", () => {
    it("renders tabs list with children", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      const list = screen.getByRole("tablist");
      expect(list).toHaveClass("custom-list");
    });

    it("has proper ARIA role", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });
  });

  describe("TabsTrigger", () => {
    it("renders tab trigger with text", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
    });

    it("renders as button element", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      const trigger = screen.getByRole("tab");
      expect(trigger.tagName).toBe("BUTTON");
    });

    it("renders with custom className", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      const trigger = screen.getByRole("tab");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("handles click events", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole("tab", { name: "Tab 2" });
      await user.click(tab2);

      await waitFor(() => {
        expect(tab2).toHaveAttribute("aria-selected", "true");
      });
    });

    it("has proper ARIA attributes", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      const trigger = screen.getByRole("tab");
      expect(trigger).toHaveAttribute("role", "tab");
      expect(trigger).toHaveAttribute("aria-selected");
    });
  });

  describe("TabsContent", () => {
    it("renders tab content with text", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content 1
          </TabsContent>
        </Tabs>
      );
      const content = screen.getByText("Content 1").closest("div");
      expect(content).toHaveClass("custom-content");
    });

    it("has proper ARIA attributes", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const content = screen.getByText("Content 1").closest("div");
      expect(content).toHaveAttribute("role", "tabpanel");
    });
  });

  describe("Tab Switching", () => {
    it("switches between tabs on click", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Initially tab1 should be active
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      // Click tab2
      await user.click(screen.getByRole("tab", { name: "Tab 2" }));

      // Now tab2 should be active
      await waitFor(() => {
        expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
          "aria-selected",
          "true"
        );
        expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });

    it("handles keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      const tab2 = screen.getByRole("tab", { name: "Tab 2" });

      // Focus first tab
      await user.click(tab1);
      expect(tab1).toHaveFocus();

      // Arrow right should focus next tab
      await user.keyboard("{ArrowRight}");
      expect(tab2).toHaveFocus();

      // Arrow left should focus previous tab
      await user.keyboard("{ArrowLeft}");
      expect(tab1).toHaveFocus();
    });

    it("handles Enter and Space keys", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole("tab", { name: "Tab 2" });

      // Enter key should activate tab
      fireEvent.keyDown(tab2, { key: "Enter" });
      expect(tab2).toHaveAttribute("aria-selected", "true");

      // Space key should also activate tab
      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      fireEvent.keyDown(tab1, { key: " " });
      expect(tab1).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA structure", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tablist = screen.getByRole("tablist");
      const tabs = screen.getAllByRole("tab");
      const panels = screen.getAllByRole("tabpanel");

      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(2);
      // Check that at least one panel is rendered
      expect(panels.length).toBeGreaterThan(0);

      // Check ARIA associations for the first tab and panel
      if (panels.length > 0) {
        const tab = tabs[0];
        const panel = panels[0];
        expect(tab).toHaveAttribute("aria-controls", panel.id);
        expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      }
    });

    it("announces tab changes to screen readers", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole("tab", { name: "Tab 2" });
      await user.click(tab2);

      // Check that the tab change was successful
      await waitFor(() => {
        expect(tab2).toHaveAttribute("aria-selected", "true");
      });
    });

    it("supports focus management", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      expect(tab1).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty tabs", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList></TabsList>
        </Tabs>
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();
    });

    it("handles tabs with no content", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      const tab = screen.getByRole("tab");
      expect(tab).toBeInTheDocument();
    });

    it("handles very long tab labels", () => {
      const longLabel = "A".repeat(1000);
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">{longLabel}</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("handles special characters in tab labels", () => {
      const specialLabel = "Tab with émojis 🎉 and symbols @#$%";
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">{specialLabel}</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it("handles many tabs efficiently", () => {
      const startTime = performance.now();
      render(
        <Tabs defaultValue="tab0">
          <TabsList>
            {Array.from({ length: 100 }, (_, i) => (
              <TabsTrigger
                key={i}
                value={`tab${i}`}
              >{`Tab ${i + 1}`}</TabsTrigger>
            ))}
          </TabsList>
          {Array.from({ length: 100 }, (_, i) => (
            <TabsContent
              key={i}
              value={`tab${i}`}
            >{`Content ${i + 1}`}</TabsContent>
          ))}
        </Tabs>
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1300); // Should render in under 1.3 seconds
    });
  });

  describe("Performance", () => {
    it("renders efficiently", () => {
      const startTime = performance.now();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(60); // Should render quickly
    });

    it("handles rapid tab switching efficiently", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      const tab2 = screen.getByRole("tab", { name: "Tab 2" });

      // Rapid switching
      for (let i = 0; i < 50; i++) {
        fireEvent.click(i % 2 === 0 ? tab1 : tab2);
      }

      // Should not crash or slow down
      expect(tab1).toBeInTheDocument();
      expect(tab2).toBeInTheDocument();
    });
  });
});
