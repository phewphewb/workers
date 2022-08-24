const path = require("path");

const BASE = "./build/";
const DEAFULT_TYPE = "html";

const getChunks = (url, ends) => {
  const chunks = url.substring(1).split("/");
  const last = chunks.pop();
  const index = url.endsWith("/") ? ends[0] : ends.find((value) => url.endsWith(value));
  if (index) chunks.push(`${index}.${DEAFULT_TYPE}`);
  else chunks.push(last);
  return chunks;
};

const getPath = (chunks, options = {}) => {
  const { base = BASE } = options;
  const absolute_path = path.resolve(__dirname, `${base}${chunks.join("/")}`);
  const last = chunks.pop();
  return [absolute_path, last];
};

const file = (name) => {
  const index = name.lastIndexOf(".");
  const fileName = name.substring(0, index);
  const fileType = name.substring(index + 1);
  return [fileName, fileType];
};

module.exports = { getPath, file, getChunks };
