import type { Reward } from "@/types/rewards";
import { useState } from "react";
import { Check } from "lucide-react";
import { useT } from "@/i18n";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const t = useT();

  const [isRedeemed, setIsRedeemed] = useState(false);
  const canRedeem = userPoints >= reward.pointsCost && !isRedeemed;
  const remainingQuantity = reward.quantity ?? 0;

  const handleRedeem = () => {
    setIsRedeemed(true);
    onRedeem(reward);
    // Reset after 2 seconds for demo purposes
    setTimeout(() => setIsRedeemed(false), 2000);
  };

  return (
    <div
      className={`rounded-lg border-2 transition-all ${isRedeemed
          ? "border-green-500 bg-green-50 dark:bg-green-900/30"
          : "border-border hover:border-blue-400 dark:hover:border-blue-500 bg-card text-card-foreground"
        } overflow-hidden`}
    >
      {/* Reward Icon/Header */}
      <div
        className={`p-6 text-center text-6xl ${isRedeemed
            ? "bg-green-100 dark:bg-green-900/40"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700"
          }`}
      >
        {reward.icon}
        {isRedeemed && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1">
          {reward.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {reward.description}
        </p>

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${reward.category === "discount"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                : reward.category === "ticket"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  : reward.category === "merchandise"
                    ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
              }`}
          >
            {reward.category === "discount"
              ? t("app.points.filter.discount")
              : reward.category === "ticket"
                ? t("app.points.filter.ticket")
                : reward.category === "merchandise"
                  ? t("app.points.filter.merchandise")
                  : t("app.points.filter.experience")}
          </span>
          {remainingQuantity > 0 && remainingQuantity < 20 && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {t("app.rewardCard.only")} {remainingQuantity} {t("app.rewardCard.pieces")}
            </span>
          )}
        </div>

        {/* Points Cost */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {reward.pointsCost}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("app.points.pointsLabel")}
            </span>
          </div>
        </div>

        {/* Valid Until */}
        {reward.validUntil && (
          <p className="text-xs text-muted-foreground mb-4">
            {t("app.rewardCard.validUntil")} {new Date(reward.validUntil).toLocaleDateString("pl-PL")}
          </p>
        )}

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!canRedeem}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${isRedeemed
              ? "bg-green-500 text-white"
              : canRedeem
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-300"
            }`}
        >
          {isRedeemed ? t("app.rewardCard.redeemed") : canRedeem ? t("app.rewardCard.redeem") : t("app.rewardCard.noPoints")}
        </button>
      </div>
    </div>
  );
}
