import fsp from 'fs/promises';
import path from 'path';

const createFile = (filename, filepath, data = '') => {
  const file = fsp.writeFile(path.join(filepath, filename), data).catch((error) => {
    throw new Error(`Error creating file: ${error.message} (${path.join(filepath, filename)})`);
  });
  return file;
};

export default createFile;
