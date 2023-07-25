import axios from 'axios';
import createFile from '../dirWorkers/createFile.js';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';

// eslint-disable-next-line import/prefer-default-export
export function getPage(url, filepath = process.cwd()) {
  const newName = cutNameFromUrl(url);
  const res = axios
    .get(url)
    .catch(console.log)
    .then((data) => createFile(newName, filepath, data.data));

  return res;
}
