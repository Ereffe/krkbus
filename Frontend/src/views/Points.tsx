import { Layout } from "@/components/Layout";
import { PointsStats } from "@/components/PointsStats";
import { PointsHistory } from "@/components/PointsHistory";
import { RewardCard } from "@/components/RewardCard";
import { mockUserPoints } from "@/data/mockRewards";
import type { Reward } from "@/types/rewards";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useT } from "@/i18n";

interface ApiReward {
  rewardID: number;
  name: string;
  pointCost: number;
  availableQuantity: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

const mapApiReward = (reward: ApiReward): Reward => ({
  id: reward.rewardID.toString(),
  name: reward.name,
  description: "reward.description",
  pointsCost: reward.pointCost,
  icon: "🎁",
  category: "discount",
  quantity: reward.availableQuantity,
});

type CategoryFilter =
  | "all"
  | "discount"
  | "ticket"
  | "merchandise"
  | "experience";

export function Points() {
  const t = useT();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [userPoints, setUserPoints] = useState(mockUserPoints);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRewards = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiReward[]>(`${API_BASE_URL}/api/rewards`);
      setRewards((data ?? []).map(mapApiReward));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("app.points.error.fetchRewards");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const filteredRewards = useMemo(
    () =>
      selectedCategory === "all"
        ? rewards
        : rewards.filter((reward) => reward.category === selectedCategory),
    [rewards, selectedCategory],
  );

  const handleRedeem = (reward: Reward) => {
    if (userPoints.availablePoints >= reward.pointsCost) {
      setUserPoints((prev) => ({
        ...prev,
        availablePoints: prev.availablePoints - reward.pointsCost,
        redeemedPoints: prev.redeemedPoints + reward.pointsCost,
      }));
    }
  };

  const categories: { id: CategoryFilter; label: string; count: number }[] = [
    {
      id: "all",
      label: t("app.points.filter.all"),
      count: rewards.length,
    },
    {
      id: "discount",
      label: t("app.points.filter.discount"),
      count: rewards.filter((r) => r.category === "discount").length,
    },
    {
      id: "ticket",
      label: t("app.points.filter.ticket"),
      count: rewards.filter((r) => r.category === "ticket").length,
    },
    {
      id: "merchandise",
      label: t("app.points.filter.merchandise"),
      count: rewards.filter((r) => r.category === "merchandise").length,
    },
    {
      id: "experience",
      label: t("app.points.filter.experience"),
      count: rewards.filter((r) => r.category === "experience").length,
    },
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("app.points.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("app.points.subtitle")}
          </p>
        </div>

        {/* Points Stats */}
        <PointsStats
          availablePoints={userPoints.availablePoints}
          totalPoints={userPoints.totalPoints}
          tier={userPoints.tier}
        />

        {/* Rewards Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("app.points.availableRewards")}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">{t("app.points.filterLabel")}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
                  }`}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-75">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={userPoints.availablePoints}
                onRedeem={handleRedeem}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="text-center text-sm text-red-600 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredRewards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t("app.points.noRewards")}
              </p>
            </div>
          )}
        </div>

        {/* Points History */}
        <PointsHistory />

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3">
            💡 {t("app.points.howToEarnTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              • {t("app.points.howToEarn.rule1")}
            </li>
            <li>• {t("app.points.howToEarn.rule2")}</li>
            <li>• {t("app.points.howToEarn.rule3")}</li>
            <li>
              • {t("app.points.howToEarn.rule4")}
            </li>
            <li>
              • {t("app.points.howToEarn.rule5")}
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
