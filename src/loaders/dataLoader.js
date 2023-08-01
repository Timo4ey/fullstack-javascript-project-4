import createDirectory, { createNameDir } from '../dirWorkers/createDirectory.js';
import createFile from '../dirWorkers/createFile.js';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';
import { arrangeJsLinks, arrangeLinks } from './arrangeLinks.js';
import getherElements from './getherElements.js';
import getDom from './getDom.js';
import { updSrcInDomJS, updSrcInDom, updHrefCanonicalInDom } from './updSrcInDom.js';
import { getScripts, getSrc } from './getScripts.js';
import { getData, loadData } from './getData.js';

export default function dataLoader(link, thePath) {
  const url = new URL(link);
  const { host, pathname } = url;
  const urlHref = pathname.length > 0 ? `${host}${pathname}` : host;
  const filesDir = createNameDir(urlHref, thePath);
  const attrs = [
    ['img[src]', 'src'],
    ['link[rel="stylesheet"]', 'href'],
    ['script', 'src'],
  ];
  createDirectory(urlHref, thePath);
  getDom(link).then(($) => {
    attrs.map((attr) => {
      const res =
        attr[0] === 'script' ? Promise.resolve(getScripts($, host)) : getSrc($, getherElements, attr[0], attr[1]);
      return res
        .then((linkImages) => (attr[0] === 'script' ? arrangeJsLinks(linkImages) : arrangeLinks(linkImages, host)))
        .then((pangingLinks) => Promise.all(pangingLinks))
        .then((arrangedLinks) => getData(arrangedLinks))
        .then((images) => loadData(images, filesDir))
        .catch(console.log);
    });
  });

  getDom(link).then(($) => {
    attrs.map((attr) => {
      const res =
        attr[0] === 'script' ? updSrcInDomJS($, host, filesDir) : updSrcInDom($, host, filesDir, attr[0], attr[1]);
      return res;
    });
    updHrefCanonicalInDom($, link, pathname, filesDir);
    createFile(cutNameFromUrl(link), thePath, $.html());
  });
}
// console.log(await loadImagesFromDOM('http://127.0.0.1:5000/courses'));
