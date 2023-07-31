import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { createNameDir } from '../src/dirWorkers/createDirectory.js';
import { getDom, getSrc, getName, arrangeLinks, updSrcInDom, getImages } from '../src/loaders/imageLoader.js';

function getArrayFromHTML(html) {
  return html
    .split(' ')
    .map((str) => str.replace(/\n/g, ''))
    .filter((str) => str.length > 0);
}
let host;

beforeAll(async () => {
  const newLocal = '__fixtures__/tests1/testGetDom.html';
  const testWithoutSrcS = '__fixtures__/tests1/testWithoutSrcS.html';
  const testSrcWithDoubleSlash = '__fixtures__/tests1/testSrcWithDoubleSlash.html';
  host = 'ru.hexlet.io/';

  mock({
    app: {},
    'picture.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    testsGetDon: { 'testGetDom.html': mock.load(path.join(process.cwd(), newLocal)) },
    testWithoutSrcS: { 'testWithoutSrcS.html': mock.load(path.join(process.cwd(), testWithoutSrcS)) },
    testSrcWithDoubleSlash: {
      'testSrcWithDoubleSlash.html': mock.load(path.join(process.cwd(), testSrcWithDoubleSlash)),
    },
    var: {
      before: {
        'before_ru-hexlet-io3.html': mock.load(
          path.join(process.cwd(), '__fixtures__/tests1/before_ru-hexlet-io.html'),
        ),
      },
      after: {
        'ru-hexlet-io3.html': mock.load(path.join(process.cwd(), '__fixtures__/tests1/after_ru-hexlet-io.html')),
      },
    },
  });
});
afterAll(async () => {
  mock.restore();
});

describe('getDom', () => {
  test('Test function getDom. Should return an object function, it has to has method .html() that return html in string format', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = await fsp.readFile(path.join('testsGetDon', 'testGetDom.html'), 'utf-8');
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');
    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const result = await getDom(targetUrl);

    expect(getArrayFromHTML(result.html())).toEqual(getArrayFromHTML(expected));
    expect(typeof result).toEqual('function');
  });

  test('Test function getSrc. Should return a list of unique src', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = ['/assets/professions/nodejs.png'];
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');
    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const dom = await getDom(targetUrl);
    const result = await getSrc(dom);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function getSrc. Should return an empty list of unique src', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [];
    const htmlTest1 = await fsp.readFile(path.join('testWithoutSrcS', 'testWithoutSrcS.html'), 'utf-8');
    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const dom = await getDom(targetUrl);
    const result = await getSrc(dom);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function getName. Should return a string that with replaced dots and user scores to -', async () => {
    const expected = 'asserts-professions-nodejs.png';
    const testData = 'asserts/professions/nodejs.png';

    const result = await getName(testData);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });

  test('Test function getName. Should return an empty string', async () => {
    const expected = '.';
    const testData = '';

    const result = await getName(testData);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });

  test('Test function arrangeLinks.  Should return a list of entries [[filename.format, urlTODownload', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [
      ['ru-hexlet-io-assets-professions-nodejs.png', 'http://ru.hexlet.io/assets/professions/nodejs.png'],
    ];
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const result = await arrangeLinks(links, host);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function arrangeLinks With links with double slash.  Should return a list of entries [[filename.format, urlTODownload]]', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [
      [
        '//upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/131px-Node.js_logo.svg.png',
        '//upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/131px-Node.js_logo.svg.png',
      ],
    ];
    const htmlTest1 = await fsp.readFile(path.join('testSrcWithDoubleSlash', 'testSrcWithDoubleSlash.html'), 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const result = await arrangeLinks(links, host);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function updSrcInDom.  Should return a list of entries [[filename.format, urlTODownload', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = await fsp.readFile(path.join('var', 'after', 'ru-hexlet-io3.html'), 'utf-8');
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);
    const filesDir = createNameDir('ru.hexlet.io/courses/', '');
    const dom = await getDom(targetUrl);
    await updSrcInDom(dom, 'ru.hexlet.io/', filesDir);

    expect(getArrayFromHTML(dom.html()).filter((str) => str.includes('src'))).toEqual(
      getArrayFromHTML(expected).filter((str) => str.includes('src')),
    );
  });

  test('Test function getImages.  Should return a list of entries [[filename.format, data]]', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    // const expected = await fsp.readFile(path.join('var', 'after', 'ru-hexlet-io3.html'), 'utf-8');
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');
    const picture = await fsp.readFile(path.join('picture.png'), 'utf-8');
    const expected = [['ru-hexlet-io-assets-professions-nodejs.png', Promise.resolve({})]];

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);
    nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, picture);
    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const arrangedLinks = await arrangeLinks(links, host);
    const result = await getImages(arrangedLinks);

    expect(result).toEqual(expected);
  });

  // test('Test function loadImages.  should load images', async () => {
  //   const targetUrl = 'https://ru.hexlet.io/courses';
  //   // const expected = await fsp.readFile(path.join('var', 'after', 'ru-hexlet-io3.html'), 'utf-8');
  //   const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');
  //   const picture = await fsp.readFile(path.join('picture.png'), 'utf-8');
  //   const expected = ['ru-hexlet-io-assets-professions-nodejs.png'];

  //   nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);
  //   nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, picture);
  //   const dom = await getDom(targetUrl);
  //   const links = await getSrc(dom);
  //   const arrangedLinks = await arrangeLinks(links, host);
  //   const images = await getImages(arrangedLinks);
  //   const our = await loadImages(images, '/app');
  //   console.log(our);
  //   const result = await fsp.readdir(`app`);
  //   console.log(result);

  //   expect(result).toEqual(expected);
  // });
});
