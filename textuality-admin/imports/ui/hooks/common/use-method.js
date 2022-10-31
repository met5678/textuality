import { Meteor } from 'meteor/meteor';
import { useState, useEffect } from 'react';

function useMethod(method, ...args) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Meteor.call(method, ...args, (err, result) => {
      if (err) throw err;
      setResult(result);
      setLoading(false);
    });
    setLoading(true);
  }, [method, ...args]);

  return { loading, result };
}

export default useMethod;
