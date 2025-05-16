import { User } from './user.model';

export interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  userId: number;
  user?: User;
  relatedType?: 'process' | 'concept' | 'file';
  relatedId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
