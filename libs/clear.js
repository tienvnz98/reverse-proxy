const clearEmptyField = (data) => {
  if (!(data instanceof Array) && (data instanceof Object)) {
    const keys = Object.keys(data);

    for (const key of keys) {
      if (data[key] === undefined) {
        delete data[key];
      } else if (!(data instanceof Array) && (data instanceof Object)) {
        clearEmptyField(data[key]);
      }
    }
  }
  return data;
}
module.exports.clearEmptyField = clearEmptyField;