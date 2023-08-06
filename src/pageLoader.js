import axios from 'axios';

import { pageLoaderLog, errors } from './pageLoaderLog.js';

const loadPage = (url) => {
  pageLoaderLog(`Loading data: ${url}`);
  return axios
    .get(url)
    .then((response) => response)
    .catch((err) => {
      throw new Error(`${errors[err.code] ? errors[err.code] : `${err.message}`} : ${url}`);
    });
};

export default loadPage;
