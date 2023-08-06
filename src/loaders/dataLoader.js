import path from 'path';
import Listr from 'listr';
import createDirectory, { createNameDir, checkAccess } from '../dirWorkers/createDirectory.js';
import createFile from '../dirWorkers/createFile.js';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';
import { arrangeJsLinks, arrangeLinks } from './arrangeLinks.js';
import getherElements from './getherElements.js';
import getDom from './getDom.js';
import { updSrcInDomJS, updSrcInDom, updHrefCanonicalInDom, getCanonical } from './updSrcInDom.js';
import { getScripts, getSrc } from './getScripts.js';
import { getData, loadData } from './getData.js';

const tasksLoop = (list) => {
  const tasks = new Listr(list, { concurrent: true });
  return tasks.run().catch((err) => {
    console.log(err.message);
  });
};

export default function dataLoader(link, thePath = process.cwd()) {
  const url = new URL(link);
  const { host, pathname, origin } = url;
  console.log(url);
  const urlHref = pathname.length > 0 ? `${host}${pathname}` : host;
  const filesDir = createNameDir(urlHref, thePath);
  const fileName = cutNameFromUrl(link);
  console.log('###### FILE NAME !!!l:::', fileName);
  const attrs = [
    ['img[src]', 'src'],
    ['link[rel="stylesheet"]', 'href'],
    ['script', 'src'],
  ];
  return checkAccess(thePath)
    .then(() => createDirectory(urlHref, thePath))
    .then(() =>
      getDom(link)
        .then(($) => {
          const data = attrs.map((attr) => {
            const res = attr[0] === 'script' ? getScripts($, host) : getSrc($, getherElements, attr[0], attr[1]);
            return res
              .then((linkImages) =>
                attr[0] === 'script' ? arrangeJsLinks(linkImages) : arrangeLinks(linkImages, host),
              )
              .then((pangingLinks) => Promise.all(pangingLinks))
              .then((arrangedLinks) => getData(arrangedLinks, filesDir))
              .catch((err) => console.error(`Function checkAccess after arrangedLinks  ${err.message}`));
          });
          return data;
        })
        .then((promises) => Promise.all(promises))
        .then((images) => {
          loadData(images);
          return tasksLoop(images.flat());
        }),
    )
    .then(() =>
      getDom(link)
        .then(($) => {
          attrs.map((attr) => {
            const res =
              attr[0] === 'script'
                ? updSrcInDomJS($, host, filesDir)
                : updSrcInDom($, host, filesDir, attr[0], attr[1]);
            return res;
          });
          /*
          if canonical != pathname
            dataLoader(link/canonical, filesDir)
          else:
            createFile(fileName, thePath, $.html())
          */
          // console.log('!!getCanonical', Array.from(getCanonical($, link, pathname, filesDir)));
          const canonicalPath = Array.from(getCanonical($))[0];

          // canonicalPath === pathname ? null : dataLoader(path.join(link, canonicalPath), filesDir);
          const l = path.join(origin, canonicalPath);
          updHrefCanonicalInDom($, l, pathname, filesDir);
          createFile(cutNameFromUrl(path.join(origin, canonicalPath)), filesDir, $.html());
          return createFile(cutNameFromUrl(link), thePath, $.html());
        })
        .catch((err) => console.error(`Function page-loader end  ${err.message}`)),
    );
}
// console.log(await checkAccess('sys/'));
console.log(await dataLoader('http://127.0.0.1:5000/courses', 'page-loader'));
