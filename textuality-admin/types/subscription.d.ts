import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';

declare module 'meteor/meteor' {
  namespace Meteor {
    interface Subscription {
      /**
       * Start a reactive computation that:
       * 1. Stops automatically when the subscription stops.
       * 2. Auto-publishes any Cursor or Cursor[] returned.
       *
       * @param runFunc
       *   Inside here `this` is the same Subscription object.
       *   Return a Mongo.Cursor<T> or an array of them (or void).
       * @returns the underlying Tracker.Computation
       */
      autorun<T>(
        runFunc: (
          this: Meteor.Subscription,
          computation: Tracker.Computation,
        ) => Mongo.Cursor<T> | Mongo.Cursor<T>[] | void,
      ): Tracker.Computation;
    }
  }
}
