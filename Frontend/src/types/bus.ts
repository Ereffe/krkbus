export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface BusStop {
  id: string;
  name: string;
  coordinate: Coordinate;
  arrivalTime?: string; // ISO time format or duration
}

export interface BusRoute {
  id: string;
  name: string;
  number: string;
  description: string;
  startStop: BusStop;
  endStop: BusStop;
  stops: BusStop[];
  schedule: {
    departure: string; // HH:MM format
    arrival: string; // HH:MM format
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  }[];
  pricing: {
    studentTicket: number;
    normalTicket: number;
    seniorTicket: number;
    dayPass: number;
  };
  frequency: string; // e.g., "Every 15 minutes"
  distance: number; // in km
}
