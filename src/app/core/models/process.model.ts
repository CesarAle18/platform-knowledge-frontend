import { Category } from './category.model';
import { Version } from './version.model';
import { Tag } from './tag.model';

export interface Process {
  id?: number;
  title: string;
  slug?: string;
  description: string;
  currentVersionId?: number;
  currentVersion?: Version;
  categoryId?: number;
  category?: Category;
  status: 'draft' | 'published' | 'archived';
  tags?: Tag[];
  files?: File[];
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
