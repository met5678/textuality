export type OptionalId<T extends { _id: any }> = Omit<T, '_id'> & {
  _id?: T['_id'];
};

export type UpdateRequiredId<T extends { _id: any }> = Partial<T> & {
  _id: T['_id'];
};
