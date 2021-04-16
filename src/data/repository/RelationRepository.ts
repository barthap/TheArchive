import client from '../../db/client';
import DocumentEntity from '../entity/DocumentEntity';
import FileEntity from '../entity/FileEntity';
import ItemEntity from '../entity/ItemEntity';
import PersonEntity from '../entity/PersonEntity';
import PhotoEntity from '../entity/PhotoEntity';
import StoryEntity from '../entity/StoryEntity';
import { ID } from '../types';

enum TypeCode {
  STORY = 'S',
  FILE = 'F',
  DOCUMENT = 'D',
  PERSON = 'P',
  PHOTO = 'I',
}

interface RelationResultSet {
  rows: {
    id: string;
    type: TypeCode;
  }[];
}

export class RelationRepository {
  /**
   * Finds all entities in which the `item` is referenced
   * @param item item to find references to
   * @returns entities which reference provided `item`
   */
  static async findItemsRelatedIn(item: ItemEntity): Promise<ItemEntity[]> {
    const itemId = item.getId();

    const result = await client.raw<RelationResultSet>(
      'select id, type from reference_sources(?);',
      itemId
    );

    return await this.processResultSet(result);
  }

  /**
   * Finds all entities which are referenced by the `item`
   * @param item item to find references for
   * @returns entities which are referenced by provided `item`
   */
  static async findItemsRelatesTo(item: ItemEntity): Promise<ItemEntity[]> {
    const itemId = item.getId();

    const result = await client.raw<RelationResultSet>(
      'select id, type from reference_targets(?);',
      itemId
    );

    return await this.processResultSet(result);
  }

  private static async processResultSet(resultSet: RelationResultSet): Promise<ItemEntity[]> {
    const groups = resultSet.rows.reduce((map, row) => {
      const ids = map.get(row.type) ?? [];
      map.set(row.type, [...ids, row.id]);
      return map;
    }, new Map<TypeCode, ID[]>());

    const groupItems = await Promise.all(
      Array.from(groups).map(([type, ids]) => this.processGroup(type, ids))
    );

    return groupItems.flat();
  }

  private static async processGroup(type: TypeCode, ids: ID[]): Promise<ItemEntity[]> {
    switch (type) {
      case TypeCode.DOCUMENT:
        return await DocumentEntity.repository().getMany(ids);
      case TypeCode.FILE:
        return await FileEntity.repository().getMany(ids);
      case TypeCode.PERSON:
        return await PersonEntity.repository().getMany(ids);
      case TypeCode.PHOTO:
        return await PhotoEntity.repository().getMany(ids);
      case TypeCode.STORY:
        return await StoryEntity.repository().getMany(ids);
      default:
        throw new Error(`Unsupported entity type code: ${type}`);
    }
  }
}
