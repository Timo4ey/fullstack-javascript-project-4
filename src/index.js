import path from 'path';
import urlNameService from './urlNameService.js';
import checkAccess from './checkAccess.js';
import pageLoader from './pageLoader.js';
import searchPageResources from './searchPageResources.js';
import savePage from './savePage.js';
import downLoadResourcesListr from './downLoadResourcesListr.js';
import { pageLoaderLog } from './pageLoaderLog.js';

export default (pageUrl, outputFolder = process.cwd()) => {
  const pageFilename = urlNameService.createPageName(pageUrl);
  const resourceFolderName = urlNameService.createFolderName(pageUrl);
  const pageFilePath = path.join(outputFolder, pageFilename);
  const resourceFolderPath = path.join(outputFolder, resourceFolderName);
  pageLoaderLog('Starting load page', pageUrl);
  return checkAccess(outputFolder)
    .then(() => pageLoader(pageUrl))
    .then((pageContent) => searchPageResources(pageContent, pageUrl, resourceFolderPath))
    .then((data) => downLoadResourcesListr(data, resourceFolderPath))
    .then((data) => savePage(pageFilePath, data.html()))
    .then(() => pageFilePath);
};
