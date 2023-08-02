import getherElements from './getherElements.js';

export function getSrc(html, filterFunction = getherElements, attr = 'img[src]', innerAttr = 'src') {
  const srcS = Promise.resolve(html)
    .then(($) => $(attr))
    .catch(console.error)
    .then((imgs) => {
      const output = imgs.map((i, element) => filterFunction(element, innerAttr));
      return Array.from(new Set(output));
    })
    .catch(console.error);
  return srcS;
}

export function getScripts(dom, host) {
  const jsLinksArray = dom('script').map((i, element) =>
    dom(element).attr('src').includes(host) ? new Array(dom(element).attr('src')) : null,
  );

  return Array.from(new Set(jsLinksArray));
}
