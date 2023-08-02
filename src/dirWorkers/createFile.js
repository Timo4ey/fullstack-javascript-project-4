import fsp from 'fs/promises';
import path from 'path';

const createFile = (filename, filepath, data = '') => {
  const file = fsp
    .writeFile(path.join(filepath, filename), data)
    .catch((error) => {
      if (error) {
        console.error(error.message);
        throw new Error(`${error.message}`);
      }
    })
    .then(() => console.log(path.join(filepath, filename)));
  return file;
};

export default createFile;
