export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PARTICIPANT' | 'GUEST';
  createdAt: string;
}

export interface UsersResponse {
  data: User[];
  total?: number;
}
