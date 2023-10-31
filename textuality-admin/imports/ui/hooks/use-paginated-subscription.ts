import { Meteor } from 'meteor/meteor';
import { useState, useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';

interface SortOptions {
  [key: string]: number;
}

interface PaginatedSubscriptionProps<T extends Document> {
  subscription: string;
  collection: Mongo.Collection<T>;
  initial?: {
    sort?: SortOptions;
  };
}

interface PaginatedData<T> {
  count: number;
  data: T[];
  loading: boolean;
  page: number;
  setQuery: (query: PaginatedQuery) => void;
  total: number;
}

interface PaginatedQuery {
  page: number;
  count: number;
  search: string;
  sort?: SortOptions;
}

function usePaginatedSubscription<T extends Document>({
  subscription,
  collection,
  initial = {},
}: PaginatedSubscriptionProps<T>): PaginatedData<T> {
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(10);
  const [total, setTotal] = useState(10);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOptions>(initial.sort || {});
  const offset = page * count;

  useTracker(() => {
    const handle = Meteor.subscribe(subscription, {
      offset,
      count,
      search,
      sort,
    });
    const isLoading = !handle.ready();
    const newTotal = handle.data('total');
    setLoading(isLoading);
    if (!isLoading) {
      setData(collection.find({}, { limit: count, sort }).fetch());
    }
    if (!isLoading && newTotal) {
      setTotal(newTotal);
    }
  }, [subscription, offset, count, search, sort]);

  const setQuery = useCallback(
    (query: PaginatedQuery) => {
      const {
        page: nextPage,
        count: nextCount,
        search: nextSearch,
        sort: nextSort,
      } = query;
      setPage(nextPage);
      setCount(nextCount);
      setSearch(nextSearch);
      setSort(nextSort || sort);
    },
    [sort],
  );

  return {
    count,
    data,
    loading,
    page,
    setQuery,
    total,
  };
}

export default usePaginatedSubscription;
