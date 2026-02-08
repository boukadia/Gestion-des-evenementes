export interface Ticket {
  id: number;
  pdfUrl: string;
  createdAt: string;
  reservationId: number;
  userId: number;
  eventId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  event?: {
    id: number;
    title: string;
    dateTime: string;
    location: string;
  };
  reservation?: {
    id: number;
    status: string;
  };
}

export interface TicketsResponse {
  data: Ticket[];
  total?: number;
}
