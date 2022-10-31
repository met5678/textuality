import { Meteor } from 'meteor/meteor';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

function usePaginatedSubscription({ subscription, collection, onDataUpdate }) {
  console.log('hook START');
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(10);
  const currentRequest = useRef();

  const offset = page * count;

  const { handle, loading } = useTracker(() => {
    console.log('tracker - subscription', { page, offset, count });
    const handle = Meteor.subscribe(subscription, { offset, count });
    return { loading: !handle.ready(), handle };
  }, [subscription, offset, count]);

  useTracker(() => {
    console.log('tracker - data update START');
    collection.find().fetch();
    onDataUpdate?.();
    console.log('tracker - data update COMPLETE');
  }, [collection]);

  const dataQuery = useCallback(
    (query) => {
      const { page: nextPage, pageSize: nextCount, search } = query;
      console.log('dataQuery', query);
      setPage(nextPage);
      setCount(nextCount);

      currentRequest.current = new Promise((resolve, reject) => {
        const data = collection.find().fetch();

        console.log('dataQuery resolve', {
          dataLength: data.length,
          nextPage,
          nextCount,
        });

        resolve({
          data,
          page: nextPage,
          totalCount: handle.data('total') ?? 0,
        });
      });

      return currentRequest.current;
    },
    [handle]
  );

  console.log('hook COMPLETE', { dataQuery, loading });

  return {
    dataQuery,
    loading,
  };
}

export default usePaginatedSubscription;
