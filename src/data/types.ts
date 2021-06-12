export type ID = string;

export enum TypeCode {
  STORY = 'S',
  FILE = 'F',
  DOCUMENT = 'D',
  PERSON = 'P',
  PHOTO = 'I',
}

export const entityTypeMapping: Record<string, TypeCode> = {
  Story: TypeCode.STORY,
  File: TypeCode.FILE,
  Document: TypeCode.DOCUMENT,
  Person: TypeCode.PERSON,
  Photo: TypeCode.PHOTO,
};
