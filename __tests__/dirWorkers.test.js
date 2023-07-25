import mock from 'mock-fs';
import fsp from 'fs/promises';
import path from 'path';
import checkFolder from '../src/dirWorkers/createFolder.js';
import createFile from '../src/dirWorkers/createFile.js';
import cutNameFromUrl from '../src/dirWorkers/cutNameFromUrl.js';

beforeEach(async () => {
  mock({
    app: {
      var: { tmp: {} },
    },
  });
});
afterAll(async () => {
  mock.restore();
});
describe('modifyFile script', () => {
  test('Should read file and print', async () => {
    const expected = ['index.md', 'var'];
    createFile('index.md', 'app/', '');

    const result = await fsp.readdir(path.join(process.cwd(), 'app'));
    expect(result).toEqual(expected);
  });
  test('Should create a dir in folder', async () => {
    checkFolder();
    const expected = ['app'];

    const result = await fsp.readdir(process.cwd());

    expect(result).toEqual(expected);
  });
  test('Should return name with extension', async () => {
    const result = await cutNameFromUrl('https://ru.hexlet.io/courses');
    const expeted = 'ru-hexlet-io-courses.html';
    expect(result).toEqual(expeted);
  });
});
