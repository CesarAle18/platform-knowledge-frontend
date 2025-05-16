import { User } from './user.model';
export interface Comment {
  id?: number;
  content: string;
  commentableType: 'concept' | 'process' | 'glossary' | 'file';
  commentableId: number;
  userId: number;
  user?: User;
  createdAt?: Date;
}
