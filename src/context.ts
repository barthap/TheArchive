import ItemRepository from './data/repository/ItemRepository';
import ItemEntity, { IEntityClass, ItemFields } from './data/entity/ItemEntity';
import { RelationRepository } from './data/repository/RelationRepository';

export class AppContext {
  private readonly entityLoaders: Map<string, ItemRepository<any, any>>;
  private readonly relationshipRepository = new RelationRepository();

  constructor(entityLoaders?: Map<string, ItemRepository<any, any>>) {
    this.entityLoaders = entityLoaders ?? new Map();
    console.count('Creating app context');
  }

  getRepositoryForClass<TFields extends ItemFields, TEntity extends ItemEntity<TFields>>(
    entityClass: IEntityClass<TFields, TEntity>
  ): ItemRepository<TFields, TEntity> {
    if (this.entityLoaders.has(entityClass.name)) {
      console.count('Getting cached repo for ' + entityClass.name);
      return this.entityLoaders.get(entityClass.name) as ItemRepository<TFields, TEntity>;
    }

    console.count('Creating repo for ' + entityClass.name);
    const repository = new ItemRepository<TFields, TEntity>(entityClass);
    this.entityLoaders.set(entityClass.name, repository);
    return repository;
  }

  getRelationshipRepository(): RelationRepository {
    return this.relationshipRepository;
  }
}
