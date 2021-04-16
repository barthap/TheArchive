import client from '../../db/client';
import ItemEntity, {
  EntityCompanion,
  IEntityClass,
  itemDefaultRowMap,
  ItemFields,
} from '../entity/ItemEntity';
import { ID } from '../types';

export default class ItemRepository<
  TFields extends ItemFields,
  TEntity extends ItemEntity<TFields>
> {
  protected readonly entityCompanion: EntityCompanion<TFields>;

  constructor(protected readonly entityClass: IEntityClass<TFields, TEntity>) {
    this.entityCompanion = entityClass.getEntityCompanion();
  }

  async getById(id: ID): Promise<TEntity | null> {
    const record = await client(this.entityCompanion.viewName).where('id', id).first();
    if (!record) {
      return null;
    }
    return new this.entityClass(this.mapRowToFields(record));
  }

  async getAll(): Promise<TEntity[]> {
    const results = await client(this.entityCompanion.viewName).select();
    return results.map((r) => new this.entityClass(this.mapRowToFields(r)));
  }

  async getMany(ids: ID[]): Promise<TEntity[]> {
    const results = await client(this.entityCompanion.viewName).select().whereIn('id', ids);
    return results.map((r) => new this.entityClass(this.mapRowToFields(r)));
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
