export default async (error) => {
  if (error) {
    await console.error(error.message);
    throw new Error(`${error.message}`);
  }
};
