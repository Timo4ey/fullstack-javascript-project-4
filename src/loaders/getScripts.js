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

export function getScripts(html, host) {
  const jsLinksArray = Promise.resolve(html).then(($) => {
    const data = $('script').map((i, element) =>
      $(element).attr('src').includes(host) ? new Array($(element).attr('src')) : null,
    );
    return Array.from(new Set(data));
  });
  return jsLinksArray;
}
