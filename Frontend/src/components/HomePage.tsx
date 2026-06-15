import { Layout } from "./Layout";
import { ClientBookingBlock } from "./ClientBookingBlock";
import { useT } from "@/i18n";

export function HomePage() {
    const t = useT();

    return (
        <Layout>
            <div className="space-y-10">
                {/* Sekcja powitalna */}
                <div className="text-center space-y-4 pt-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pb-2">
                        {t("app.home.title")}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t("app.home.subtitle")}
                    </p>
                </div>

                {/* Główny komponent wyszukiwarki i rezerwacji dla klienta */}
                <section className="max-w-6xl mx-auto">
                    <ClientBookingBlock />
                </section>
            </div>
        </Layout>
    );
}