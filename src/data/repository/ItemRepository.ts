import DataLoader from 'dataloader';

import client from '../../db/client';
import ItemEntity, {
  EntityCompanion,
  IEntityClass,
  itemDefaultRowMap,
  ItemFields,
} from '../entity/ItemEntity';
import { ID } from '../types';

export interface ItemFilters {
  limit?: number;
  offset?: number;
}
export default class ItemRepository<
  TFields extends ItemFields,
  TEntity extends ItemEntity<TFields>
> {
  protected readonly entityCompanion: EntityCompanion<TFields>;
  protected loader: DataLoader<ID, TEntity>;

  constructor(protected readonly entityClass: IEntityClass<TFields, TEntity>) {
    this.entityCompanion = entityClass.getEntityCompanion();
    this.loader = new DataLoader<ID, TEntity>(async (ids) => {
      console.count('entity ' + this.entityCompanion.tableName + ' getMany');
      const results = await client(this.entityCompanion.viewName).select().whereIn('id', ids);
      return results.map((r) => new this.entityClass(this.mapRowToFields(r)));
    });
    console.count('constructor ' + this.entityCompanion.tableName);
  }

  async getById(id: ID): Promise<TEntity | null> {
    return await this.loader.load(id);

    /*
    console.count('entity ' + this.entityCompanion.tableName + ' byId');
    const record = await client(this.entityCompanion.viewName).where('id', id).first();
    if (!record) {
      return null;
    }
    return new this.entityClass(this.mapRowToFields(record)); */
  }

  async getAll({ limit = 10, offset = 0 }: ItemFilters = {}): Promise<TEntity[]> {
    console.count('entity ' + this.entityCompanion.tableName + ' getAll');
    const results = await client(this.entityCompanion.viewName)
      .select()
      .limit(limit)
      .offset(offset);
    const entities = results.map((r) => new this.entityClass(this.mapRowToFields(r)));
    entities.forEach((e) => this.loader.prime(e.getId(), e));
    return entities;
  }

  async getMany(ids: ID[]): Promise<TEntity[]> {
    const results = await this.loader.loadMany(ids);
    results.forEach((value) => {
      if (value instanceof Error) {
        throw value;
      }
    });

    return results as TEntity[];
  }

  private mapRowToFields(row: Record<string, any>): TFields {
    const fields: Partial<TFields> = {};
    const rowMap = { ...itemDefaultRowMap, ...this.entityCompanion.rowMap };
    for (const k in row) {
      if (k in rowMap) fields[rowMap[k]] = row[k];
      else fields[k as keyof TFields] = row[k];
    }
    return fields as TFields;
  }
}
