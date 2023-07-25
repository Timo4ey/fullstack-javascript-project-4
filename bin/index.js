import fsp from 'fs/promises';
import path from 'path';

const createFile = (filename) => {
  const thePath = path.join(process.cwd(), filename);
  fsp.createFile(thePath);
};

export default createFile;
