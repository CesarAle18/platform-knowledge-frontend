export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; // Solo para creación/edición
  role: 'admin' | 'editor' | 'viewer';
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
