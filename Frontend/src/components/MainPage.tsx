import { DriverScheduleBlock } from "./DriverScheduleBlock";
import { ReportsBlock } from "./ReportsBlock";
import { ReservationsBlock } from "./ReservationsBlock";

export function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Sekretariatu
          </h1>
          <p className="text-lg text-gray-600">
            Zarządzaj grafikami kierowców, raportami i rezerwacjami
          </p>
        </div>

        {/* Bloki Dashboard */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lewa kolumna - Grafik Kierowców */}
          <div className="flex-1">
            <DriverScheduleBlock />
          </div>

          {/* Środkowa kolumna - Raporty i Rezerwacje */}
          <div className="flex-1 lg:flex-[2] space-y-6">
            <ReportsBlock />
            <ReservationsBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
