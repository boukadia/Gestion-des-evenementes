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
    description?: string;
    dateTime: string;
    location: string;
    capacity?: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
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
