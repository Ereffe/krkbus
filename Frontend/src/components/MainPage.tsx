import { DriverScheduleBlock } from "./DriverScheduleBlock";
import { ReportsBlock } from "./ReportsBlock";
import { ReservationsBlock } from "./ReservationsBlock";
import { Layout } from "./Layout";

export function MainPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Panel Zarządzania Sekretariatu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
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
          <div className="flex-1 lg:flex-2 space-y-6">
            <ReportsBlock />
            <ReservationsBlock />
          </div>
        </div>
      </div>
    </Layout>
  );
}
