import fsp from 'fs/promises';

const saveData = (filepath, data) => {
  const res = fsp.writeFile(filepath, data, (err) => {
    throw new Error(err.message);
  });
  return res;
};

export default saveData;
