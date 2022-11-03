import Rounds from './rounds';
import Events from 'api/events';

Rounds.current = () => {
  return (
    Rounds.find({ event: Events.currentId(), active: true }).fetch()[0] ?? null
  );
};

Rounds.currentId = () => {
  const current = Rounds.current();
  return current ? current._id : null;
};

Rounds.allIds = () => {
  return Rounds.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};
