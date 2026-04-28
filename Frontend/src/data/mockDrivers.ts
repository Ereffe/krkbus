export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedRoutes: string[];
  currentStatus: "available" | "on-duty" | "break" | "off-duty";
  totalHours: number;
  yearsOfExperience: number;
  rating: number;
  joiningDate: string;
}

export interface DriverSchedule {
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  routeId: string;
  status: "completed" | "in-progress" | "scheduled" | "cancelled";
}

export const mockDrivers: Driver[] = [
  {
    id: "driver-1",
    name: "Jan Kowalski",
    email: "jan.kowalski@krkbus.pl",
    phone: "+48 123 456 789",
    licenseNumber: "DL123456",
    assignedRoutes: ["route-1", "route-2"],
    currentStatus: "on-duty",
    totalHours: 5420,
    yearsOfExperience: 12,
    rating: 4.8,
    joiningDate: "2012-03-15",
  },
  {
    id: "driver-2",
    name: "Anna Nowak",
    email: "anna.nowak@krkbus.pl",
    phone: "+48 234 567 890",
    licenseNumber: "DL234567",
    assignedRoutes: ["route-3", "route-4"],
    currentStatus: "available",
    totalHours: 3890,
    yearsOfExperience: 8,
    rating: 4.6,
    joiningDate: "2016-07-22",
  },
  {
    id: "driver-3",
    name: "Piotr Wiśniewski",
    email: "piotr.wisniewski@krkbus.pl",
    phone: "+48 345 678 901",
    licenseNumber: "DL345678",
    assignedRoutes: ["route-5", "route-6"],
    currentStatus: "break",
    totalHours: 2150,
    yearsOfExperience: 5,
    rating: 4.7,
    joiningDate: "2019-01-10",
  },
  {
    id: "driver-4",
    name: "Maria Lewandowska",
    email: "maria.lewandowska@krkbus.pl",
    phone: "+48 456 789 012",
    licenseNumber: "DL456789",
    assignedRoutes: ["route-2", "route-7"],
    currentStatus: "off-duty",
    totalHours: 1250,
    yearsOfExperience: 3,
    rating: 4.5,
    joiningDate: "2021-05-18",
  },
];

export const mockDriverSchedules: DriverSchedule[] = [
  {
    driverId: "driver-1",
    date: "2024-04-28",
    startTime: "06:00",
    endTime: "14:00",
    routeId: "route-1",
    status: "in-progress",
  },
  {
    driverId: "driver-1",
    date: "2024-04-29",
    startTime: "14:00",
    endTime: "22:00",
    routeId: "route-2",
    status: "scheduled",
  },
  {
    driverId: "driver-2",
    date: "2024-04-28",
    startTime: "08:00",
    endTime: "16:00",
    routeId: "route-3",
    status: "scheduled",
  },
  {
    driverId: "driver-3",
    date: "2024-04-28",
    startTime: "10:00",
    endTime: "18:00",
    routeId: "route-5",
    status: "completed",
  },
  {
    driverId: "driver-4",
    date: "2024-04-29",
    startTime: "06:00",
    endTime: "14:00",
    routeId: "route-7",
    status: "scheduled",
  },
];
