import getName from './getName.js';

export function createLink(host = '', link = '') {
  const res = host.length > 0 ? `${host}${link}` : `${link}`;
  return `http://${res.replace('//', '/')}`;
}

export function arrangeJsLinks(linksArray) {
  return linksArray.map((link) => [getName(link.split('//').at(1)), link]);
}

export function arrangeLinks(linksArray, host) {
  const arrangedLinks = Promise.resolve(linksArray)
    .then((array) => {
      const output = array.reduce((acc, link) => {
        if (!link.startsWith('//') && !link.startsWith('http')) {
          acc[getName(`${host}${link}`)] = createLink(host, link);
        }
        return acc;
      }, {});
      return Object.entries(output);
    })
    .catch(console.log);
  return arrangedLinks;
}
