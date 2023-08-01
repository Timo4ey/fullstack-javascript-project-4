import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { getSrc, getScripts } from '../src/loaders/getScripts.js';
import getDom from '../src/loaders/getDom.js';

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
  const testJsScript = '__fixtures__/tests1/testJsScript.html';

  host = 'ru.hexlet.io/';

  mock({
    app: {},
    'picture.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    testsGetDon: { 'testGetDom.html': mock.load(path.join(process.cwd(), newLocal)) },
    testWithoutSrcS: { 'testWithoutSrcS.html': mock.load(path.join(process.cwd(), testWithoutSrcS)) },
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

describe('Test getSrc, getScripts, getDom', () => {
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

  test('Test function getScripts.  Should return a list of entries [[filename.format, urlTODownload', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const expected = ['https://ru.hexlet.io/packs/js/runtime.js'];
    const htmlTest1 = await fsp.readFile(path.join('testJsScript', 'testJsScript.html'), 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    const dom = await getDom(targetUrl);
    const result = await getScripts(dom, host);
    expect(result).toEqual(expected);
    expect(typeof result).toEqual('object');
  });
});
