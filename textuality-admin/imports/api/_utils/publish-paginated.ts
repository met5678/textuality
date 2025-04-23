import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export type PaginatedCursorOptions<T extends { _id: string }> = {
  offset?: number;
  count?: number;
  search?: string;
  sort?: Mongo.SortSpecifier;
  query?: Mongo.Selector<T>;
};

export type GetPaginatedCursorOptions<T extends { _id: string }> = {
  fields?: Mongo.FieldSpecifier;
  searchField?: string;
  getServerQuery?: () => Mongo.Selector<T>;
};

type PaginatedCursorFunction<T extends { _id: string }> = (
  opts: PaginatedCursorOptions<T>,
) => Mongo.Cursor<T> | void;

function getPaginatedCursor<T extends { _id: string }>(
  collection: Mongo.Collection<T>,
  {
    getServerQuery,
    fields,
    searchField = 'name',
  }: GetPaginatedCursorOptions<T> = {},
): PaginatedCursorFunction<T> {
  return function paginatedCursor(
    this: Meteor.Subscription,
    {
      query = {},
      offset = 0,
      count = 25,
      search,
      sort = { name: 1 },
    }: PaginatedCursorOptions<T>,
  ) {
    this.autorun(() => {
      const regex = new RegExp(`${search}`, 'gi');
      const searchQuery = search
        ? {
            [searchField]: { $regex: regex },
          }
        : {};
      const finalQuery: Mongo.Selector<T> = {
        ...searchQuery,
        ...query,
        ...getServerQuery?.(),
      };

      // const total = collection.find(finalQuery).count();
      // this.setData('total', total);

      return collection.find(finalQuery, {
        fields,
        sort,
        skip: offset,
        limit: count,
      });
    });
  };
}

export default getPaginatedCursor;
