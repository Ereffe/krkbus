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
import { useT } from "@/i18n";

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
    const t = useT();

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
            setErrorMessage(e instanceof Error ? e.message : t("app.owner.trips.fetchError"));
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
        if (draft.routeId === "") throw new Error(t("app.owner.trips.selectRoute"));
        if (!draft.departureTime) throw new Error(t("app.owner.trips.enterDeparture"));
        if (!draft.arrivalTime) throw new Error(t("app.owner.trips.enterArrival"));

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
            setErrorMessage(e instanceof Error ? e.message : t("app.owner.trips.createError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                    {t("app.owner.trips.title")}
                </CardTitle>
                <Button
                    onClick={openCreate}
                    disabled={isLoading || routes.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t("app.owner.trips.addTrip")}
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
                        {t("app.owner.trips.filterByRoute")}
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
                                    {t("app.owner.trips.route")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.departure")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.arrival")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.price")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.seats")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.driver")}
                                </TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                                    {t("app.owner.trips.vehicle")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredTrips.map((t) => {
                                const driver = drivers.find(d => (d.id ?? d.driverID ?? d.userID) === t.driverId);
                                const driverName = driver ? (driver.profile ? `${driver.profile.firstName} ${driver.profile.lastName}` : (driver.firstName ? `${driver.firstName} ${driver.lastName}` : `${t("app.owner.trips.driver")} ${t.driverId}`)) : t.driverId;

                                const vehicle = vehicles.find(v => (v.id ?? v.vehicleID) === t.vehicleId);
                                const vehicleName = vehicle ? (vehicle.registrationNumber ?? vehicle.name ?? `${t("app.owner.trips.vehicle")} ${t.vehicleId}`) : t.vehicleId;

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
                                        {t("app.owner.trips.noTrips")}
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
                            {t("app.owner.trips.createTitle")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("app.owner.trips.route")}
                            </label>
                            <select
                                value={draft.routeId}
                                onChange={(e) =>
                                    setDraft((d) => ({ ...d, routeId: e.target.value ? Number(e.target.value) : "" }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            >
                                <option value="">{t("app.owner.trips.selectRouteOption")}</option>
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
                                    {t("app.owner.trips.departure")}
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
                                    {t("app.owner.trips.arrival")}
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
                                    {t("app.owner.trips.priceLabel")}
                                </label>
                                <Input
                                    value={draft.basePrice}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, basePrice: e.target.value }))
                                    }
                                    placeholder={t("app.owner.trips.pricePlaceholder")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("app.owner.trips.seatsLabel")}
                                </label>
                                <Input
                                    value={draft.availableSeats}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, availableSeats: e.target.value }))
                                    }
                                    placeholder={t("app.owner.trips.seatsPlaceholder")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("app.owner.trips.driver")}
                                </label>
                                <select
                                    value={draft.driverId}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, driverId: e.target.value ? Number(e.target.value) : "" }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">{t("app.owner.trips.noDriver")}</option>
                                    {drivers.map((d) => {
                                        const id = d.id ?? d.driverID ?? d.userID;
                                        const name = d.profile ? `${d.profile.firstName} ${d.profile.lastName}` : (d.firstName ? `${d.firstName} ${d.lastName}` : `${t("app.owner.trips.driver")} ${id}`);
                                        return <option key={`${id}${name}`} value={id}>{name}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("app.owner.trips.vehicle")}
                                </label>
                                <select
                                    value={draft.vehicleId}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, vehicleId: e.target.value ? Number(e.target.value) : "" }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">{t("app.owner.trips.noVehicle")}</option>
                                    {vehicles.map((v) => {
                                        const id = v.id ?? v.vehicleID;
                                        const name = v.registrationNumber ?? v.name ?? `${t("app.owner.trips.vehicle")} ${id}`;
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
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                        >
                            {isLoading ? t("app.common.creating") : t("common.create")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
