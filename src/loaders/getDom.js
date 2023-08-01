import * as cheerio from 'cheerio';
import axios from 'axios';
// require('axios-debug-log/enable');

export default function getDom(link) {
  const dom = axios
    .get(link)
    .then((response) => cheerio.load(response.data))
    .catch(console.log);

  return dom;
}
