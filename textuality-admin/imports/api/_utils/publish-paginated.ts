import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

type PaginatedCursorOptions = {
  offset?: number;
  count?: number;
  search?: string;
  sort?: Mongo.SortSpecifier;
};

type GetPaginatedCursorOptions = {
  fields?: Mongo.FieldSpecifier;
  searchField?: string;
};

type PaginatedCursorFunction = (
  options: PaginatedCursorOptions,
) => Mongo.Cursor<any>;

function getPaginatedCursor(
  collection: Mongo.Collection<any>,
  { fields, searchField = 'name' }: GetPaginatedCursorOptions = {},
): PaginatedCursorFunction {
  return function paginatedCursor(
    this: Meteor.Subscription,
    {
      offset = 0,
      count = 25,
      search,
      sort = { name: 1 },
    }: PaginatedCursorOptions,
  ) {
    const regex = new RegExp(`${search}`, 'gi');
    const query = search
      ? {
          [searchField]: { $regex: regex },
        }
      : {};

    const total = collection.find(query).count();
    this.setData('total', total);

    return collection.find(query, {
      skip: offset,
      limit: count,
      fields,
      sort,
    });
  };
}

export default getPaginatedCursor;
