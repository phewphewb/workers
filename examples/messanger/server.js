const http = require("http");
const fs = require("fs");
const { getPath, file, getChunks } = require("./path");

const STATUS = {
  SUCCESS: 200,
  NOT_FOUND: 404,
};

const CONTENT_TYPES = {
  js: "application/javascript",
  html: "text/html; charset=UTF-8",
  css: "text/css",
};

const INDEX_FILES = ["messanger"];

const PORT = 8080;

http
  .createServer(async (req, res) => {
    const { url } = req;
    const chunks = getChunks(url, INDEX_FILES);
    const [path, last] = getPath(chunks);
    const [fileName, fileType] = file(last);
    console.log(path, fileName, fileType);
    try {
      const data = await fs.promises.readFile(path);
      const headers = {
        "Content-Type": CONTENT_TYPES[fileType],
      };
      res.writeHead(STATUS.SUCCESS, headers);
      res.end(data);
    } catch (e) {
      res.statusCode = STATUS.NOT_FOUND;
      res.end(`Not Found - ${last}`);
    }
  })
  .listen(PORT);

console.log(`SERVER STARTED ON ${PORT}`);
