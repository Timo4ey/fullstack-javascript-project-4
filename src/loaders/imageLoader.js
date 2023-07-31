import * as cheerio from 'cheerio';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import createDirectory, { createNameDir } from '../dirWorkers/createDirectory.js';
import createFile from '../dirWorkers/createFile.js';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';

export const getherElements = (element, attr = 'src') => {
  const newLocal = null;
  return Object.hasOwn(element, 'attribs') ? element.attribs[attr] : newLocal;
};

export function getSrc(html, attr = 'img[src]') {
  const srcS = Promise.resolve(html)
    .then(($) => $(attr))
    .catch(console.log)
    .then((imgs) => {
      const output = imgs.map((i, element) => getherElements(element, 'src'));
      return Array.from(new Set(output));
    });
  return srcS;
}

export function getDom(link) {
  const dom = axios
    .get(link)
    .catch(console.log)
    .then((response) => cheerio.load(response.data))
    .catch(console.log);

  return dom;
}

export function getName(name) {
  const updName = !name.startsWith('//') ? name : name.slice(2);
  // eslint-disable-next-line no-useless-escape
  const newName = updName.replace(/[\/\._]/g, '-').split('-');
  const forMAt = newName.at(-1);
  const newFormat = `${newName.slice(0, newName.length - 1).join('-')}.${forMAt}`.replace(/--/g, '-');
  // newFormat.replace(/'--'/g, '-');
  return newFormat.startsWith('-') ? newFormat.slice(1) : newFormat;
}

function createLink(host = '', link = '') {
  const res = host.length > 0 ? `${host}${link}` : `${link}`;
  // res.replace('//', '/');
  return `http://${res.replace('//', '/')}`;
}

export function arrangeLinks(linksArray, host) {
  const arrangedLinks = Promise.resolve(linksArray)
    .then((array) => {
      const output = array.reduce((acc, link) => {
        if (link.startsWith('//')) {
          acc[link] = link;
        } else {
          acc[getName(`${host}${link}`)] = createLink(host, link);
        }
        return acc;
      }, {});
      return Object.entries(output);
    })
    .catch(console.log);
  return arrangedLinks;
}

export const loadImages = (images, dirPath) => {
  const img = Promise.resolve(images)
    .then((response) => {
      const result = response.map((page) =>
        // 0 + 1 -> 1 next iter 1 + 1
        page[1].then((data) => data.data.pipe(fs.createWriteStream(`${dirPath}/${page[0]}`))),
      );

      return result;
    })
    .catch(console.log);
  return img;
};

export function getImages(links) {
  const output = Promise.resolve(links)
    .then((result) => result.map((item) => [item[0], axios({ method: 'get', url: item[1], responseType: 'stream' })]))
    .catch(console.log);

  return output;
}

export function updSrcInDom(dom, host, dirname = '', el = 'img', attr = 'src') {
  const dirName = dirname.split('/').at(-1);
  dom(el).each((i, element) =>
    dom(element).prop(attr, path.join(dirName, getName(`${host}${dom(element).attr(attr)}`))),
  );
  return dom;
}

export function loadImagesFromDOM(link, thePath = path.join(process.cwd(), 'lol')) {
  /**
   *
   * get link
   * get dom
   * get src
   * arrange links
   * join link with src
   * namedLinks src
   * create folder
   * get images
   * load images to directory
   * get object where key is origin src and value is new src
   * replace src
   */
  // get link
  const url = new URL(link);
  const { host, pathname } = url;
  // get dom
  const urlHref = pathname.length > 0 ? `${host}${pathname}` : host;
  const filesDir = createNameDir(urlHref, thePath);
  createDirectory(urlHref, thePath);
  getDom(link)
    .then(($) => getSrc($))
    .then((links) => arrangeLinks(links, host))
    .then((pangingLinks) => Promise.all(pangingLinks))
    .then((arrangedLinks) => getImages(arrangedLinks))
    .then((images) => loadImages(images, filesDir));

  const dom2 = getDom(link)
    .then(($) => updSrcInDom($, host, filesDir))
    .then((d) => createFile(cutNameFromUrl(link), thePath, d.html()));

  // updSrcInDom(dom2, host, pathname);
  // return Promise.resolve(dom2).then((d) => createFile(cutNameFromUrl(link), thePath, d.html()));
  return dom2;
}
// console.log(await loadImagesFromDOM('http://127.0.0.1:5000/courses'));
