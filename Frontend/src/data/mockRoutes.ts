import type { BusRoute } from "@/types/bus";

export const mockBusRoutes: BusRoute[] = [
  {
    id: "1",
    name: "Kraków - Katowice",
    number: "100",
    description: "Trasa międzymiastowa łącząca Kraków z Katowicami",
    startStop: {
      id: "stop-1",
      name: "Kraków - Główny Dworzec",
      coordinate: { latitude: 50.0467, longitude: 19.9454 },
    },
    endStop: {
      id: "stop-8",
      name: "Katowice - Dworzec Centralny",
      coordinate: { latitude: 50.2645, longitude: 19.0273 },
    },
    stops: [
      {
        id: "stop-1",
        name: "Kraków - Główny Dworzec",
        coordinate: { latitude: 50.0467, longitude: 19.9454 },
      },
      {
        id: "stop-2",
        name: "Kraków - Pętla Krowoderska",
        coordinate: { latitude: 50.0812, longitude: 19.9387 },
      },
      {
        id: "stop-3",
        name: "Wieliczka - Rynek",
        coordinate: { latitude: 49.9896, longitude: 20.0689 },
      },
      {
        id: "stop-4",
        name: "Tarnów - Centrum",
        coordinate: { latitude: 50.0095, longitude: 20.9875 },
      },
      {
        id: "stop-5",
        name: "Mielec - Dworzec",
        coordinate: { latitude: 50.2889, longitude: 21.4520 },
      },
      {
        id: "stop-6",
        name: "Dąbrowa Górnicza - Centrum",
        coordinate: { latitude: 50.3381, longitude: 19.1945 },
      },
      {
        id: "stop-7",
        name: "Sosnowiec - Dworzec",
        coordinate: { latitude: 50.2896, longitude: 19.1399 },
      },
      {
        id: "stop-8",
        name: "Katowice - Dworzec Centralny",
        coordinate: { latitude: 50.2645, longitude: 19.0273 },
      },
    ],
    schedule: [
      { departure: "06:00", arrival: "08:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "08:30", arrival: "10:40", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { departure: "11:00", arrival: "13:10", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { departure: "14:00", arrival: "16:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "17:00", arrival: "19:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "19:30", arrival: "21:40", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
    ],
    pricing: {
      studentTicket: 20.0,
      normalTicket: 35.0,
      seniorTicket: 17.5,
      dayPass: 80.0,
    },
    frequency: "Kilka razy dziennie",
    distance: 65.0,
  },
  {
    id: "2",
    name: "Katowice - Kraków",
    number: "101",
    description: "Trasa międzymiastowa łącząca Katowice z Krakowem",
    startStop: {
      id: "stop-k1",
      name: "Katowice - Dworzec Centralny",
      coordinate: { latitude: 50.2645, longitude: 19.0273 },
    },
    endStop: {
      id: "stop-k8",
      name: "Kraków - Główny Dworzec",
      coordinate: { latitude: 50.0467, longitude: 19.9454 },
    },
    stops: [
      {
        id: "stop-k1",
        name: "Katowice - Dworzec Centralny",
        coordinate: { latitude: 50.2645, longitude: 19.0273 },
      },
      {
        id: "stop-k2",
        name: "Sosnowiec - Dworzec",
        coordinate: { latitude: 50.2896, longitude: 19.1399 },
      },
      {
        id: "stop-k3",
        name: "Dąbrowa Górnicza - Centrum",
        coordinate: { latitude: 50.3381, longitude: 19.1945 },
      },
      {
        id: "stop-k4",
        name: "Mielec - Dworzec",
        coordinate: { latitude: 50.2889, longitude: 21.4520 },
      },
      {
        id: "stop-k5",
        name: "Tarnów - Centrum",
        coordinate: { latitude: 50.0095, longitude: 20.9875 },
      },
      {
        id: "stop-k6",
        name: "Wieliczka - Rynek",
        coordinate: { latitude: 49.9896, longitude: 20.0689 },
      },
      {
        id: "stop-k7",
        name: "Kraków - Pętla Krowoderska",
        coordinate: { latitude: 50.0812, longitude: 19.9387 },
      },
      {
        id: "stop-k8",
        name: "Kraków - Główny Dworzec",
        coordinate: { latitude: 50.0467, longitude: 19.9454 },
      },
    ],
    schedule: [
      { departure: "06:00", arrival: "08:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "08:30", arrival: "10:40", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { departure: "11:00", arrival: "13:10", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { departure: "14:00", arrival: "16:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "17:00", arrival: "19:10", daysOfWeek: [1, 2, 3, 4, 5] },
      { departure: "19:30", arrival: "21:40", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
    ],
    pricing: {
      studentTicket: 20.0,
      normalTicket: 35.0,
      seniorTicket: 17.5,
      dayPass: 80.0,
    },
    frequency: "Kilka razy dziennie",
    distance: 65.0,
  },
];
