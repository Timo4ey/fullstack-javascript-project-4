import fsp from 'fs/promises';
import path from 'path';

// eslint-disable-next-line no-useless-escape
export const createNameDir = (host, thePath) => {
  // eslint-disable-next-line no-useless-escape
  const name = path.join(thePath, host.replace(/[\/\._]/g, '-'));
  const output = name.at(-1) === '-' ? name.slice(0, name.length - 2) : name;
  return `${output}_files`;
};

// const createDirectory = (host, thePath = '') => {
//   const nameDir = Promise.resolve(createNameDir(host, thePath))
//     .catch(console.log())
//     .then((name) => {
//       const nameDirs = `${name}`;
//       console.log('!!!', nameDir);
//       fsp.mkdir(nameDirs, { recursive: true });
//       return nameDirs;
//     });

//   return nameDir;
// };

const createDirectory = (host, thePath = '') => {
  const nameDir = createNameDir(host, thePath);

  fsp.mkdir(nameDir, { recursive: true });
  return nameDir;
};

export default createDirectory;
// console.log(await createDirectory('ru-hexlet-io-courses', './'));
