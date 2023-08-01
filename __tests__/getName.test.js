import getName from '../src/loaders/getName.js';

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

test('Test function getName. Test double slash. Should return a string that with replaced dots and user scores to -', async () => {
  const expected = 'asserts-professions-nodejs.png';
  const testData = '//asserts/professions/nodejs.png';

  const result = await getName(testData);
  expect(result).toEqual(expected);
  expect(typeof result).toEqual('string');
});

test('Test function getName. Test http://. Should return a string that with replaced dots and user scores to -', async () => {
  const expected = 'asserts-professions-nodejs.png';
  const testData = 'http://asserts/professions/nodejs.png';

  const result = await getName(testData);
  expect(result).toEqual(expected);
  expect(typeof result).toEqual('string');
});

test('Test function getName. Test single slash. Should return a string that with replaced dots and user scores to -', async () => {
  const expected = 'asserts-professions-nodejs.png';
  const testData = '/asserts/professions/nodejs.png';

  const result = await getName(testData);
  expect(result).toEqual(expected);
  expect(typeof result).toEqual('string');
});
