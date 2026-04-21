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

export function RoutesAndPricesBlock() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      route: "Kraków - Warszawa",
      distance: 290,
      price: 45,
      currency: "PLN",
    },
    {
      id: 2,
      route: "Warszawa - Gdańsk",
      distance: 350,
      price: 55,
      currency: "PLN",
    },
    {
      id: 3,
      route: "Gdańsk - Kraków",
      distance: 400,
      price: 60,
      currency: "PLN",
    },
    {
      id: 4,
      route: "Kraków - Wrocław",
      distance: 150,
      price: 30,
      currency: "PLN",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route: "",
    distance: "",
    price: "",
  });

  const handleAddRoute = () => {
    if (newRoute.route && newRoute.distance && newRoute.price) {
      setRoutes([
        ...routes,
        {
          id: routes.length + 1,
          route: newRoute.route,
          distance: parseInt(newRoute.distance),
          price: parseFloat(newRoute.price),
          currency: "PLN",
        },
      ]);
      setNewRoute({ route: "", distance: "", price: "" });
      setIsEditing(false);
    }
  };

  const handleRemoveRoute = (id: number) => {
    setRoutes(routes.filter((item) => item.id !== id));
  };

  const handleUpdatePrice = (id: number, newPrice: number) => {
    setRoutes(
      routes.map((item) =>
        item.id === id ? { ...item, price: newPrice } : item,
      ),
    );
  };

  return (
    <Card className="border-l-4 border-l-cyan-500 shadow-lg w-full">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl text-cyan-900">
          Ustalaj Trasy i Ceny
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-4 md:p-6">
        <div className="space-y-4">
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <Table className="w-full text-sm md:text-base">
              <TableHeader>
                <TableRow className="bg-cyan-50 hover:bg-cyan-50">
                  <TableHead className="text-cyan-900 font-semibold text-xs md:text-sm">
                    Trasa
                  </TableHead>
                  <TableHead className="text-cyan-900 font-semibold text-xs md:text-sm hidden sm:table-cell">
                    Dystans (km)
                  </TableHead>
                  <TableHead className="text-cyan-900 font-semibold text-xs md:text-sm">
                    Cena
                  </TableHead>
                  <TableHead className="text-cyan-900 font-semibold text-xs md:text-sm">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((item) => (
                  <TableRow key={item.id} className="text-xs md:text-sm">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.route}</span>
                        <span className="sm:hidden text-gray-500 text-xs">
                          {item.distance} km
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {item.distance}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 md:gap-2 flex-col sm:flex-row">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleUpdatePrice(
                              item.id,
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-16 md:w-20 px-2 py-1 text-xs md:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          step="0.01"
                        />
                        <span className="text-xs md:text-sm font-semibold">
                          {item.currency}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                        onClick={() => handleRemoveRoute(item.id)}
                      >
                        Usuń
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Route */}
          <div className="border-t pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                + Dodaj Nową Trasę
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Trasa (np. Kraków - Warszawa)"
                  value={newRoute.route}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, route: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="number"
                  placeholder="Dystans (km)"
                  value={newRoute.distance}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, distance: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="number"
                  placeholder="Cena (PLN)"
                  value={newRoute.price}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, price: e.target.value })
                  }
                  step="0.01"
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={handleAddRoute}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-sm md:text-base py-2 md:py-2.5"
                  >
                    Dodaj
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setNewRoute({ route: "", distance: "", price: "" });
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
