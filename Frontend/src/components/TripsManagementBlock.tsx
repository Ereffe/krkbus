import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type ApiRoute = {
    routeID: number;
    name: string;
    description: string;
};

type TripDTO = {
    departureTime: string; // ISO datetime
    arrivalTime: string; // ISO datetime
    basePrice: number;
    availableSeats: number;
    vehicleId?: number | null;
    driverId?: number | null;
    routeId: number;
};

type ApiDriver = {
    userID?: number;
    driverID?: number;
    id?: number;
    profile?: {
        firstName: string;
        lastName: string;
    };
    firstName?: string;
    lastName?: string;
};

type ApiVehicle = {
    vehicleID?: number;
    id?: number;
    registrationNumber?: string;
    name?: string;
};

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

    if (response.status === 204) {
        return null as T;
    }

    // Read as text first, then try to parse JSON.
    // This avoids "Unexpected token '<'" when backend returns HTML (e.g. error page/login page).
    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || `Request failed (${response.status})`);
    }

    if (!text || text.trim().length === 0) {
        return null as T;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        // eslint-disable-next-line no-console
        console.error("Non-JSON response:", { url, status: response.status, text: text.slice(0, 500) });
        throw new Error("Backend zwrócił nie-JSON odpowiedź. Sprawdź konsolę.");
    }
};

