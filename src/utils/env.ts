function env<T = string>(
  name: string,
  options?: { defaultValue?: T; transform?: (raw: string) => T }
): T {
  const envVal = process.env[name];

  if (!envVal && options?.defaultValue) {
    return options.defaultValue;
  }

  if (!envVal) {
    throw new Error(`$${name} env var must be defined!`);
  }

  if (options?.transform) {
    return options.transform(envVal);
  }

  return (envVal as unknown) as T;
}

export default env;
