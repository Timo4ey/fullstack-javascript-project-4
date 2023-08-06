import fsp from 'fs/promises';

import { pageLoaderLog, errors } from './pageLoaderLog.js';

const checkAccess = (dir) => {
  pageLoaderLog(`Check directory: ${dir}`);
  return fsp.access(dir).catch((err) => {
    throw new Error(`${errors[err.code] ? errors[err.code] : `${err.message}`} : ${dir}`);
  });
};

export default checkAccess;
