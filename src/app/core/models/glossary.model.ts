import { Category } from './category.model';
import { Version } from './version.model';

export interface Glossary {
  id?: number;
  term: string;
  slug?: string;
  definition: string;
  currentVersionId?: number;
  currentVersion?: Version;
  categoryId?: number;
  category?: Category;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
