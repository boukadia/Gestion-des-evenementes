export interface Event {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
  createdAt: string;
  adminId: number;
  admin?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface EventsResponse {
  data: Event[];
  total?: number;
}