import fsp from 'fs/promises';
import path from 'path';

export const createNameDir = (host, thePath) => {
  // eslint-disable-next-line no-useless-escape
  const name = path.join(thePath, host.replace(/[\/\._]/g, '-'));
  const output = name.at(-1) === '-' ? name.slice(0, name.length - 2) : name;
  return `${output}_files`;
};

const createDirectory = (host, thePath = '') => {
  const nameDir = createNameDir(host, thePath);

  fsp.mkdir(nameDir, { recursive: true }).catch((error) => {
    if (error) {
      console.error(error.message);
      throw new Error(`${error.message}`);
    }
  });
  return nameDir;
};

export default createDirectory;
