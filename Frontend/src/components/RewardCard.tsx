import type { Reward } from "@/types/rewards";
import { useState } from "react";
import { Check } from "lucide-react";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
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
      className={`rounded-lg border-2 transition-all ${
        isRedeemed
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-blue-400 bg-white"
      } overflow-hidden`}
    >
      {/* Reward Icon/Header */}
      <div
        className={`p-6 text-center text-6xl ${
          isRedeemed ? "bg-green-100" : "bg-gradient-to-r from-blue-50 to-indigo-50"
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
        <h3 className="font-bold text-lg text-gray-900 mb-1">{reward.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              reward.category === "discount"
                ? "bg-blue-100 text-blue-700"
                : reward.category === "ticket"
                  ? "bg-purple-100 text-purple-700"
                  : reward.category === "merchandise"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-orange-100 text-orange-700"
            }`}
          >
            {reward.category === "discount"
              ? "Zniżka"
              : reward.category === "ticket"
                ? "Bilet"
                : reward.category === "merchandise"
                  ? "Produkty"
                  : "Doświadczenie"}
          </span>
          {remainingQuantity > 0 && remainingQuantity < 20 && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
              Tylko {remainingQuantity} szt.
            </span>
          )}
        </div>

        {/* Points Cost */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600">
              {reward.pointsCost}
            </span>
            <span className="text-sm text-gray-600">punktów</span>
          </div>
        </div>

        {/* Valid Until */}
        {reward.validUntil && (
          <p className="text-xs text-gray-500 mb-4">
            Ważna do: {new Date(reward.validUntil).toLocaleDateString("pl-PL")}
          </p>
        )}

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!canRedeem}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
            isRedeemed
              ? "bg-green-500 text-white"
              : canRedeem
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isRedeemed ? "✓ Wymieniono!" : canRedeem ? "Wymień" : "Brak punktów"}
        </button>
      </div>
    </div>
  );
}
