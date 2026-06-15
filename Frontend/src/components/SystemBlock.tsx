import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Database, Shield, RotateCw } from "lucide-react";
import { useT } from "@/i18n";

export function SystemBlock() {
  const t = useT();

  const systemSettings = [
    {
      id: 1,
      name: t("app.owner.system.serverStatus"),
      description: t("app.owner.system.serverStatusDesc"),
      icon: Server,
      status: t("app.owner.system.online"),
      statusColor: "text-green-600 dark:text-green-400",
    },
    {
      id: 2,
      name: t("app.owner.system.database"),
      description: t("app.owner.system.databaseDesc"),
      icon: Database,
      status: t("app.owner.system.synchronized"),
      statusColor: "text-green-600 dark:text-green-400",
    },
    {
      id: 3,
      name: t("app.owner.system.security"),
      description: t("app.owner.system.securityDesc"),
      icon: Shield,
      status: t("app.owner.system.secured"),
      statusColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          {t("app.owner.system.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {systemSettings.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-lg border dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {setting.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-medium text-sm ${setting.statusColor}`}>
                      {setting.status}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {t("app.owner.system.configure")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t dark:border-slate-700">
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              {t("app.owner.system.sync")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              {t("app.owner.system.createBackup")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              {t("app.owner.system.systemLogs")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
