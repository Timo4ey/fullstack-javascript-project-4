import Listr from 'listr';

const cons = () => console.log('smyh');

const tasks = new Listr();

tasks.run().catch((err) => {
  console.error(err);
});
import axios from 'axios';
import fs from 'fs';
import Listr from 'listr';

import errorHandler from '../errorHandlers/errorHandler.js';

export const loadData = (images, dirPath) => {
  const tasks = new Listr();
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((page) => {
        tasks.add([
          {
            title: `${dirPath.split('/').at(-1)}/${page[0]}`,
            task: () => page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`))),
          },
        ]);

        return tasks;
      });

      return tasks;
    })
    .catch(errorHandler);
  return img;
};

export function getData(links) {
  const output = Promise.resolve(links)
    .then((result) => result.map((item) => [item[0], axios({ method: 'get', url: item[1], responseType: 'stream' })]))
    .catch(errorHandler);

  return output;
}

export const loadData = (images, dirPath) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.reduce((acc, page) => {
        acc.push({
          title: `${dirPath.split('/').at(-1)}/${page[0]}`,
          task: () => page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`))),
        });

        return acc;
      }, []);

      return result;
    })
    .catch(errorHandler);
  return img;
};

export const loadData = (images, dirPath, tasks) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((page) => {
        page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`)));

        return tasks;
      });
      return result;
    })
    .catch(errorHandler);
  return img;
};
