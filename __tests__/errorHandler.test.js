import errorHandler from '../src/errorHandlers/errorHandler.js';

test("Should'nt return  return an exception if pass an argument", async () => {
  expect.assertions(0);
  try {
    errorHandler('');
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('Should return an exception if pass an argument', async () => {
  expect.assertions(0);
  try {
    errorHandler('');
  } catch (e) {
    expect(e.message).toEqual('Request failed with status code 404');
  }
});
