export type ID = string;

export enum TypeCode {
  STORY = 'S',
  FILE = 'F',
  DOCUMENT = 'D',
  PERSON = 'P',
  PHOTO = 'I',
}

export const entityTypeMapping: Record<string, TypeCode> = {
  StoryEntity: TypeCode.STORY,
  FileEntity: TypeCode.FILE,
  DocumentEntity: TypeCode.DOCUMENT,
  PersonEntity: TypeCode.PERSON,
  PhotoEntity: TypeCode.PHOTO,
};
