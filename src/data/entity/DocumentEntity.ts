import { DataContext } from '../context';
import { ItemFilters } from '../repository/ItemRepository';
import { ID, TypeCode } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface DocumentFields extends ItemFields {
  title: string;
  type: string;
  filename?: string;
  content?: string;
}

export default class DocumentEntity extends ItemEntity<DocumentFields> {
  protected readonly __typename = 'Document';
  static readonly typeCode = TypeCode.DOCUMENT;

  static getEntityCompanion(): EntityCompanion<DocumentFields> {
    return {
      tableName: 'documents',
      viewName: 'document_view',
      idColumnName: 'document_id',
      rowMap: {},
    };
  }

  static async byIdAsync(
    id: ID,
    { context }: { context?: DataContext } = {}
  ): Promise<DocumentEntity | null> {
    return await DocumentEntity.repository(context).getById(id);
  }

  static async getAllAsync({
    context,
    ...filters
  }: ItemFilters & { context?: DataContext } = {}): Promise<DocumentEntity[]> {
    return await DocumentEntity.repository(context).getAll(filters);
  }
}
