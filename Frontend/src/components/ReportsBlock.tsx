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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useT } from "@/i18n";

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
  const t = useT();

  const [reports, setReports] = useState<ApiReport[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiReport[]>(
        `${API_BASE_URL}/api/reports`,
      );
      setReports(data ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("app.secretary.reportsBlock.fetchError");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleGenerateReport = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const createdReport = await fetchJson<ApiReport>(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          generatedAt: new Date().toISOString(),
        }),
      });

      setReports((prev) => [...prev, createdReport]);
      setNewTitle("");
      setNewContent("");
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("app.secretary.reportsBlock.generateError");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (report: ApiReport) => {
    const fileContent = `${t("app.secretary.reportsBlock.txtTitle")} ${report.title}\n${t("app.secretary.reportsBlock.txtGenerated")} ${new Date(report.generatedAt).toLocaleString("pl-PL")}\n\n${t("app.secretary.reportsBlock.txtContent")}\n${report.content}`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `raport_${report.reportID || "nowy"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6 flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          {t("app.secretary.reportsBlock.title")}
        </CardTitle>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("app.secretary.reportsBlock.generateReportBtn")}
        </Button>
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
                  {t("app.secretary.reportsBlock.tableTitle")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reportsBlock.tableGenerated")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reportsBlock.tablePreview")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reportsBlock.tableActions")}
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
                      onClick={() => handleDownloadReport(report)}
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {t("app.secretary.reportsBlock.downloadBtn")}
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
                    {t("app.secretary.reportsBlock.noReports")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {t("app.secretary.reportsBlock.modalTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("app.secretary.reportsBlock.labelTitle")}
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t("app.secretary.reportsBlock.placeholderTitle")}
                className="w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("app.secretary.reportsBlock.labelContent")}
              </label>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                placeholder={t("app.secretary.reportsBlock.placeholderContent")}
                className="w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setNewTitle("");
                setNewContent("");
                setIsDialogOpen(false);
              }}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isLoading || !newTitle.trim() || !newContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("app.common.generating") : t("common.generate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
