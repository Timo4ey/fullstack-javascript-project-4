const getherElements = (element, attr = 'src') => {
  const newLocal = null;
  return Object.hasOwn(element, 'attribs') ? element.attribs[attr] : newLocal;
};

export default getherElements;
