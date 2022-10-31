import { Meteor } from 'meteor/meteor';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

function usePaginatedSubscription({ subscription, collection }) {
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(10);
  const [total, setTotal] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const offset = page * count;

  useTracker(() => {
    const handle = Meteor.subscribe(subscription, { offset, count, search });
    const isLoading = !handle.ready();
    const newTotal = handle.data('total');
    setLoading(isLoading);
    if (!isLoading) setData(collection.find({}, { limit: count }).fetch());
    if (!isLoading && newTotal) setTotal(newTotal);
  }, [subscription, offset, count, search]);

  const setQuery = useCallback((query) => {
    const { page: nextPage, count: nextCount, search: nextSearch } = query;
    setPage(nextPage);
    setCount(nextCount);
    setSearch(nextSearch);
  }, []);

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
