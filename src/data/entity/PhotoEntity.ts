import { DataContext } from '../context';
import { ItemFilters } from '../repository/ItemRepository';
import { ID } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface PhotoFields extends ItemFields {
  filename: string;
  title: string;
  description?: string;
}

export default class PhotoEntity extends ItemEntity<PhotoFields> {
  protected readonly __typename = 'Photo';

  static getEntityCompanion(): EntityCompanion<PhotoFields> {
    return {
      tableName: 'photos',
      viewName: 'photo_view',
      idColumnName: 'photo_id',
      rowMap: {},
    };
  }

  static async byIdAsync(
    id: ID,
    { context }: { context?: DataContext } = {}
  ): Promise<PhotoEntity | null> {
    return await PhotoEntity.repository(context).getById(id);
  }

  static async getAllAsync({
    context,
    ...filters
  }: ItemFilters & { context?: DataContext } = {}): Promise<PhotoEntity[]> {
    return await PhotoEntity.repository(context).getAll(filters);
  }
}
