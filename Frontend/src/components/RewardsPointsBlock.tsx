import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RewardsPointsBlock() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Jan Kowalski", points: 150, level: "Srebrny" },
    { id: 2, name: "Anna Nowak", points: 280, level: "Złoty" },
    { id: 3, name: "Piotr Wiśniewski", points: 95, level: "Brązowy" },
    { id: 4, name: "Maria Lewandowska", points: 420, level: "Platynowy" },
  ]);

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: "Bonus pieniężny 100 PLN",
      requiredPoints: 200,
      available: true,
    },
    { id: 2, name: "Wolny dzień", requiredPoints: 150, available: true },
    {
      id: 3,
      name: "Bonus pieniężny 500 PLN",
      requiredPoints: 400,
      available: true,
    },
  ]);

  const [isEditingRewards, setIsEditingRewards] = useState(false);
  const [newReward, setNewReward] = useState({
    name: "",
    requiredPoints: "",
  });

  const handleAddReward = () => {
    if (newReward.name && newReward.requiredPoints) {
      setRewards([
        ...rewards,
        {
          id: rewards.length + 1,
          name: newReward.name,
          requiredPoints: parseInt(newReward.requiredPoints),
          available: true,
        },
      ]);
      setNewReward({ name: "", requiredPoints: "" });
      setIsEditingRewards(false);
    }
  };

  const handleRemoveReward = (id: number) => {
    setRewards(rewards.filter((reward) => reward.id !== id));
  };

  const handleAddPoints = (id: number, points: number) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === id) {
          const newPoints = emp.points + points;
          return {
            ...emp,
            points: newPoints,
            level: getLevelFromPoints(newPoints),
          };
        }
        return emp;
      }),
    );
  };

  const getLevelFromPoints = (points: number): string => {
    if (points >= 400) return "Platynowy";
    if (points >= 300) return "Złoty";
    if (points >= 150) return "Srebrny";
    return "Brązowy";
  };

  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-lg w-full">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl text-yellow-900">
          Ustalaj Nagrody & Punkty
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-4 md:p-6 flex flex-col min-h-0">
        <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
          {/* Employees Points */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-yellow-900 mb-3">
              Punkty Pracowników
            </h3>
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <Table className="w-full text-xs md:text-sm">
                <TableHeader>
                  <TableRow className="bg-yellow-50 hover:bg-yellow-50">
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm">
                      Pracownik
                    </TableHead>
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm">
                      Punkty
                    </TableHead>
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm hidden sm:table-cell">
                      Level
                    </TableHead>
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm">
                      Akcje
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id} className="text-xs md:text-sm">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{emp.name}</span>
                          <span className="sm:hidden text-gray-500 text-xs">
                            {emp.level}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-yellow-600">
                          {emp.points}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            emp.level === "Platynowy"
                              ? "bg-purple-100 text-purple-800"
                              : emp.level === "Złoty"
                                ? "bg-yellow-100 text-yellow-800"
                                : emp.level === "Srebrny"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {emp.level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5 md:gap-1 flex-col sm:flex-row">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddPoints(emp.id, 10)}
                            className="text-xs px-1.5 md:px-2 py-0.5 md:py-1"
                          >
                            +10
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddPoints(emp.id, 50)}
                            className="text-xs px-1.5 md:px-2 py-0.5 md:py-1"
                          >
                            +50
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Rewards */}
          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-sm md:text-base font-semibold text-yellow-900 mb-3">
              Dostępne Nagrody
            </h3>
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <Table className="w-full text-xs md:text-sm">
                <TableHeader>
                  <TableRow className="bg-yellow-50 hover:bg-yellow-50">
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm">
                      Nagroda
                    </TableHead>
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm hidden sm:table-cell">
                      Wymagane Punkty
                    </TableHead>
                    <TableHead className="text-yellow-900 font-semibold text-xs md:text-sm">
                      Akcje
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id} className="text-xs md:text-sm">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{reward.name}</span>
                          <span className="sm:hidden text-gray-500 text-xs">
                            {reward.requiredPoints} pkt
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {reward.requiredPoints}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                          onClick={() => handleRemoveReward(reward.id)}
                        >
                          Usuń
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add New Reward */}
            <div className="mt-4">
              {!isEditingRewards ? (
                <Button
                  onClick={() => setIsEditingRewards(true)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  + Dodaj Nową Nagrodę
                </Button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nazwa nagrody"
                    value={newReward.name}
                    onChange={(e) =>
                      setNewReward({ ...newReward, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    placeholder="Wymagane punkty"
                    value={newReward.requiredPoints}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        requiredPoints: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Button
                      onClick={handleAddReward}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-sm md:text-base py-2 md:py-2.5"
                    >
                      Dodaj
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingRewards(false);
                        setNewReward({ name: "", requiredPoints: "" });
                      }}
                      variant="outline"
                      className="flex-1 text-sm md:text-base py-2 md:py-2.5"
                    >
                      Anuluj
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
