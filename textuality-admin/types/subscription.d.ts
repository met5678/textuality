import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';
import { Subscription as MeteorSubscription } from 'meteor/meteor';

declare module 'meteor/meteor' {
  namespace Meteor {
    interface Subscription extends MeteorSubscription {
      autorun: (
        func: (
          computation: Tracker.Computation,
        ) =>
          | void
          | Mongo.Cursor<any, any>
          | Mongo.Cursor<any, any>[]
          | Promise<void | Mongo.Cursor<any, any>>,
      ) => void;
      ready: () => void;
    }
  }
}
