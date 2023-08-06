import path from 'path';

import * as cheerio from 'cheerio';

import { loadBinaryFile, loadJsOrHref } from './buildListrTasks.js';
import { pageLoaderLog } from './pageLoaderLog.js';
import urlNameService from './urlNameService.js';

const tagTypes = {
  img: {
    attr: 'src',
    downloader: loadBinaryFile,
  },
  script: {
    attr: 'src',
    downloader: loadJsOrHref,
  },
  link: {
    attr: 'href',
    downloader: loadJsOrHref,
  },
};
const handlingTags = ($, tag, pageUrl, resourceFolderPath) => {
  const resources = [];
  const tagAttr = tagTypes[tag].attr;
  $(tag).each((i, pageTag) => {
    if ($(pageTag).attr(tagAttr)) {
      const pagelink = new URL($(pageTag).attr(tagAttr), pageUrl.origin);
      if (pageUrl.host === pagelink.host) {
        pageLoaderLog(`Found resource: ${pagelink}`);
        if (pagelink.href.match(/\.\w+$/gi) !== null) {
          const fileName = urlNameService.createFileName(pagelink.href);
          const midifiedPathURL = path.join(
            urlNameService.createFolderName(`${pageUrl.origin}${pageUrl.pathname}`),
            fileName,
          );
          const newFilePath = path.join(resourceFolderPath, fileName);
          $(pageTag).attr(tagAttr, midifiedPathURL);
          resources.push({
            fileUrl: pagelink.href,
            load: tagTypes[tag].downloader,
            filePath: newFilePath,
          });
        } else {
          const fileName = urlNameService.createPageName(pagelink.href);
          const midifiedPathURL = path.join(
            urlNameService.createFolderName(`${pageUrl.origin}${pageUrl.pathname}`),
            fileName,
          );
          const newFilePath = path.join(resourceFolderPath, fileName);
          $(pageTag).attr(tagAttr, midifiedPathURL);
          resources.push({
            fileUrl: pagelink.href,
            load: tagTypes[tag].downloader,
            filePath: newFilePath,
          });
        }
      }
    }
  });
  return { $, resources };
};
const searchPageResources = (pageContent, pageUrl, resourceFolderPath) => {
  let $ = cheerio.load(pageContent.data);
  pageLoaderLog('Searching resources');
  const resources = Object.keys(tagTypes).reduce((acc, tag) => {
    const result = handlingTags($, tag, new URL(pageUrl), resourceFolderPath);
    $ = result.$;
    return [...acc, ...result.resources];
  }, []);

  return { $, resources };
};

export default searchPageResources;
