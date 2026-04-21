import { SecretaryScheduleBlock } from "./SecretaryScheduleBlock";
import { RoutesAndPricesBlock } from "./RoutesAndPricesBlock";
import { AccountManagementBlock } from "./AccountManagementBlock";
import { RewardsPointsBlock } from "./RewardsPointsBlock";

export function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Właściciela
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Zarządzaj firmą, grafikami, trasami i nagrodami dla zespołu
          </p>
        </div>

        {/* Bloki Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Lewa kolumna - Grafik sekretariatu i Zarządzanie kontami */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <SecretaryScheduleBlock />
            <AccountManagementBlock />
          </div>

          {/* Prawa kolumna - Trasy i ceny + Nagrody */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <RoutesAndPricesBlock />
            <RewardsPointsBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
