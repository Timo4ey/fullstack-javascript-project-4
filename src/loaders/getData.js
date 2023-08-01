import axios from 'axios';
import fs from 'fs';

export const loadData = (images, dirPath) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((page) =>
        page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`))),
      );

      return result;
    })
    .catch(console.log);
  return img;
};

export function getData(links) {
  const output = Promise.resolve(links)
    .then((result) => result.map((item) => [item[0], axios({ method: 'get', url: item[1], responseType: 'stream' })]))
    .catch(console.log);

  return output;
}
