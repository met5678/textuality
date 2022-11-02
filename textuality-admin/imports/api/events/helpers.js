import Events from './events';

Events.current = () => {
  return Events.findOne({ active: true });
};

Events.currentId = () => {
  const current = Events.current();
  return current ? current._id : null;
};

Events.allIds = () => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};
