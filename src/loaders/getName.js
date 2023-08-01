export default function getName(name) {
  const updName = !name.startsWith('//') && !name.startsWith('http') ? name : name.split('//').at(-1);
  // eslint-disable-next-line no-useless-escape
  const newName = updName.replace(/[\/\._]/g, '-').split('-');
  const forMAt = newName.at(-1);
  const newFormat = `${newName.slice(0, newName.length - 1).join('-')}.${forMAt}`.replace(/--/g, '-');
  return newFormat.startsWith('-') ? newFormat.slice(1) : newFormat;
}
