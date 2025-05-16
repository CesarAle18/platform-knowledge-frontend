import { Client } from './client.model';
import { Zone } from './zone.model';
import { Tag } from './tag.model';
import { File } from './file.model';

export interface Concept {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  clientId?: number;
  client?: Client;
  coordinator?: string;
  zoneId?: number;
  zone?: Zone;
  tags?: Tag[];
  files?: File[];
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
