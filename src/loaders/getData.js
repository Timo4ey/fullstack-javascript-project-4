import axios from 'axios';
import fs from 'fs';
import path from 'path';

import errorHandler from '../errorHandlers/errorHandler.js';

export const loadData = (images) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((pages) =>
        pages.map((page) => page.task().then((data) => data.data.pipe(fs.createWriteStream(page.title)))),
      );
      return result;
    })
    .catch(errorHandler);
  return img;
};

export function getData(links, dirname = '') {
  const output = links.reduce((acc, item) => {
    acc.push({
      title: path.join(dirname, item[0]),
      task: () => axios({ method: 'get', url: item[1], responseType: 'stream' }),
    });
    return acc;
  }, []);

  return output;
}
