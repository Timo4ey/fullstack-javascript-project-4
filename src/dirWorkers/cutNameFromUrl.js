const cutNameFromUrl = (url, format = 'html') => {
  const obj = new URL(url);
  // const fullHostName = obj.length > 0 ? `${obj.host}${obj.pathname}` : obj.host;
  /*
  Response a new name
  */
  return `${obj.host.replace(/\./g, '-')}-${obj.pathname.slice(1)}.${format}`;
};

export default cutNameFromUrl;
