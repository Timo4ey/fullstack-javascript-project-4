import fsp from 'fs/promises';

import { buildTasks } from './buildListrTasks.js';
import handleProgress from './progressHandle.js';

const downLoadResourcesForTasks = (data, resourceFolderPath) => {
  const { $, resources } = data;
  return fsp.mkdir(resourceFolderPath, { recursive: true }).then(() => {
    const list = buildTasks(resources);
    return handleProgress(list).then(() => $);
  });
};

export default downLoadResourcesForTasks;
