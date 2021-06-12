import { DataContext } from '../context';
import { ItemFilters } from '../repository/ItemRepository';
import { ID, TypeCode } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface FileFields extends ItemFields {
  filename: string;
  title: string;
  description?: string;
}

export default class FileEntity extends ItemEntity<FileFields> {
  protected readonly __typename = 'File';
  static readonly typeCode = TypeCode.FILE;

  static getEntityCompanion(): EntityCompanion<FileFields> {
    return {
      tableName: 'files',
      viewName: 'file_view',
      idColumnName: 'file_id',
      rowMap: {},
    };
  }

  static async byIdAsync(
    id: ID,
    { context }: { context?: DataContext } = {}
  ): Promise<FileEntity | null> {
    return await FileEntity.repository(context).getById(id);
  }

  static async getAllAsync({
    context,
    ...filters
  }: ItemFilters & { context?: DataContext } = {}): Promise<FileEntity[]> {
    return await FileEntity.repository(context).getAll(filters);
  }
}
