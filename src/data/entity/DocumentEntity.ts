import { ID } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface DocumentFields extends ItemFields {
  title: string;
  type: string;
  filename?: string;
  content?: string;
}

export default class DocumentEntity extends ItemEntity<DocumentFields> {
  protected readonly __typename = 'Document';

  static getEntityCompanion(): EntityCompanion<DocumentFields> {
    return {
      tableName: 'documents',
      viewName: 'document_view',
      idColumnName: 'document_id',
      rowMap: {},
    };
  }

  static async byIdAsync(id: ID): Promise<DocumentEntity | null> {
    return await DocumentEntity.repository().getById(id);
  }

  static async getAllAsync(): Promise<DocumentEntity[]> {
    return await DocumentEntity.repository().getAll();
  }
}
