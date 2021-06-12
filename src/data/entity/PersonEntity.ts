import { DataContext } from '../context';
import { ItemFilters } from '../repository/ItemRepository';
import { ID, TypeCode } from '../types';

import ItemEntity, { EntityCompanion, ItemFields, NewFields } from './ItemEntity';

interface PersonFields extends ItemFields {
  fullName: string;
  birthDate?: Date;
  description?: string;
}

export default class PersonEntity extends ItemEntity<PersonFields> {
  protected readonly __typename = 'Person';
  static readonly typeCode = TypeCode.PERSON;

  static getEntityCompanion(): EntityCompanion<PersonFields> {
    return {
      tableName: 'people',
      viewName: 'person_view',
      idColumnName: 'person_id',
      rowMap: {
        full_name: 'fullName',
        birth_date: 'birthDate',
      },
    };
  }

  static async byIdAsync(
    id: ID,
    { context }: { context?: DataContext } = {}
  ): Promise<PersonEntity | null> {
    return await PersonEntity.repository(context).getById(id);
  }

  static async getAllAsync({
    context,
    ...filters
  }: ItemFilters & { context?: DataContext } = {}): Promise<PersonEntity[]> {
    return await PersonEntity.repository(context).getAll(filters);
  }

  static async createPerson({
    context,
    fields,
  }: {
    context?: DataContext;
    fields: NewFields<PersonFields>;
  }): Promise<PersonEntity> {
    return await PersonEntity.repository(context).create(fields);
  }

  static async deletePerson({
    context,
    personId,
  }: {
    context?: DataContext;
    personId: ID;
  }): Promise<PersonEntity> {
    return await PersonEntity.repository(context).delete(personId);
  }
}
