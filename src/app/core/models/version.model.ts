import { User } from './user.model';
export interface Version {
  id?: number;
  versionNumber: string;
  modelType: 'process' | 'glossary';
  modelId: number;
  content?: string;
  authorId: number;
  author?: User;
  isCurrent: boolean;
  createdAt?: Date;
}
