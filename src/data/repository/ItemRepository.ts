import DataLoader from 'dataloader';

import client from '../../db/client';
import { invertObject, ObjectKey } from '../../utils/objects';
import ItemEntity, {
  EntityCompanion,
  IEntityClass,
  itemDefaultRowMap,
  ItemFields,
  NewFields,
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

  async create(fields: NewFields<TFields>): Promise<TEntity> {
    const row = this.mapFieldsToRow(fields);
    const { tableName, idColumnName } = this.entityCompanion;

    return await client.transaction(async (tx) => {
      // 1. Insert into `items` table
      const itemRows = await tx.insert({ type_code: this.entityClass.typeCode }, '*').into('items');

      if (itemRows.length !== 1) throw new Error('Affected rows is not 1 when creating Item');
      const { item_id, ...itemColumns } = itemRows[0];

      // 2. insert into entity-specific table
      const entityRows = await tx.insert({ ...row, [idColumnName]: item_id }, '*').into(tableName);

      if (entityRows.length !== 1)
        throw new Error(`Affected rows is not 1 when creating ${tableName}`);

      // 3. prepare and return created entity
      const { [idColumnName]: id, ...entityColumns } = entityRows[0];
      return new this.entityClass(this.mapRowToFields({ ...itemColumns, ...entityColumns, id }));
    });
  }

  async delete(itemId: ID): Promise<TEntity> {
    const { tableName, viewName } = this.entityCompanion;

    return await client.transaction(async (tx) => {
      // 1. select entity to delete - check if it exists
      const entityRows = await tx(viewName).select().where('id', itemId).first();

      if (!entityRows)
        throw new Error(`Cannot delete entity ${tableName}, id=${itemId} doesn't exist`);

      // 2. delete row in `items` table
      // ON DELETE CASCADE will take care of removing row from relations and entity-specific tables
      await tx('items').where('item_id', itemId).del();

      return new this.entityClass(this.mapRowToFields(entityRows));
    });
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

  private mapFieldsToRow<T>(fields: T): Record<string, any> {
    const rowMap = {
      ...itemDefaultRowMap,
      ...this.entityCompanion.rowMap,
    } as Record<keyof T, string>;
    const invertedRowMap = invertObject(rowMap);

    const row: Record<ObjectKey, any> = {};
    for (const field in fields) {
      if (field in invertedRowMap) row[invertedRowMap[field]] = fields[field];
      else row[field] = fields[field];
    }
    return row;
  }
}
