import fsp from 'fs/promises';
import path from 'path';
import { checkAccess } from './createDirectory.js';

const createFile = (filename, filepath, data = '') => {
  console.log('!!!', path.join(filepath, filename));
  return checkAccess(filepath).then(
    fsp
      .writeFile(path.join(filepath, filename), data)
      .catch((error) => {
        throw new Error(
          `function: createFile. Error creating file: ${error.message} (${path.join(filepath, filename)})`,
        );
      })
      .catch((err) => console.log(`Function createFile.Error.${err.message}`))
      .then(() => `${path.join(filepath, filename)}`),
  );
};

export default createFile;
