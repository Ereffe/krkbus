import { Zap, TrendingUp } from "lucide-react";

interface PointsStatsProps {
  availablePoints: number;
  totalPoints: number;
  tier: string;
}

const tierColors: Record<string, { bg: string; text: string; light: string }> =
  {
    bronze: {
      bg: "bg-orange-600",
      text: "text-orange-600 dark:text-orange-400",
      light: "bg-orange-50 dark:bg-orange-900/20",
    },
    silver: {
      bg: "bg-gray-400",
      text: "text-gray-600 dark:text-gray-300",
      light: "bg-gray-50 dark:bg-slate-800",
    },
    gold: {
      bg: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      light: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    platinum: {
      bg: "bg-indigo-600",
      text: "text-indigo-600 dark:text-indigo-400",
      light: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  };

export function PointsStats({
  availablePoints,
  totalPoints,
  tier,
}: PointsStatsProps) {
  const colors = tierColors[tier as keyof typeof tierColors];
  const tierLabel: Record<string, string> = {
    bronze: "Brąz",
    silver: "Srebro",
    gold: "Złoto",
    platinum: "Platyna",
  };

  const nextTierThresholds: Record<string, number> = {
    bronze: 500,
    silver: 1000,
    gold: 2000,
    platinum: 5000,
  };

  const nextTierPoints =
    nextTierThresholds[tier as keyof typeof nextTierThresholds] || 0;
  const progressPercent = (totalPoints / nextTierPoints) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Available Points */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-muted-foreground font-semibold">
            Dostępne Punkty
          </h3>
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-4xl font-bold text-foreground">{availablePoints}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Gotowe do wymiany na nagrody
        </p>
      </div>

      {/* Total Points */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 border-l-4 border-green-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-muted-foreground font-semibold">Razem Punktów</h3>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-4xl font-bold text-foreground">{totalPoints}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Wszystkie zebrane punkty
        </p>
      </div>

      {/* Current Tier */}
      <div
        className={`${colors.light} rounded-lg shadow-md p-6 border-l-4 ${colors.bg}`}
      >
        <h3 className="text-muted-foreground font-semibold mb-2">
          Obecny Poziom
        </h3>
        <p className={`text-4xl font-bold ${colors.text}`}>
          {tierLabel[tier as keyof typeof tierLabel]}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Tier Member</p>
      </div>

      {/* Progress to Next Tier */}
      <div className="md:col-span-3 bg-card text-card-foreground rounded-lg shadow-md p-6">
        <h3 className="text-muted-foreground font-semibold mb-4">
          Postęp do następnego poziomu
        </h3>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 transition-all"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {totalPoints} / {nextTierPoints} punktów
        </p>
      </div>
    </div>
  );
}
