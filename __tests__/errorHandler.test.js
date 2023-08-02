import errorHandler from '../src/errorHandlers/errorHandler.js';
import axiosInt from '../src/debug/debuger.js';
import nock from 'nock';
import getDom from '../src/loaders/getDom.js';

axiosInt();

test('Should return an exception if pass an argument', async () => {
  expect.assertions(0);
  try {
    errorHandler('');
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Test function getData.  Should return a list of entries [[filename.format, data]]', async () => {
  const targetUrl = 'https://ru.hexlet.io/courses';
  // const expected = await fsp.readFile(path.join('var', 'after', 'ru-hexlet-io3.html'), 'utf-8');

  nock('https://ru.hexlet.io').get('/courses').reply(404, 'Bad requst');
  expect.assertions(0);
  try {
    errorHandler('');
  } catch (e) {
    expect(e.message).toEqual('Request failed with status code 404');
  }
});
