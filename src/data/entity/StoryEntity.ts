import { DataContext } from '../context';
import { ID } from '../types';

import ItemEntity, { EntityCompanion, ItemFields } from './ItemEntity';

interface StoryFields extends ItemFields {
  storyDateTime: string;
  header?: string;
  content: string;
}

export default class StoryEntity extends ItemEntity<StoryFields> {
  protected readonly __typename = 'Story';

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

  static async getAllAsync({ context }: { context?: DataContext } = {}): Promise<StoryEntity[]> {
    return await StoryEntity.repository(context).getAll();
  }
}
