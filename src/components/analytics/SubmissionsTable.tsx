"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  Calendar,
  User,
} from "lucide-react";

interface Submission {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  fields?: FormField[];
  formTitle: string;
}

type SortField = "createdAt" | string;
type SortDirection = "asc" | "desc";

export function SubmissionsTable({
  submissions,
  fields = [],
  formTitle,
}: SubmissionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Debounce search input for better performance
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const filteredAndSortedSubmissions = useMemo(() => {
    const filtered = submissions.filter((submission) => {
      if (!debouncedSearchTerm) return true;
      const searchLower = debouncedSearchTerm.toLowerCase();
      const dataString = JSON.stringify(submission.data).toLowerCase();
      const dateString = new Date(submission.createdAt)
        .toLocaleString("en-US")
        .toLowerCase();
      return (
        dataString.includes(searchLower) || dateString.includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      const aValue =
        sortField === "createdAt"
          ? new Date(a.createdAt).getTime()
          : String(a.data[sortField] || "").toLowerCase();
      const bValue =
        sortField === "createdAt"
          ? new Date(b.createdAt).getTime()
          : String(b.data[sortField] || "").toLowerCase();

      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  }, [submissions, debouncedSearchTerm, sortField, sortDirection]);

  const handleSort = useCallback(
    (field: SortField) => {
      setSortField(field);
      setSortDirection(
        sortField === field && sortDirection === "asc" ? "desc" : "asc"
      );
    },
    [sortField, sortDirection]
  );

  const exportToCSV = useCallback(() => {
    if (filteredAndSortedSubmissions.length === 0) return;

    const headers = ["Date", "Response ID", ...fields.map((f) => f.label)];
    const csvData = filteredAndSortedSubmissions.map((submission) => [
      new Date(submission.createdAt).toLocaleString("en-US"),
      submission.id,
      ...fields.map((field) => {
        const value = submission.data[field.id];
        return Array.isArray(value) ? value.join(", ") : value || "";
      }),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",")
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formTitle}_responses_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [filteredAndSortedSubmissions, fields, formTitle]);

  const getSortIcon = useCallback(
    (field: SortField) =>
      sortField === field &&
      (sortDirection === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )),
    [sortField, sortDirection]
  );

  const formatValue = useCallback((value: any) => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value || "-";
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  if (filteredAndSortedSubmissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Responses ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {searchTerm
                ? "No responses found matching your search"
                : "No responses for this form yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Responses ({filteredAndSortedSubmissions.length})
          </CardTitle>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search responses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                    {getSortIcon("createdAt")}
                  </div>
                </TableHead>
                {fields.map((field) => (
                  <TableHead
                    key={field.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort(field.id)}
                  >
                    <div className="flex items-center gap-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                      {getSortIcon(field.id)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(submission.createdAt).toLocaleString("en-US")}
                  </TableCell>
                  {fields.map((field) => (
                    <TableCell key={field.id} className="max-w-xs">
                      <div
                        className="truncate"
                        title={String(formatValue(submission.data[field.id]))}
                      >
                        {formatValue(submission.data[field.id])}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
