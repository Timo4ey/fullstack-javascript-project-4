import axios from 'axios';
import createFile from '../dirWorkers/createFile.js';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';

function getPage(url, filepath = process.cwd()) {
  const newName = cutNameFromUrl(url);
  const res = axios
    .get(url)
    .catch(console.log)
    .then((data) => createFile(newName, filepath, data.data));

  return res;
}

export default getPage;
