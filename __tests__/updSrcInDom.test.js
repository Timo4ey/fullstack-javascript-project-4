import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { createNameDir } from '../src/dirWorkers/createDirectory.js';
import { updSrcInDom, updHrefCanonicalInDom, updSrcInDomJS } from '../src/loaders/updSrcInDom.js';
import getDom from '../src/loaders/getDom.js';

function getArrayFromHTML(html) {
  return html
    .split(' ')
    .map((str) => str.replace(/\n/g, ''))
    .filter((str) => str.length > 0)
    .map((d) => d.replace(/(<|>)/g, ''));
}

beforeAll(async () => {
  const newLocal = '__fixtures__/tests1/testGetDom.html';
  const testWithoutSrcS = '__fixtures__/tests1/testWithoutSrcS.html';
  const testSrcWithDoubleSlash = '__fixtures__/tests1/testSrcWithDoubleSlash.html';
  const testDomwithCSSandJs = '__fixtures__/tests1/testDomwithCSSandJs.html';
  const testDomwithCSSandJsRes = '__fixtures__/tests1/testDomwithCSSandJs_Res.html';

  mock({
    app: {},
    'picture.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    testDomwithCSSandJs: { 'testDomwithCSSandJs.html': mock.load(path.join(process.cwd(), testDomwithCSSandJs)) },
    DomwithCSSandJsRes: { 'DomwithCSSandJsRes.html': mock.load(path.join(process.cwd(), testDomwithCSSandJsRes)) },
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

test('Test function updSrcInDom.  Should return a list of entries CSS [[filename.format, urlTODownload', async () => {
  const targetUrl = 'https://ru.hexlet.io/courses';
  const expected = await fsp.readFile(path.join('DomwithCSSandJsRes', 'DomwithCSSandJsRes.html'), 'utf-8');
  const htmlTest1 = await fsp.readFile(path.join('testDomwithCSSandJs', 'testDomwithCSSandJs.html'), 'utf-8');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlTest1)
    .get('/assets/professions/nodejs.png')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]))
    .get('/packs/js/runtime.js')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]));

  const filesDir = await createNameDir('ru.hexlet.io/courses', 'courses/');
  const dom = await getDom(targetUrl);

  await updSrcInDom(dom, 'ru.hexlet.io/', filesDir, 'link[rel="stylesheet"]', 'href');

  expect(
    getArrayFromHTML(dom.html())
      .filter((str) => str.includes('href'))
      .filter((d) => d !== 'href="/courses"'),
  ).toEqual(
    getArrayFromHTML(expected)
      .filter((str) => str.includes('href'))
      .filter((d) => d !== 'href="ru-hexlet-io-courses_files/ru-hexlet-io-courses.html"'),
  );
});

test('Test function updSrcInDom.  Should return a list of entries CSS [[filename.format, urlTODownload', async () => {
  const targetUrl = 'https://ru.hexlet.io/courses';
  const expected = await fsp.readFile(path.join('DomwithCSSandJsRes', 'DomwithCSSandJsRes.html'), 'utf-8');
  const htmlTest1 = await fsp.readFile(path.join('testDomwithCSSandJs', 'testDomwithCSSandJs.html'), 'utf-8');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlTest1)
    .get('/assets/professions/nodejs.png')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]))
    .get('/packs/js/runtime.js')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]));

  const filesDir = await createNameDir('ru.hexlet.io/courses', 'courses/');
  const dom = await getDom(targetUrl);

  await updSrcInDomJS(dom, 'ru.hexlet.io/', filesDir);

  expect(
    getArrayFromHTML(dom.html())
      .filter((str) => str.includes('src'))
      .filter((d) => !d.includes('.png')),
  ).toEqual(
    getArrayFromHTML(expected)
      .filter((str) => str.includes('src'))
      .filter((d) => !d.includes('.png')),
  );
});

test('Test function updHrefCanonicalInDom.  Should return a list of entries CSS [[filename.format, urlTODownload', async () => {
  const targetUrl = 'https://ru.hexlet.io/courses';
  const expected = await fsp.readFile(path.join('DomwithCSSandJsRes', 'DomwithCSSandJsRes.html'), 'utf-8');
  const htmlTest1 = await fsp.readFile(path.join('testDomwithCSSandJs', 'testDomwithCSSandJs.html'), 'utf-8');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlTest1)
    .get('/assets/professions/nodejs.png')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]))
    .get('/packs/js/runtime.js')
    .reply(200, Buffer.from([1, 2, 3, 4, 5]));

  const filesDir = await createNameDir('ru.hexlet.io/courses', 'courses/');
  const dom = await getDom(targetUrl);

  updHrefCanonicalInDom(dom, 'https://ru.hexlet.io/courses', '/courses', filesDir);

  expect(
    getArrayFromHTML(dom.html()).filter((str) => str === 'href="ru-hexlet-io-courses_files/ru-hexlet-io-courses.html"'),
  ).toEqual(
    getArrayFromHTML(expected).filter((str) => str === 'href="ru-hexlet-io-courses_files/ru-hexlet-io-courses.html"'),
  );
});
