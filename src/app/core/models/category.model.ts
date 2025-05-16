export interface Category {
  id?: number;
  name: string;
  slug?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}