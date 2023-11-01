import Events from './events';

const current = () => {
  return Events.findOne({ active: true });
};

const currentId = () => {
  const current = Events.current!();
  return current ? current._id : null;
};

const allIds = () => {
  return Events.find({}, { fields: { _id: 1 } })
    .fetch()
    .map((event) => event._id);
};

export { current, currentId, allIds };
