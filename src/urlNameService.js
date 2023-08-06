import path from 'path';

class URLNameService {
  pathNameBuilder(url) {
    this.myUrl = new URL(url);
    this.pageName = url
      .replace(`${this.myUrl.protocol}//`, '')
      .replace(/\/$/, '')
      .replace(/[^a-z0-9]/gi, '-');
    return this.pageName;
  }

  createFileName(fileUrl) {
    this.newUrl = new URL(fileUrl);
    this.newFilename = fileUrl
      .replace(`${this.newUrl.protocol}//`, '')
      .replace(/\.\w+$/, '')
      .replace(/[^a-z0-9]/gi, '-');
    this.format = path.extname(fileUrl);
    return `${this.newFilename}${this.format}`;
  }

  createFolderName(url) {
    return `${this.pathNameBuilder(url)}_files`;
  }

  createPageName(url) {
    return `${this.pathNameBuilder(url)}.html`;
  }
}

export default new URLNameService();
