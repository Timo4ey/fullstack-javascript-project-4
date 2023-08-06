import fs from 'fs';
import axios from 'axios';
import saveData from './saveData.js';
import { pageLoaderLog } from './pageLoaderLog.js';

export const binaryFileLoader = (fileUrl, filePath) =>
  axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(filePath));
    })
    .catch((err) => {
      throw new Error(`Error saving image: ${err.message} (${fileUrl})`);
    });

export const fileLoader = (resourceUrl, filePath) =>
  axios({
    method: 'get',
    url: resourceUrl,
    responseType: 'arraybuffer',
  }).then((response) => saveData(filePath, response.data));
export const buildListrTasks = (arr) => {
  pageLoaderLog('Create Listr tasks');
  return arr.reduce((acc, elem) => {
    acc.push({
      title: `${elem.fileUrl}`,
      task: () => elem.load(elem.fileUrl, elem.filePath).catch(),
    });
    return acc;
  }, []);
};
