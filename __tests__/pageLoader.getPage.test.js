import fsp from 'fs/promises';
import nock from 'nock';
import path from 'path';
import mock from 'mock-fs';

import { getPage } from '../src/pageLoader/pageLoader.js';

beforeEach(async () => {
  mock({
    app: {},
    var: { tmp: { 'ru-hexlet-io3.html': mock.load(path.join(process.cwd(), '/__fixtures__/ru-hexlet-io.html')) } },
  });
});
afterAll(async () => {
  mock.restore();
});
describe('getPage', () => {
  test('getUser when empty', async () => {
    const targetUrl = 'https://ru.hexlet.io/courses';
    const htmlTest1 = await fsp.readFile(path.join('var', 'tmp', 'ru-hexlet-io3.html'), 'utf-8');
    nock('https://ru.hexlet.io').get('/courses').reply(200, htmlTest1);

    await getPage(targetUrl, 'app/');
    const result = await fsp.readFile('app/ru-hexlet-io-courses.html', 'utf-8');
    expect(result).toEqual(htmlTest1);
  });
});
