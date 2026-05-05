import { mockUserPoints } from "@/data/mockRewards";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function PointsHistory() {
  const history = mockUserPoints.pointsHistory;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Historia Punktów
      </h2>

      <div className="space-y-3">
        {history.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
          >
            {/* Left: Icon and Description */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  transaction.type === "earned"
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-red-100 dark:bg-red-900/40"
                }`}
              >
                {transaction.type === "earned" ? (
                  <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
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
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <p className="font-bold text-lg">
                {transaction.type === "earned" ? "+" : "-"}
                {transaction.amount}
              </p>
              <p className="text-xs text-muted-foreground">punktów</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
