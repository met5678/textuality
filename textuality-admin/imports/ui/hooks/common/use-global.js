import { useTracker } from 'meteor/react-meteor-data';
import get from 'lodash.get';

import Globals from 'api/globals';

function useGlobal(prop) {
  return useTracker(() => {
    const options = prop ? { fields: { [prop]: 1 } } : {};
    const globals = Globals.find({}, options).fetch();
    if (globals) {
      return prop ? get(globals[0], prop) : globals[0];
    }
    return null;
  }, [prop]);
}

export default useGlobal;
