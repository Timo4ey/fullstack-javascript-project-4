import * as cheerio from 'cheerio';
import axios from 'axios';
import errorHandler from '../errorHandlers/errorHandler.js';

axios.interceptors.request.use(
  (req) => req,
  (error) => {
    if (error) {
      console.error('error');
    }
  },
);

export default function getDom(link) {
  const dom = axios
    .get(link)
    .then((response) => cheerio.load(response.data))
    .catch(errorHandler);

  return dom;
}
