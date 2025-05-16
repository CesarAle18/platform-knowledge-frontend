import { Category } from './category.model';
import { Concept } from './concept.model';
import { Process } from './process.model';
import { Tag } from './tag.model';

export interface File {
  id?: number;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  type: 'document' | 'image' | 'video' | 'presentation' | 'other';
  categoryId?: number;
  category?: Category;
  conceptId?: number;
  concept?: Concept;
  processId?: number;
  process?: Process;
  tags?: Tag[];
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}