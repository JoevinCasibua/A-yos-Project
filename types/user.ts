export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUri?: string;
  role?: 'customer' | 'worker';
}
