import { RewardsBlock } from "./RewardsBlock";
import { AccountsBlock } from "./AccountsBlock";
import { SystemBlock } from "./SystemBlock";
import { SecretaryScheduleBlock } from "./SecretaryScheduleBlock";
import { PricingBlock } from "./PricingBlock";
import { RoutesManagementBlock } from "./RoutesManagementBlock";
import { TripsManagementBlock } from "./TripsManagementBlock";
import { Layout } from "./Layout";

export function OwnerPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Panel Właściciela
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Zarządzaj systemem, trasami, cenami, kontami i nagradzaj
            użytkowników
          </p>
        </div>

        {/* Zarządzaj Systemem */}
        <section>
          <SystemBlock />
        </section>

        {/* Ustaw Trasy */}
        <section>
          <RoutesManagementBlock />
        </section>

        {/* Ustaw Trips */}
        <section>
          <TripsManagementBlock />
        </section>

        {/* Ustaw Ceny */}
        <section>
          <PricingBlock />
        </section>


        {/* Ustaw Nagrody */}
        <section>
          <RewardsBlock />
        </section>

        {/* Zarządzaj Kontami */}
        <section>
          <AccountsBlock />
        </section>

        {/* Ustaw Grafik Sekretariatu */}
        <section>
          <SecretaryScheduleBlock />
        </section>
      </div>
    </Layout>
  );
}
