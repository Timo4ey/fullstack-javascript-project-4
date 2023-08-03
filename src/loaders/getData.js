import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const loadData = (images) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((pages) =>
        pages.map((page) => page.task().then((data) => data.data.pipe(fs.createWriteStream(page.title)))),
      );
      return result;
    })
    .catch((er) => {
      throw new Error(`Function loadData cant install. ${er.message}`);
    });
  return img;
};

export function getData(links, dirname = '') {
  const output = links.reduce((acc, item) => {
    acc.push({
      title: path.join(dirname, item[0]),
      task: () =>
        axios({ method: 'get', url: item[1], responseType: 'stream' }).catch((er) => {
          // throw new Error(`Function: getData. ${er.message}`);
          console.log(`Function: getData. ${er.message}`);
        }),
    });
    return acc;
  }, []);

  return output;
}
