const getFnBody = (string) =>
  string.substring(string.indexOf("{") + 1, string.lastIndexOf("}"));
const getParams = (string) =>
  string.substring(string.indexOf("(") + 1, string.indexOf(")"));

export default class Task {
  constructor(fn, data) {
    const fnString = fn.toString();
    this.body = getFnBody(fnString);
    this.params = getParams(fnString);
    this.args = data;
  }
}
