interface ItemWithId {
  _id?: string;
}

function convertToIdDict<T extends ItemWithId>(arr: T[]): Record<string, T> {
  return arr.reduce((acc: Record<string, T>, item: T) => {
    if (!item._id) return acc;
    acc[item._id] = item;
    return acc;
  }, {});
}

export default convertToIdDict;
