import path from 'path';
import cutNameFromUrl from '../dirWorkers/cutNameFromUrl.js';
import getName from './getName.js';

export function updSrcInDomJS(dom, host, dirname = '') {
  const dirName = dirname.split('/').at(-1);
  return dom('script').each((i, element) =>
    dom(element).attr('src').includes(host)
      ? dom(element).prop('src', path.join(dirName, getName(`${dom(element).attr('src')}`)))
      : null,
  );
}
// return dom;
export function getCanonical($) {
  return $('link[rel="canonical"]').map((i, element) =>
    $(element).attr('rel').includes('canonical') ? new Array($(element).attr('href')) : null,
  );
}

export function updHrefCanonicalInDom($, host, dirname = '') {
  const dirName = dirname.split('/').at(-1);
  const filname = getName(cutNameFromUrl(host));
  return $('link').each((i, element) =>
    $(element).attr('rel').includes('canonical') ? $(element).prop('href', path.join(dirName, filname)) : null,
  );
}

export function updSrcInDom(dom, host, dirname = '', el = 'img', attr = 'src') {
  const dirName = dirname.split('/').at(-1);
  dom(el).each((i, element) =>
    dom(element).attr(attr).startsWith('/')
      ? dom(element).prop(attr, path.join(dirName, getName(`${host}${dom(element).attr(attr)}`)))
      : null,
  );
  return dom;
}
