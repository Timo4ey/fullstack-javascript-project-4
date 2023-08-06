import fsp from 'fs/promises';

import { buildListrTasks } from './buildListrTasks.js';
import progressHandle from './progressHandle.js';

const downLoadResourcesListr = (data, resourceFolderPath) => {
  const { $, resources } = data;
  return fsp.mkdir(resourceFolderPath, { recursive: true }).then(() => {
    const list = buildListrTasks(resources);
    return progressHandle(list).then(() => $);
  });
};

export default downLoadResourcesListr;
