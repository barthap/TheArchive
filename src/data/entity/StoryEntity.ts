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

  static async byIdAsync(id: ID): Promise<StoryEntity | null> {
    return await StoryEntity.repository().getById(id);
  }

  static async getAllAsync(): Promise<StoryEntity[]> {
    return await StoryEntity.repository().getAll();
  }
}
