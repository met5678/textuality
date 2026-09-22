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

export type getTableCollectionPropsArgs<
  T extends { _id: string; event: string },
  U extends { _id: string; event: string } = T,
> = {
  schema: SimpleSchema;
  collection: Mongo.Collection<T, U>;
  methodPrefix: string;
  setEditItem?: (item: U) => void;
};

export const getTableCollectionProps = <
  T extends { _id: string; event: string },
  U extends { _id: string; event: string } = T,
>({
  schema,
  collection,
  methodPrefix,
  setEditItem,
}: getTableCollectionPropsArgs<T, U>): Partial<TableArgs<U>> => {
  let props: Partial<TableArgs<U>> = {
    canDelete: true,
    onDelete: async (item: U | U[]) => {
      const ids = Array.isArray(item) ? item.map((i) => i._id) : [item._id];
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'delete'),
        ids,
      );
    },
    canAddInline: true,
    onEditCell: async (item: U) => {
      item.event = Events.currentId()!;
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'editInline'),
        item,
      );
    },
    canDuplicate: true,
    onDuplicate: async (item: U) => {
      return await Meteor.callAsync(
        getMethodNames(methodPrefix, 'duplicate'),
        item,
      );
    },
    onGetStub: () => getStubWithEvent<U>(schema),
    onValidate: (item: U) => {
      return schema.validate(schema.clean(item));
    },
  };
  if (setEditItem) {
    props.onAdd = () => setEditItem(getStubWithEvent<U>(schema));
    props.canAdd = true;
    props.onEdit = setEditItem;
    props.canEdit = true;
  }
  return props;
};

export const useTableCollectionProps = <
  T extends { _id: string; event: string },
  U extends { _id: string; event: string } = T,
>(
  schema: SimpleSchema,
  collection: Mongo.Collection<T, U>,
  methodPrefix: string,
  setEditItem?: (item: U) => void,
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
