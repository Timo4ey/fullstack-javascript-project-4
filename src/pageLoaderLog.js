import debug from 'debug';

const log = 'page-loader';
export const pageLoaderLog = debug(log);
export const errors = {
  ENOTFOUND: 'URL is not found',
  ENOENT: "Can't access to path or not found",
};
