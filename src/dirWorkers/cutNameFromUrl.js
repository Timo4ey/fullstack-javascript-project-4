const cutNameFromUrl = (url, format = 'html') => {
  const obj = new URL(url);
  // const fullHostName = obj.length > 0 ? `${obj.host}${obj.pathname}` : obj.host;
  /*
  Response a new name
  */
  const name = `${obj.host.replace(/\./g, '-')}-${obj.pathname.slice(1).replace(/\./g, '-')}`.replace(/\./g, '-');
  return `${name}.${format}`;
};

export default cutNameFromUrl;
