import { DataContext } from '../context';
import { ItemFilters } from '../repository/ItemRepository';
import { ID, TypeCode } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface StoryFields extends ItemFields {
  storyDateTime: string;
  header?: string;
  content: string;
}

export default class StoryEntity extends ItemEntity<StoryFields> {
  protected readonly __typename = 'Story';
  static readonly typeCode = TypeCode.STORY;

  static getEntityCompanion(): EntityCompanion<StoryFields> {
    return {
      tableName: 'story',
      viewName: 'story_view',
      idColumnName: 'story_id',
      rowMap: {
        storydatetime: 'storyDateTime',
      },
    };
  }

  static async byIdAsync(
    id: ID,
    { context }: { context?: DataContext } = {}
  ): Promise<StoryEntity | null> {
    return await StoryEntity.repository(context).getById(id);
  }

  static async getAllAsync({
    context,
    ...filters
  }: ItemFilters & { context?: DataContext } = {}): Promise<StoryEntity[]> {
    return await StoryEntity.repository(context).getAll(filters);
  }
}
