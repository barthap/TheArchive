import { DataContext } from '../context';
import ItemRepository from '../repository/ItemRepository';
import { ID, TypeCode } from '../types';

export interface ItemFields {
  id: ID;
  createdAt?: string;
  updatedAt?: string;
}

export type NewFields<T extends ItemFields> = Omit<T, keyof ItemFields>;

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
  typeCode: TypeCode;
}

export default abstract class ItemEntity<TFields extends ItemFields = ItemFields> {
  protected readonly __typename: string = 'Item';
  _referenceId: string | undefined;

  constructor(private readonly fields: TFields) {}

  static repository<TFields extends ItemFields, TEntity extends ItemEntity<TFields>>(
    this: IEntityClass<TFields, TEntity>,
    context?: DataContext
  ): ItemRepository<TFields, TEntity> {
    if (!context) {
      console.warn(
        'WARN: Context not provided for repository: ' + this.name + '. Queries will be inefficient'
      );
    }
    return context?.getRepositoryForClass(this) ?? new ItemRepository<TFields, TEntity>(this);
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

  getTypename(): string {
    return this.__typename;
  }
}
