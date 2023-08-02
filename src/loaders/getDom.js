import * as cheerio from 'cheerio';
import axios from 'axios';
// require('axios-debug-log/enable');
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
    .catch((error) => {
      if (error) {
        console.error(error.message);
        throw new Error(`${error.message}`);
      }
    });

  return dom;
}
