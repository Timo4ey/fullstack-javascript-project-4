import fsp from 'fs/promises';
import path from 'path';
import errorHandler from '../errorHandlers/errorHandler.js';

const createFile = (filename, filepath, data = '') => {
  const file = fsp
    .writeFile(path.join(filepath, filename), data)
    .catch(errorHandler)
    .then(() => console.log(path.join(filepath, filename)));
  return file;
};

export default createFile;
