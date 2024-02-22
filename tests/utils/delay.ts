export const delay = async (ms = 10) =>
  await new Promise((resolve) => setTimeout(resolve, ms));
