import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

type ID = string;

interface PersonFields extends ItemFields {
  fullName: string;
  birthDate?: string;
  description?: string;
}

export default class PersonEntity extends ItemEntity<PersonFields> {
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

  static async byIdAsync(id: ID): Promise<PersonEntity | null> {
    return await PersonEntity.repository().getById(id);
  }

  static async getAllAsync(): Promise<PersonEntity[]> {
    return await PersonEntity.repository().getAll();
  }
}
