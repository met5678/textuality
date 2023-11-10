function getDictFromArray<T>(arr: T[], key: string): Record<string, T> {
  const result: Record<string, T> = {};

  arr.forEach((item) => {
    const keys = key.split('.');
    let nestedValue: any = item;

    keys.forEach((nestedKey) => {
      nestedValue = nestedValue[nestedKey] as Record<string, unknown>;
    });

    if (nestedValue !== undefined) {
      result[nestedValue] = item;
    }
  });

  return result;
}
