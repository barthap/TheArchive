import { ID } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface FileFields extends ItemFields {
  filename: string;
  title: string;
  description?: string;
}

export default class FileEntity extends ItemEntity<FileFields> {
  protected readonly __typename = 'File';

  static getEntityCompanion(): EntityCompanion<FileFields> {
    return {
      tableName: 'files',
      viewName: 'file_view',
      idColumnName: 'file_id',
      rowMap: {},
    };
  }

  static async byIdAsync(id: ID): Promise<FileEntity | null> {
    return await FileEntity.repository().getById(id);
  }

  static async getAllAsync(): Promise<FileEntity[]> {
    return await FileEntity.repository().getAll();
  }
}
