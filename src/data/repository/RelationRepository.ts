import DataLoader from 'dataloader';
import { Knex } from 'knex';

import { DataContext } from '../context';
import client from '../../db/client';
import DocumentEntity from '../entity/DocumentEntity';
import FileEntity from '../entity/FileEntity';
import ItemEntity from '../entity/ItemEntity';
import PersonEntity from '../entity/PersonEntity';
import PhotoEntity from '../entity/PhotoEntity';
import StoryEntity from '../entity/StoryEntity';
import { ID, TypeCode } from '../types';

interface RelationResultSet {
  rows: {
    id: string;
    type: TypeCode;
    reference_id: string;
  }[];
}

export interface SingleRelation {
  relationId: string;
  source: ItemEntity;
  target: ItemEntity;
}

export class RelationRepository {
  constructor(private readonly context: DataContext) {}

  private readonly relatedInLoader = new DataLoader<ID, ItemEntity[]>(async (ids) => {
    console.count('relatedIn');
    return await Promise.all(
      ids.map(async (itemId) => {
        const result = await client.raw<RelationResultSet>(
          'select id, type, reference_id from reference_sources(?);',
          itemId
        );

        return await this.processResultSet(result);
      })
    );
  });

  private readonly relatesToLoader = new DataLoader<ID, ItemEntity[]>(async (ids) => {
    return await Promise.all(
      ids.map(async (itemId) => {
        console.count('relatesTo');

        const result = await client.raw<RelationResultSet>(
          'select id, type, reference_id from reference_targets(?);',
          itemId
        );

        return await this.processResultSet(result);
      })
    );
  });

  /**
   * Finds all entities in which the `item` is referenced
   * @param item item to find references to
   * @returns entities which reference provided `item`
   */
  async findItemsRelatedIn(item: ItemEntity): Promise<ItemEntity[]> {
    return await this.relatedInLoader.load(item.getId());
  }

  /**
   * Finds all entities which are referenced by the `item`
   * @param item item to find references for
   * @returns entities which are referenced by provided `item`
   */
  async findItemsRelatesTo(item: ItemEntity): Promise<ItemEntity[]> {
    return await this.relatesToLoader.load(item.getId());
  }

  async createRelation(sourceId: ID, targetId: ID): Promise<SingleRelation> {
    if (sourceId === targetId) {
      throw new Error('Cannot create relation. Item cannot relate itself!');
    }

    const payload = {
      source_id: sourceId,
      target_id: targetId,
    };

    return await client.transaction(async (tx) => {
      const sourceItem = await this.findItem(sourceId, tx);
      const targetItem = await this.findItem(targetId, tx);

      if (!sourceItem) throw new Error("Cannot create relation. Source item doesn't exist.");
      if (!targetItem) throw new Error("Cannot create relation. Target item doesn't exist.");

      const rows = await tx.insert(payload, '*').into('reference');
      if (rows.length !== 1)
        throw new Error(`Cannot create relationship. Affected rows: ${rows.length}`);

      return {
        relationId: rows[0].reference_id,
        source: sourceItem,
        target: targetItem,
      };
    });
  }

  async deleteRelation(relationId: ID): Promise<SingleRelation> {
    return await client.transaction(async (tx) => {
      const rows = await tx('reference').where('reference_id', relationId).delete('*');
      if (rows.length !== 1)
        throw new Error(`Failed to delete relation. Affected rows: ${rows.length}`);

      return {
        relationId: rows[0].reference_id,
        source: (await this.findItem(rows[0].source_id, tx))!,
        target: (await this.findItem(rows[0].target_id, tx))!,
      };
    });
  }

  private async processResultSet(resultSet: RelationResultSet): Promise<ItemEntity[]> {
    const groups = new Map<TypeCode, ID[]>();
    const referenceIds = new Map<ID, ID>();

    // group ids by entity type
    for (const row of resultSet.rows) {
      const ids = groups.get(row.type) ?? [];
      groups.set(row.type, [...ids, row.id]);

      referenceIds.set(row.id, row.reference_id);
    }

    const groupItems = await Promise.all(
      Array.from(groups).map(([type, ids]) => this.processGroup(type, ids))
    );

    const items = groupItems.flat();
    for (const item of items) {
      item._referenceId = referenceIds.get(item.getId());
    }
    return items;
  }

  private async processGroup(type: TypeCode, ids: ID[]): Promise<ItemEntity[]> {
    switch (type) {
      case TypeCode.DOCUMENT:
        return await DocumentEntity.repository(this.context).getMany(ids);
      case TypeCode.FILE:
        return await FileEntity.repository(this.context).getMany(ids);
      case TypeCode.PERSON:
        return await PersonEntity.repository(this.context).getMany(ids);
      case TypeCode.PHOTO:
        return await PhotoEntity.repository(this.context).getMany(ids);
      case TypeCode.STORY:
        return await StoryEntity.repository(this.context).getMany(ids);
      default:
        throw new Error(`Unsupported entity type code: ${type}`);
    }
  }

  private async findItem(itemId: ID, db: Knex = client): Promise<ItemEntity | null> {
    const item = await db.select(['type_code']).from('items').where('item_id', itemId).first();
    if (!item) return null;

    const entities = await this.processGroup(item.type_code, [itemId]);
    return entities[0] ?? null;
  }
}
