import { useMemo, useState } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { PaginatedCursorOptions } from '/imports/api/_utils/publish-paginated';
import { TablePaginationProps } from '../generic/Table/Table';

type Document = {
  _id: string;
};

interface SortOptions {
  [key: string]: number;
}

interface PaginatedSubscriptionProps<T extends Document, U extends Document> {
  subscription: string;
  collection: Mongo.Collection<T, U>;
  initialSortField?: string;
  initialSortOrder?: 'asc' | 'desc';
}

interface PaginatedTableProps<T> {
  data: T[];
  loading: boolean;
  paginationProps: TablePaginationProps;
}

function usePaginatedTableProps<T extends Document, U extends Document>({
  subscription,
  collection,
  initialSortField,
  initialSortOrder = 'asc',
}: PaginatedSubscriptionProps<T, U>): PaginatedTableProps<U> {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>(
    initialSortField
      ? [
          {
            field: initialSortField,
            sort: initialSortOrder,
          },
        ]
      : [],
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const offset = paginationModel.page * paginationModel.pageSize;

  const query = useMemo(() => {
    const rawQuery: Partial<Record<keyof T, any>> = {};
    for (const filter of filterModel.items) {
      const field = filter.field as keyof T;
      const value = filter.value;
      rawQuery[field] = value;
    }
    return rawQuery as Mongo.Selector<T>;
  }, [filterModel]);

  const sort: Mongo.SortSpecifier = useMemo(() => {
    const sort: Mongo.SortSpecifier = {};
    for (const sortItem of sortModel) {
      sort[sortItem.field] = sortItem.sort === 'asc' ? 1 : -1;
    }
    return sort;
  }, [sortModel]);

  const subscriptionOptions: PaginatedCursorOptions<T> = useMemo(
    () => ({
      offset,
      query,
      count: paginationModel.pageSize,
      sort,
    }),
    [offset, query, paginationModel.pageSize, sort],
  );

  console.log('sort', sort);

  const isLoading = useSubscribe(subscription, subscriptionOptions, [
    subscriptionOptions,
  ]);

  // const subscriptionHandle = useTracker(() => {
  //   return Meteor.subscribe(subscription, subscriptionOptions);
  // }, [subscriptionOptions]);

  const rows = useFind(
    () =>
      collection.find(query, {
        limit: paginationModel.pageSize,
        sort,
      }),
    [offset, query, paginationModel.pageSize, sort],
  );

  const rowCount = 10000;

  return {
    data: rows,
    loading: isLoading(),
    paginationProps: {
      rowCount,
      paginationMode: 'server',
      paginationModel,
      onPaginationModelChange: setPaginationModel,
      sortMode: 'server',
      sortModel,
      onSortModelChange: setSortModel,
      filterMode: 'server',
      filterModel,
      onFilterModelChange: setFilterModel,
    },
  };
}

export default usePaginatedTableProps;
