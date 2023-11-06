import type * as React from 'react';
import { type Mongo } from 'meteor/mongo';

declare module 'meteor/react-meteor-data' {
  export function useTracker<TDataProps>(
    reactiveFn: () => TDataProps,
  ): TDataProps;
  export function useTracker<TDataProps>(
    reactiveFn: () => TDataProps,
    deps: React.DependencyList,
  ): TDataProps;
  export function useTracker<TDataProps>(
    getMeteorData: () => TDataProps,
    deps: React.DependencyList,
    skipUpdate?: (prev: TDataProps, next: TDataProps) => boolean,
  ): TDataProps;
  export function useTracker<TDataProps>(
    getMeteorData: () => TDataProps,
    skipUpdate: (prev: TDataProps, next: TDataProps) => boolean,
  ): TDataProps;

  export function withTracker<TDataProps, TOwnProps>(
    reactiveFn: (props: TOwnProps) => TDataProps,
  ): (
    reactComponent: React.ComponentType<TOwnProps & TDataProps>,
  ) => React.ComponentClass<TOwnProps>;
  export function withTracker<TDataProps, TOwnProps>(options: {
    getMeteorData: (props: TOwnProps) => TDataProps;
    pure?: boolean | undefined;
    skipUpdate?: (prev: TDataProps, next: TDataProps) => boolean;
  }): (
    reactComponent: React.ComponentType<TOwnProps & TDataProps>,
  ) => React.ComponentClass<TOwnProps>;

  export function useSubscribe(name?: string, ...args: any[]): () => boolean;

  export function useFind<T, U>(
    factory: () => Mongo.Cursor<T, U>,
    deps?: React.DependencyList,
  ): U[];
  export function useFind<T, U>(
    factory: () => Mongo.Cursor<T, U> | undefined | null,
    deps?: React.DependencyList,
  ): U[] | null;
}
