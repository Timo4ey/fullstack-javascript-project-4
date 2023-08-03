import * as cheerio from 'cheerio';
import axios from 'axios';

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
    .catch((err) => {
      throw new Error(`Invalid link. ${err}. With link ${link}`);
    })
    .then((response) => cheerio.load(response.data))
    .catch((err) => {
      throw new Error(`Invalid link. ${err}. With link ${link}`);
    });

  return dom;
}
