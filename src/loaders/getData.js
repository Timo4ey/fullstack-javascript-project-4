import axios from 'axios';
import fs from 'fs';
import Listr from 'listr';

import createDirectory from '../dirWorkers/createDirectory.js';

import errorHandler from '../errorHandlers/errorHandler.js';

export const loadData = (images, dirPath) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((page) => {
        page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`)));

        return result;
      });
      return result;
    })
    .catch(errorHandler);
  return img;
};

export function getData(links) {
  const output = links.reduce((acc, item) => {
    acc.push({
      title: item[0],
      task: () => axios({ method: 'get', url: item[1], responseType: 'stream' }),
    });
    return acc;
  }, []);

  return output;
}
