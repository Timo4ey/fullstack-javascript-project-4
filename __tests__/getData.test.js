import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { getData } from '../src/loaders/getData.js';
import { getSrc } from '../src/loaders/getScripts.js';
import getDom from '../src/loaders/getDom.js';
import { arrangeLinks } from '../src/loaders/arrangeLinks.js';
import axiosInt from '../src/debug/debuger.js';

axiosInt();

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

describe('getData', () => {
  test('Test function getData.  Should return a list of entries [[filename.format, data]]', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    // const expected = await fsp.readFile(path.join('var', 'after', 'ru-hexlet-io3.html'), 'utf-8');
    const htmlTest1 = await fsp.readFile(path.join('var', 'before', 'before_ru-hexlet-io3.html'), 'utf-8');
    const picture = await fsp.readFile(path.join('picture.png'), 'utf-8');
    const expected = [{ title: 'ru-hexlet-io-assets-professions-nodejs.png', task: () => Promise.resolve({}) }];

    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);
    nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, picture);
    const dom = await getDom(targetUrl);
    const links = await getSrc(dom);
    const arrangedLinks = await arrangeLinks(links, host);
    const result = await getData(arrangedLinks);

    expect(result[0].title).toEqual(expected[0].title);
  });
});
