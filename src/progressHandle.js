import Listr from 'listr';
import { pageLoaderLog } from './pageLoaderLog.js';

const progressHandle = (list) => {
  pageLoaderLog('Download resources');
  const tasks = new Listr(list, { concurrent: true });
  return tasks.run().catch((err) => console.log(err.message));
};

export default progressHandle;
