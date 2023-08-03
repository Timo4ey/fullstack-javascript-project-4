export default async (error) => {
  if (error) {
    console.error(error.message);
    throw new Error(`${error.message}`);
  }
};
