import { useTracker } from 'meteor/react-meteor-data';

function useFind(collectionFactory, deps) {
  return useTracker(() => {
    const items = collectionFactory()?.fetch();
    return items;
  }, deps);
}

export default useFind;
