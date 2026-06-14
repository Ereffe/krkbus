import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useState } from "react";
import { fetchJson } from "@/lib/api";

type Aggregation = "MONTH" | "YEAR";

interface ReservationReportRequest {
    startDate: string; // yyyy-mm-dd
    endDate: string; // yyyy-mm-dd
    aggregation: Aggregation;
}

interface ReservationReportResponse {
    periodLabel: string;
    reservationsCount: number;
    seatsSold: number;
    revenue: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function formatMoneyPLN(value: number) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(value);
}

export function ReservationReportsBlock() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [aggregation, setAggregation] = useState<Aggregation>("MONTH");

    const [rows, setRows] = useState<ReservationReportResponse[]>([]);

    const buildRequest = (): ReservationReportRequest => {
        if (!startDate || !endDate) {
            throw new Error("Wybierz zakres dat");
        }

        return {
            startDate,
            endDate,
            aggregation,
        };
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const req = buildRequest();
            const data = await fetchJson<ReservationReportResponse[]>(
                "/api/owner/secretary/reports/reservations/generate",
                {
                    method: "POST",
                    body: JSON.stringify(req),
                },
            );
            setRows(data ?? []);
            setIsDialogOpen(false);
        } catch (e) {
            setErrorMessage(e instanceof Error ? e.message : "Błąd generowania raportu");
        } finally {
            setIsLoading(false);
        }
    }, [aggregation, endDate, startDate]);

    const handleExportCsv = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const req = buildRequest();

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/api/owner/secretary/reports/reservations/export/csv`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(req),
                },
            );

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Błąd eksportu CSV");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `raport_rezerwacje_${aggregation}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (e) {
            setErrorMessage(e instanceof Error ? e.message : "Błąd eksportu CSV");
        } finally {
            setIsLoading(false);
        }
    }, [aggregation, endDate, startDate]);

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                    Raporty z rezerwacji
                </CardTitle>
                <div className="flex gap-2">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                        onClick={() => setIsDialogOpen(true)}
                        disabled={isLoading}
                    >
                        Generuj
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={isLoading || rows.length === 0}
                        className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        Eksport CSV
                    </Button>
                </div>
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
                                    Okres
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Liczba rezerwacji
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Liczba sprzedanych miejsc
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Przychód
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((r) => (
                                <TableRow
                                    key={r.periodLabel}
                                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                                >
                                    <TableCell className="py-4 font-semibold text-gray-900 dark:text-white">
                                        {r.periodLabel}
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-700 dark:text-gray-200">
                                        {r.reservationsCount}
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-700 dark:text-gray-200">
                                        {r.seatsSold}
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-700 dark:text-gray-200">
                                        {formatMoneyPLN(r.revenue ?? 0)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!isLoading && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                                        Brak wyników. Wygeneruj raport.
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
                            Wygeneruj raport
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Od (data)
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Do (data)
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Agregacja
                            </label>
                            <Select value={aggregation} onValueChange={(v) => setAggregation(v as Aggregation)}>
                                <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
                                    <SelectValue placeholder="Wybierz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MONTH">Miesięczna</SelectItem>
                                    <SelectItem value="YEAR">Roczna</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t dark:border-slate-700">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                        >
                            Anuluj
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !startDate || !endDate}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Generowanie..." : "Generuj"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

