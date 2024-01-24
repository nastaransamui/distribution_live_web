const chunkString = (str: string, length: number) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
};

export default chunkString;
