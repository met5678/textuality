import Events from './events';

Events.current = () => {
  return Events.findOne({ active: true });
};

Events.currentId = () => {
  const current = Events.current();
  return current ? current._id : null;
};
