import Events from './events';

Events.current = () => {
  return Events.findOne({ active: true });
};
