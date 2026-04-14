import { DriverScheduleBlock } from "./DriverScheduleBlock";
import { ReportsBlock } from "./ReportsBlock";
import { ReservationsBlock } from "./ReservationsBlock";

export function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa kolumna - Grafik Kierowców */}
        <div className="lg:col-span-1">
          <DriverScheduleBlock />
        </div>

        {/* Środkowa kolumna - Raporty i Rezerwacje */}
        <div className="lg:col-span-2 space-y-6">
          <ReportsBlock />
          <ReservationsBlock />
        </div>
      </div>
    </div>
  );
}
