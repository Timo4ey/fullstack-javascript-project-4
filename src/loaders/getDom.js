import * as cheerio from 'cheerio';
import axios from 'axios';

export default function getDom(link) {
  const dom = axios
    .get(link)
    .catch(console.log)
    .then((response) => cheerio.load(response.data))
    .catch(console.log);

  return dom;
}
