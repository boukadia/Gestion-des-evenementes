export interface Reservation {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'REFUSED' | 'CANCELED';
  createdAt: string;
  userId: number;
  eventId: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  event: {
    id: number;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    capacity: number;
    status: string;
  };
  ticket?: {
    id: number;
    pdfUrl: string;
    createdAt: string;
  };
}

export interface ReservationsResponse {
  data: Reservation[];
  total?: number;
}