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

  return fsp
    .mkdir(nameDir, { recursive: true })
    .catch((err) => {
      throw new Error(`function: createDirectory. ${`${err.message}`} : ${nameDir}`);
    })
    .then(() => nameDir);
};

export const checkAccess = (dir) =>
  fsp.access(dir).catch((err) => {
    throw new Error(`${`function: checkAccess. ${err.message}`} : ${dir}`);
  });
export default createDirectory;