export function TripsManagementBlock() {
    const [routes, setRoutes] = useState<ApiRoute[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<ApiDriver[]>([]);
    const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);

    const [selectedRouteId, setSelectedRouteId] = useState<number | "">("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [draft, setDraft] = useState<{
        routeId: number | "";
        departureTime: string;
        arrivalTime: string;
        basePrice: string;
        availableSeats: string;
        driverId: number | "";
        vehicleId: number | "";
    }>({
        routeId: "",
        departureTime: "",
        arrivalTime: "",
        basePrice: "",
        availableSeats: "",
        driverId: "",
        vehicleId: "",
    });

    const load = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const [routesData, tripsData, driversData, vehiclesData] = await Promise.all([
                fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`).catch(() => []),
                // TripController is registered as /trips (not /api)
                fetchJson<any[]>(`${API_BASE_URL}/trips`).catch(() => []),
                // Bezpieczne pobieranie kierowców i pojazdów (nie przerwie ładowania w przypadku błędu z ich API)
                fetchJson<ApiDriver[]>(`${API_BASE_URL}/api/drivers`).catch(() => []),
                fetchJson<ApiVehicle[]>(`${API_BASE_URL}/api/vehicles`).catch(() => []),
            ]);

            // eslint-disable-next-line no-console
            console.log("TripsManagementBlock load:", { routesData, tripsData });

            setRoutes(routesData ?? []);
            setTrips(tripsData ?? []);
            setDrivers(driversData ?? []);
            setVehicles(vehiclesData ?? []);
            if (routesData?.length) {
                setSelectedRouteId(routesData[0].routeID);
            }
        } catch (e) {
            setErrorMessage(e instanceof Error ? e.message : "Nie udało się pobrać trips.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const filteredTrips = useMemo(() => {
        if (!selectedRouteId) return trips;
        return trips.filter((t) => t.route?.routeID === selectedRouteId || t.routeId === selectedRouteId);
    }, [selectedRouteId, trips]);

    const openCreate = () => {
        setErrorMessage(null);
        const routeId = selectedRouteId === "" ? "" : selectedRouteId;
        setDraft({
            routeId,
            departureTime: new Date().toISOString().slice(0, 16),
            arrivalTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
            basePrice: "0",
            availableSeats: "50",
            driverId: "",
            vehicleId: "",
        });
        setIsDialogOpen(true);
    };

    const toNumber = (v: string) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    const handleCreate = async () => {
        if (draft.routeId === "") throw new Error("Wybierz trasę");
        if (!draft.departureTime) throw new Error("Wprowadź datę i godzinę odjazdu");
        if (!draft.arrivalTime) throw new Error("Wprowadź datę i godzinę przyjazdu");

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const payload: TripDTO = {
                routeId: Number(draft.routeId),
                departureTime: new Date(draft.departureTime).toISOString(),
                arrivalTime: new Date(draft.arrivalTime).toISOString(),
                basePrice: toNumber(draft.basePrice),
                availableSeats: toNumber(draft.availableSeats),
                vehicleId: draft.vehicleId === "" ? null : Number(draft.vehicleId),
                driverId: draft.driverId === "" ? null : Number(draft.driverId),
            };

            // POST /trips
            await fetchJson<any>(`${API_BASE_URL}/trips`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            await load();
            setIsDialogOpen(false);
        } catch (e) {
            setErrorMessage(e instanceof Error ? e.message : "Nie udało się utworzyć tripa");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                    Zarządzaj Tripami (kursami)
                </CardTitle>
                <Button
                    onClick={openCreate}
                    disabled={isLoading || routes.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Dodaj Trip
                </Button>
            </CardHeader>

            <CardContent className="pt-6">
                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                        {errorMessage}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filtr po trasie
                    </label>
                    <select
                        value={selectedRouteId}
                        onChange={(e) => setSelectedRouteId(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                        {routes.map((r) => (
                            <option key={r.routeID} value={r.routeID}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b dark:border-slate-700">
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Trasa
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Odjazd
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Przyjazd
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Cena
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Miejsca
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Kierowca
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    Pojazd
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredTrips.map((t) => {
                                const driver = drivers.find(d => (d.id ?? d.driverID ?? d.userID) === t.driverId);
                                const driverName = driver ? (driver.profile ? `${driver.profile.firstName} ${driver.profile.lastName}` : (driver.firstName ? `${driver.firstName} ${driver.lastName}` : `Kierowca ${t.driverId}`)) : t.driverId;

                                const vehicle = vehicles.find(v => (v.id ?? v.vehicleID) === t.vehicleId);
                                const vehicleName = vehicle ? (vehicle.registrationNumber ?? vehicle.name ?? `Pojazd ${t.vehicleId}`) : t.vehicleId;

                                return (
                                    <TableRow
                                        key={t.tripID}
                                        className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                                    >
                                        <TableCell className="py-4 text-gray-900 dark:text-white font-medium">
                                            {t.route?.name ?? "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {t.departureTime?.replace("T", " ") ?? "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {t.arrivalTime?.replace("T", " ") ?? "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {typeof t.basePrice === "number" ? t.basePrice.toFixed(2) : "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {typeof t.availableSeats === "number" ? t.availableSeats : "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {t.driverId ? driverName : "—"}
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                            {t.vehicleId ? vehicleName : "—"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {!isLoading && filteredTrips.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        Brak tripów dla tej trasy.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700 max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">
                            Utwórz Trip
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Trasa
                            </label>
                            <select
                                value={draft.routeId}
                                onChange={(e) =>
                                    setDraft((d) => ({ ...d, routeId: e.target.value ? Number(e.target.value) : "" }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Wybierz trasę</option>
                                {routes.map((r) => (
                                    <option key={r.routeID} value={r.routeID}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Odjazd
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={draft.departureTime}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, departureTime: e.target.value }))
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Przyjazd
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={draft.arrivalTime}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, arrivalTime: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Cena (basePrice)
                                </label>
                                <Input
                                    value={draft.basePrice}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, basePrice: e.target.value }))
                                    }
                                    placeholder="np. 10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Dostępne miejsca
                                </label>
                                <Input
                                    value={draft.availableSeats}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, availableSeats: e.target.value }))
                                    }
                                    placeholder="np. 50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kierowca
                                </label>
                                <select
                                    value={draft.driverId}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, driverId: e.target.value ? Number(e.target.value) : "" }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Brak kierowcy</option>
                                    {drivers.map((d) => {
                                        const id = d.id ?? d.driverID ?? d.userID;
                                        const name = d.profile ? `${d.profile.firstName} ${d.profile.lastName}` : (d.firstName ? `${d.firstName} ${d.lastName}` : `Kierowca ${id}`);
                                        return <option key={id} value={id}>{name}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Pojazd
                                </label>
                                <select
                                    value={draft.vehicleId}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, vehicleId: e.target.value ? Number(e.target.value) : "" }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Brak pojazdu</option>
                                    {vehicles.map((v) => {
                                        const id = v.id ?? v.vehicleID;
                                        const name = v.registrationNumber ?? v.name ?? `Pojazd ${id}`;
                                        return <option key={id} value={id}>{name}</option>;
                                    })}
                                </select>
                            </div>
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
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                        >
                            {isLoading ? "Tworzenie..." : "Utwórz"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
