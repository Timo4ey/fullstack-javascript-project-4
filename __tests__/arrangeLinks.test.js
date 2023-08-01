import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { getSrc, getScripts } from '../src/loaders/getScripts.js';
import getDom from '../src/loaders/getDom.js';
import { arrangeLinks, arrangeJsLinks, createLink } from '../src/loaders/arrangeLinks.js';

let host;

beforeAll(async () => {
  const newLocal = '__fixtures__/tests1/testGetDom.html';
  const testJsScript = '__fixtures__/tests1/testJsScript.html';
  const testSrcWithDoubleSlash = '__fixtures__/tests1/testSrcWithDoubleSlash.html';
  host = 'ru.hexlet.io/';

  mock({
    app: {},
    'picture.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    testsGetDon: { 'testGetDom.html': mock.load(path.join(process.cwd(), newLocal)) },
    testJsScript: { 'testJsScript.html': mock.load(path.join(process.cwd(), testJsScript)) },
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

describe('arrangeLinks', () => {
  test('Test function arrangeLinks.  Should return a list of entries [[filename.format, urlTODownload', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [
      ['ru-hexlet-io-assets-professions-nodejs.png', 'http://ru.hexlet.io/assets/professions/nodejs.png'],
    ];
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');

    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, htmlTest1)
      .get('/assets/professions/nodejs.png')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]))
      .get('/packs/js/runtime.js')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]));

    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const result = await arrangeLinks(links, host);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function arrangeLinks With links with double slash.  Should return a list of entries [[filename.format, urlTODownload]]', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [];
    const htmlTest1 = await fsp.readFile(path.join('testSrcWithDoubleSlash', 'testSrcWithDoubleSlash.html'), 'utf-8');

    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, htmlTest1)
      .get('/assets/professions/nodejs.png')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]))
      .get('/packs/js/runtime.js')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]));

    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const result = await arrangeLinks(links, host);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function arrangeJsLinks.  Should return a list of entries [[filename.format, urlTODownload', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = [['ru-hexlet-io-packs-js-runtime.js', 'https://ru.hexlet.io/packs/js/runtime.js']];
    const htmlTest1 = await fsp.readFile(path.join('testJsScript', 'testJsScript.html'), 'utf-8');

    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, htmlTest1)
      .get('/assets/professions/nodejs.png')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]))
      .get('/packs/js/runtime.js')
      .reply(200, Buffer.from([1, 2, 3, 4, 5]));

    const dom = await getDom(targetUrl);
    const links = await getScripts(dom, host);
    const result = arrangeJsLinks(links);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });

  test('Test function createLink.  Should return link', async () => {
    const expected = 'http://ru.hexlet.io/packs/js/runtime.js';
    const link = '/packs/js/runtime.js';
    const result = createLink(host, link);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });

  test('Test function createLink. Test host length is equal 0.  Should return link', async () => {
    const expected = 'http://packs/js/runtime.js';
    const link = 'packs/js/runtime.js';
    const result = createLink('', link);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });

  test('Test function createLink. Test link length is equal 0.  Should return link', async () => {
    const expected = 'http://ru.hexlet.io/';
    const result = createLink(host, '');
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });

  test('Test function createLink. Test link and host length is equal 0.  Should return link', async () => {
    const expected = 'http://';
    const result = createLink('', '');
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('string');
  });
});
