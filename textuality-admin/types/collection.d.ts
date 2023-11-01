import SimpleSchema from 'simpl-schema';

declare module 'meteor/mongo' {
  namespace Mongo {
    interface Collection<T> {
      attachSchema(schema: SimpleSchema): void;
      schema: SimpleSchema;
    }
  }
}
