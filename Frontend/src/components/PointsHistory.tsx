import { mockUserPoints } from "@/data/mockRewards";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function PointsHistory() {
  const history = mockUserPoints.pointsHistory;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historia Punktów</h2>

      <div className="space-y-3">
        {history.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {/* Left: Icon and Description */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  transaction.type === "earned"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {transaction.type === "earned" ? (
                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right: Points Amount */}
            <div
              className={`text-right ${
                transaction.type === "earned"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <p className="font-bold text-lg">
                {transaction.type === "earned" ? "+" : "-"}
                {transaction.amount}
              </p>
              <p className="text-xs text-gray-500">punktów</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
