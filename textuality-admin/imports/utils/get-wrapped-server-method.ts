import { Meteor } from 'meteor/meteor';

export const getWrappedServerMethod = <Params, Result>(
  method: string,
  methodBody: (params: Params) => Promise<Result>,
) => {
  if (Meteor.isServer) {
    Meteor.methods({
      [method]: methodBody,
    });
  }

  return async (params: Params): Promise<Result> => {
    return await Meteor.callAsync(method, params);
  };
};

export const getWrappedServerMethodNoParams = <Result>(
  method: string,
  methodBody: () => Promise<Result>,
) => {
  if (Meteor.isServer) {
    Meteor.methods({
      [method]: methodBody,
    });
  }

  return async (): Promise<Result> => {
    return await Meteor.callAsync(method);
  };
};
