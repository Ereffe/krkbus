import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

interface ApiReport {
  reportID: number;
  title: string;
  content: string;
  generatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

export function ReportsBlock() {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiReport[]>(
        `${API_BASE_URL}/api/worker/reports`,
      );
      setReports(data ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać raportów.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Przeglądaj Raporty
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Tytuł
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Wygenerowano
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Podgląd
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow
                  key={report.reportID}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {report.title}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {new Date(report.generatedAt).toLocaleDateString("pl-PL")}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {report.content.length > 80
                      ? `${report.content.slice(0, 80)}...`
                      : report.content}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Pobierz
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && reports.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    Brak raportów do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
