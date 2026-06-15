import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, MapPin, Clock, CalendarDays, Ticket } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ApiRoute {
    routeID: number;
    name: string;
}

interface ApiTrip {
    tripID: number;
    departureTime: string;
    arrivalTime: string;
    basePrice: number;
    availableSeats: number;
    routeId: number;
    route?: ApiRoute;
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

export function ClientBookingBlock() {
    const [routes, setRoutes] = useState<ApiRoute[]>([]);
    const [trips, setTrips] = useState<ApiTrip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filtry wyszukiwania
    const [selectedRouteId, setSelectedRouteId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Rezerwacja - Stan
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<ApiTrip | null>(null);
    const [bookingDraft, setBookingDraft] = useState({
        passenger: "",
        seat: "",
    });

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const [routesData, tripsData] = await Promise.all([
                fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`).catch(() => []),
                fetchJson<ApiTrip[]>(`${API_BASE_URL}/trips`).catch(() => []),
            ]);
            setRoutes(routesData ?? []);
            setTrips(tripsData ?? []);
        } catch (error) {
            setErrorMessage("Nie udało się pobrać danych o trasach i kursach.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filtrowanie kursów na podstawie wybranej trasy i daty
    const filteredTrips = useMemo(() => {
        return trips.filter((t) => {
            const matchesRoute = selectedRouteId ? t.routeId.toString() === selectedRouteId : true;
            const matchesDate = selectedDate ? t.departureTime.startsWith(selectedDate) : true;
            return matchesRoute && matchesDate;
        });
    }, [trips, selectedRouteId, selectedDate]);

    const openBookingDialog = (trip: ApiTrip) => {
        setSelectedTrip(trip);
        setBookingDraft({ passenger: "", seat: "" });
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsDialogOpen(true);
    };

    const handleBook = async () => {
        if (!selectedTrip) return;
        if (!bookingDraft.passenger.trim() || !bookingDraft.seat.trim()) {
            setErrorMessage("Wypełnij wszystkie pola (pasażer i miejsce).");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            await fetchJson(`${API_BASE_URL}/api/reservations`, {
                method: "POST",
                body: JSON.stringify({
                    passenger: bookingDraft.passenger,
                    seat: bookingDraft.seat,
                    routeId: selectedTrip.routeId.toString(),
                    date: selectedTrip.departureTime,
                    tripId: selectedTrip.tripID,
                }),
            });

            setSuccessMessage("Pomyślnie zarezerwowano miejsce!");
            setIsDialogOpen(false);
            await loadData(); // Odświeżenie danych (aby zaktualizować ilość miejsc itp.)

            // Ukryj powiadomienie po kilku sekundach
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Błąd podczas rezerwacji.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold flex items-center gap-2">
                    <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Wyszukaj i Zarezerwuj Przejazd
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {successMessage && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
                        {successMessage}
                    </div>
                )}

                {/* Wyszukiwarka */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl border dark:border-slate-700">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> Trasa
                        </label>
                        <select
                            value={selectedRouteId}
                            onChange={(e) => setSelectedRouteId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Wszystkie trasy</option>
                            {routes.map((r) => (
                                <option key={r.routeID} value={r.routeID}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" /> Data
                        </label>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white dark:bg-slate-700"
                        />
                    </div>
                </div>

                {/* Wyniki Wyszukiwania */}
                <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b dark:border-slate-700">
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Trasa</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Odjazd</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Cena</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Wolne miejsca</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold text-right">Akcja</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTrips.map((trip) => (
                                <TableRow key={trip.tripID} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                                        {trip.route?.name ?? `Trasa ${trip.routeId}`}
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-300 flex flex-col">
                                        <span>{trip.departureTime.split("T")[0]}</span>
                                        <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-100"><Clock className="w-3 h-3" /> {trip.departureTime.split("T")[1].slice(0, 5)}</span>
                                    </TableCell>
                                    <TableCell className="py-4 text-gray-900 dark:text-white font-medium">{trip.basePrice.toFixed(2)} zł</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                                        {trip.availableSeats > 0 ? (
                                            <span className="text-green-600 dark:text-green-400 font-semibold">{trip.availableSeats}</span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Brak miejsc</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-4 text-right">
                                        <Button
                                            onClick={() => openBookingDialog(trip)}
                                            disabled={trip.availableSeats <= 0}
                                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                        >
                                            <Ticket className="w-4 h-4" /> Rezerwuj
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredTrips.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        Brak dostępnych kursów dla podanych kryteriów.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Modal Rezerwacji */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white text-xl">Rezerwacja Miejsca</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {errorMessage && (
                            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300">
                                {errorMessage}
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600 text-sm">
                            <p><strong>Trasa:</strong> {selectedTrip?.route?.name}</p>
                            <p><strong>Odjazd:</strong> {selectedTrip?.departureTime.replace("T", " ")}</p>
                            <p><strong>Cena:</strong> {selectedTrip?.basePrice.toFixed(2)} zł</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Imię i Nazwisko Pasażera
                            </label>
                            <Input
                                placeholder="np. Jan Kowalski"
                                value={bookingDraft.passenger}
                                onChange={(e) => setBookingDraft(d => ({ ...d, passenger: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Wybór miejsca (np. numer miejsca lub "Dowolne")
                            </label>
                            <Input
                                placeholder="np. 12A"
                                value={bookingDraft.seat}
                                onChange={(e) => setBookingDraft(d => ({ ...d, seat: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                            Anuluj
                        </Button>
                        <Button onClick={handleBook} disabled={isLoading || !bookingDraft.passenger || !bookingDraft.seat} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? "Przetwarzanie..." : "Potwierdź rezerwację"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}