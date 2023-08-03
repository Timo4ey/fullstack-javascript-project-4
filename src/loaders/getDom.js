import * as cheerio from 'cheerio';
import axios from 'axios';

export default function getDom(link) {
  const dom = axios
    .get(link)
    .catch((err) => {
      throw new Error(`Invalid link. ${err}. With link ${link}`);
    })
    .then((response) => cheerio.load(response.data))
    .catch((err) => {
      throw new Error(`Invalid link. ${err}. With link ${link}`);
    });

  return dom;
}
