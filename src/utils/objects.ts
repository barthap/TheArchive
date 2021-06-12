export type ObjectKey = string | number | symbol;

export function invertObject<K extends ObjectKey, V extends ObjectKey>(
  obj: Record<K, V>
): Record<V, K> {
  const retobj: any = {};
  for (const key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}
