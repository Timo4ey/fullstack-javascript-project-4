import fsp from 'fs/promises';
import path from 'path';
import errorHandler from '../errorHandlers/errorHandler.js';

const createFile = (filename, filepath, data = '') => {
  const file = fsp.writeFile(path.join(filepath, filename), data).catch(errorHandler);
  return file;
};

export default createFile;
