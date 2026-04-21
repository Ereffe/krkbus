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

export function SecretaryScheduleBlock() {
  const [secretarySchedule, setSecretarySchedule] = useState([
    {
      id: 1,
      name: "Anna Kowalska",
      day: "Poniedziałek - Piątek",
      hours: "08:00 - 16:00",
    },
    {
      id: 2,
      name: "Jan Nowak",
      day: "Poniedziałek - Piątek",
      hours: "10:00 - 18:00",
    },
    {
      id: 3,
      name: "Maria Wiśniewska",
      day: "Środa - Niedziela",
      hours: "12:00 - 20:00",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    day: "",
    hours: "",
  });

  const handleAddSchedule = () => {
    if (newSchedule.name && newSchedule.day && newSchedule.hours) {
      setSecretarySchedule([
        ...secretarySchedule,
        { id: secretarySchedule.length + 1, ...newSchedule },
      ]);
      setNewSchedule({ name: "", day: "", hours: "" });
      setIsEditing(false);
    }
  };

  const handleRemoveSchedule = (id: number) => {
    setSecretarySchedule(secretarySchedule.filter((item) => item.id !== id));
  };

  return (
    <Card className="border-l-4 border-l-indigo-500 shadow-lg w-full">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl text-indigo-900">
          Ustalaj Grafik Sekretariatu
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-4 md:p-6 flex flex-col min-h-0">
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <Table className="w-full text-sm md:text-base">
              <TableHeader>
                <TableRow className="bg-indigo-50 hover:bg-indigo-50">
                  <TableHead className="text-indigo-900 font-semibold text-xs md:text-sm">
                    Imię i Nazwisko
                  </TableHead>
                  <TableHead className="text-indigo-900 font-semibold text-xs md:text-sm hidden sm:table-cell">
                    Dni Pracy
                  </TableHead>
                  <TableHead className="text-indigo-900 font-semibold text-xs md:text-sm">
                    Godziny
                  </TableHead>
                  <TableHead className="text-indigo-900 font-semibold text-xs md:text-sm">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secretarySchedule.map((secretary) => (
                  <TableRow key={secretary.id} className="text-xs md:text-sm">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{secretary.name}</span>
                        <span className="sm:hidden text-gray-500 text-xs">
                          {secretary.day}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {secretary.day}
                    </TableCell>
                    <TableCell>{secretary.hours}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                        onClick={() => handleRemoveSchedule(secretary.id)}
                      >
                        Usuń
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Schedule */}
          <div className="border-t pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                + Dodaj Nowy Grafik
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Imię i Nazwisko"
                  value={newSchedule.name}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, name: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Dni pracy (np. Poniedziałek - Piątek)"
                  value={newSchedule.day}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, day: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Godziny (np. 08:00 - 16:00)"
                  value={newSchedule.hours}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, hours: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={handleAddSchedule}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-sm md:text-base py-2 md:py-2.5"
                  >
                    Dodaj
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setNewSchedule({ name: "", day: "", hours: "" });
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
      </CardContent>
    </Card>
  );
}
