import { TripDataBlock } from "./TripDataBlock";
import { ScheduleAndDispositionBlock } from "./ScheduleAndDispositionBlock";
import { TripInputBlock } from "./TripInputBlock";

export function DriverDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard Kierowcy
        </h1>
        <p className="text-lg text-gray-600">
          Zarządzaj przejazdami, grafikiem pracy i dyspozycjami
        </p>
      </div>

      {/* Bloki Dashboard */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lewa kolumna - Dane o przejazdach */}
        <div className="flex-1">
          <TripDataBlock />
        </div>

        {/* Prawa kolumna - Grafik i dyspozycje + Wprowadzanie danych */}
        <div className="flex-1 lg:flex-[2] space-y-6">
          <ScheduleAndDispositionBlock />
          <TripInputBlock />
        </div>
      </div>
    </div>
  );
}
