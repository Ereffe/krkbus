import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { Plus, BusFront } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ApiVehicle {
    vehicleID: number;
    name: string;
    registrationNumber: string;
}

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed (${response.status})`);
    }
    if (response.status === 204) return null as T;
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (null as T);
};

export function VehiclesBlock() {
    const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [draft, setDraft] = useState({ name: "", registrationNumber: "" });

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchJson<ApiVehicle[]>(`${API_BASE_URL}/api/vehicles`);
            setVehicles(data ?? []);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Błąd pobierania pojazdów.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async () => {
        if (!draft.name || !draft.registrationNumber) return;
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await fetchJson(`${API_BASE_URL}/api/vehicles`, {
                method: "POST",
                body: JSON.stringify(draft),
            });
            setIsDialogOpen(false);
            setDraft({ name: "", registrationNumber: "" });
            await load();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Błąd dodawania pojazdu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold flex items-center gap-2">
                    <BusFront className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Zarządzaj Pojazdami
                </CardTitle>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Dodaj Pojazd
                </Button>
            </CardHeader>
            <CardContent className="pt-6">
                {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b dark:border-slate-700">
                                <TableHead className="text-gray-900 dark:text-white">ID</TableHead>
                                <TableHead className="text-gray-900 dark:text-white">Nazwa</TableHead>
                                <TableHead className="text-gray-900 dark:text-white">Numer Rejestracyjny</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map(v => (
                                <TableRow key={v.vehicleID} className="border-b dark:border-slate-700">
                                    <TableCell className="py-4 font-medium">{v.vehicleID}</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-300">{v.name}</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-300 font-mono">{v.registrationNumber}</TableCell>
                                </TableRow>
                            ))}
                            {vehicles.length === 0 && !isLoading && (
                                <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-500">Brak pojazdów do wyświetlenia.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
                    <DialogHeader><DialogTitle className="text-gray-900 dark:text-white">Dodaj Pojazd</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa pojazdu</label>
                            <Input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="np. Mercedes Sprinter" className="bg-white dark:bg-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numer Rejestracyjny</label>
                            <Input value={draft.registrationNumber} onChange={e => setDraft(d => ({ ...d, registrationNumber: e.target.value }))} placeholder="np. KR 12345" className="bg-white dark:bg-slate-700" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600">Anuluj</Button>
                        <Button onClick={handleSave} disabled={isLoading || !draft.name || !draft.registrationNumber} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? "Dodawanie..." : "Dodaj"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}