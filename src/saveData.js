import fsp from 'fs/promises';

const saveData = (filepath, data) =>
  fsp.writeFile(filepath, data, (err) => {
    throw new Error(err.message);
  });

export default saveData;
