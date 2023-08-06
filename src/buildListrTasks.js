import fs from 'fs';

import axios from 'axios';

import { pageLoaderLog } from './pageLoaderLog.js';
import saveData from './saveData.js';

export const binaryFileLoader = (fileUrl, filePath) => {
  const data = {
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  };
  return axios(data)
    .then((response) => {
      response.data.pipe(fs.createWriteStream(filePath));
    })
    .catch((err) => {
      throw new Error(`Error saving image: ${err.message} (${fileUrl})`);
    });
};
export const fileLoader = (resourceUrl, filePath) => {
  const fileData = {
    method: 'get',
    url: resourceUrl,
    responseType: 'arraybuffer',
  };
  return axios(fileData).then((response) => saveData(filePath, response.data));
};

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
