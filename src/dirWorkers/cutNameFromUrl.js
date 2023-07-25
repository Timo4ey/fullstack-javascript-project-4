const cutNameFromUrl = (url, format = 'html') => {
  const obj = new URL(url);
  /*
  Response a new name
  */
  return `${obj.hostname.replace(/\./g, '-')}-${obj.pathname.slice(1)}.${format}`;
};

export default cutNameFromUrl;
