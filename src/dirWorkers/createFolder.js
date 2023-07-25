import { access } from 'fs/promises';

const checkFolder = (folder = process.cwd()) => {
  const res = access(folder).catch;
  return res;
};

export default checkFolder;
