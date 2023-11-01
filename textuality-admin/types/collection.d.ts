import SimpleSchema from 'simpl-schema';

interface HelpersDict<T> {
  [s: string]: (this: T, ...args: any[]) => any;
}

declare module 'meteor/mongo' {
  namespace Mongo {
    interface Collection<T, U> {
      attachSchema(schema: SimpleSchema): void;
      schema: SimpleSchema;
      helpers: (helpers: HelpersDict<U>) => void;
    }
  }
}
