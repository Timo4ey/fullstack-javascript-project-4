import fsp from 'fs/promises';

import { pageLoaderLog } from './pageLoaderLog.js';

const savePage = (filepath, data) => {
  pageLoaderLog(`Download page to ${filepath}`);
  return fsp.writeFile(filepath, data);
};

export default savePage;
