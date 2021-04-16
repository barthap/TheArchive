import ItemRepository from '../repository/ItemRepository';
import { ID } from '../types';

export interface ItemFields {
  id: ID;
  createdAt?: string;
  updatedAt?: string;
}

export const itemDefaultRowMap: Record<string, keyof ItemFields> = {
  created_at: 'createdAt',
  updated_at: 'updatedAt',
};

export type EntityCompanion<TFields> = {
  rowMap: Record<string, keyof Omit<TFields, keyof ItemFields>>;
  readonly tableName: string;
  readonly viewName: string;
  readonly idColumnName: string;
};

export interface IEntityClass<TFields extends ItemFields, TEntity extends ItemEntity<TFields>> {
  new (fields: Readonly<TFields>): TEntity;
  getEntityCompanion(): EntityCompanion<TFields>;
  __typename: string;
}

export default abstract class ItemEntity<TFields extends ItemFields> {
  static readonly __typename: string = 'Item';

  constructor(private readonly fields: TFields) {}

  static repository<TFields extends ItemFields, TEntity extends ItemEntity<TFields>>(
    this: IEntityClass<TFields, TEntity>
  ): ItemRepository<TFields, TEntity> {
    return new ItemRepository<TFields, TEntity>(this);
  }

  getField<T extends keyof TFields>(field: T): TFields[T] {
    return this.fields[field];
  }

  getAllFields(): Readonly<TFields> {
    return { ...this.fields };
  }

  getId(): ID {
    return this.fields['id'];
  }

  getTypename<TFields extends ItemFields, TEntity extends ItemEntity<TFields>>(
    this: IEntityClass<TFields, TEntity>
  ): string {
    return this.__typename;
  }
}
