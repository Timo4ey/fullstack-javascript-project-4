import mock from 'mock-fs';
import fsp from 'fs/promises';
import path from 'path';
import createFile from '../src/dirWorkers/createFile.js';
import cutNameFromUrl from '../src/dirWorkers/cutNameFromUrl.js';
import createDirectory from '../src/dirWorkers/createDirectory.js';

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
describe('Tests functions that CRUD files and directories', () => {
  test('Should create file', async () => {
    const expected = ['index.md', 'var'];
    createFile('index.md', 'app/', '');

    const result = await fsp.readdir(path.join(process.cwd(), 'app'));
    expect(result).toEqual(expected);
  });

  test('Should return name with extension', async () => {
    const result = await cutNameFromUrl('https://ru.hexlet.io/courses');
    const expeted = 'ru-hexlet-io-courses.html';
    expect(result).toEqual(expeted);
  });
});
test('Should create a dir', async () => {
  await createDirectory('ru-hexlet-io-courses', '');
  const result = await fsp.readdir(path.join(`${process.cwd()}`));
  expect(result.includes('ru-hexlet-io-courses_files')).toBeTruthy();
});
