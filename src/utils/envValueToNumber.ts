export const envValueToNumber = (key: string) => {
  const envValue = process.env[key.toUpperCase()];

  if (!envValue) return;

  return Number(envValue);
};
