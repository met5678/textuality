export type OptionalId<T extends { _id: any }> = Omit<T, '_id'> & {
  _id?: T['_id'];
};
