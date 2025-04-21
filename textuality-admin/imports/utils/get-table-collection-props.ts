import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TableArgs } from '../ui/generic/Table/Table';
import { Meteor } from 'meteor/meteor';
import { getStubWithEvent } from './get-stub-with-event';
import Events from '../api/events';
import { useMemo } from 'react';
const methodNames = {
  add: 'new',
  delete: 'delete',
  edit: 'update',
  editInline: 'upsert',
  duplicate: 'duplicate',
};

const getMethodNames = (
  methodPrefix: string,
  action: keyof typeof methodNames,
) => {
  return `${methodPrefix}.${methodNames[action]}`;
};

export const getTableCollectionProps = <
  T extends { _id: string; event: string },
>({
  schema,
  collection,
  methodPrefix,
  setEditItem,
}: {
  schema: SimpleSchema;
  collection: Mongo.Collection<T>;
  methodPrefix: string;
  setEditItem?: (item: T) => void;
}): Partial<TableArgs<T>> => {
  let props: Partial<TableArgs<T>> = {
    canDelete: true,
    onDelete: async (item: T | T[]) => {
      const ids = Array.isArray(item) ? item.map((i) => i._id) : [item._id];
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'delete'),
        ids,
      );
    },
    canAddInline: true,
    onEditCell: async (item: T) => {
      item.event = Events.currentId()!;
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'editInline'),
        item,
      );
    },
    canDuplicate: true,
    onDuplicate: async (item: T) => {
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'duplicate'),
        item,
      );
    },
    onGetStub: () => getStubWithEvent<T>(schema),
    onValidate: (item: T) => {
      return schema.validate(item);
    },
  };
  if (setEditItem) {
    props.onAdd = () => setEditItem(getStubWithEvent<T>(schema));
    props.canAdd = true;
    props.onEdit = setEditItem;
    props.canEdit = true;
  }
  return props;
};

export const useTableCollectionProps = <
  T extends { _id: string; event: string },
>(
  schema: SimpleSchema,
  collection: Mongo.Collection<T>,
  methodPrefix: string,
  setEditItem?: (item: T) => void,
) => {
  return useMemo(
    () =>
      getTableCollectionProps({
        schema,
        collection,
        methodPrefix,
        setEditItem,
      }),
    [schema, collection, methodPrefix, setEditItem],
  );
};
