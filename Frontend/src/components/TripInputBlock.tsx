import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TripInputBlock() {
  const [tripData, setTripData] = useState({
    route: "",
    startTime: "",
    endTime: "",
    distance: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      tripData.route &&
      tripData.startTime &&
      tripData.endTime &&
      tripData.distance
    ) {
      alert(
        `Dane o przejazdzie zostały wysłane:\n${JSON.stringify(tripData, null, 2)}`,
      );
      setTripData({
        route: "",
        startTime: "",
        endTime: "",
        distance: "",
        notes: "",
      });
    } else {
      alert("Wypełnij wszystkie wymagane pola");
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="text-orange-900">
          Wprowadzaj Dane o Przejazdach
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Trasa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="route"
                value={tripData.route}
                onChange={handleInputChange}
                placeholder="Np. Kraków - Warszawa"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Distance */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Dystans (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="distance"
                value={tripData.distance}
                onChange={handleInputChange}
                placeholder="Np. 290"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Start Time */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Godzina wyjazdu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={tripData.startTime}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Godzina przyjazdu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={tripData.endTime}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Uwagi/Notatki
            </label>
            <textarea
              name="notes"
              value={tripData.notes}
              onChange={handleInputChange}
              placeholder="Dodatkowe informacje o przejazdzie..."
              rows={4}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Wyślij Dane o Przejazdzie
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
