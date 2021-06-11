export interface ItemQueryParams<TFilter = undefined> {
  filter?: TFilter;
  limit?: number;
  offset?: number;
}
