const http = require("http");
const fs = require("fs");

const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(`"${message}"`);
};

const httpHeaders = (res, status, headers) => {
  res.writeHead(status, headers);
};

const contentTypes = {
  js: "application/javascript",
  html: "text/html; charset=UTF-8",
  css: "text/css",
};

http
  .createServer(async (req, res) => {
    const url = req.url === "/" ? "/index.html" : req.url;
    const [first, second] = url.substring(1).split("/");
    let path = "./static/" + first;
    if (second) {
      path += `/${second}`;
    }
    console.log(path)
    const [fileName, fileType] = (second || first).split(".");
    try {
      const data = await fs.promises.readFile(path);
      httpHeaders(res, 200, {
        "Content-Type": contentTypes[fileType],
      });
      res.end(data);
    } catch (e) {
      httpError(res, 404, "Not Found");
    }
  })
  .listen(8080);

console.log("SERVER STARTED ON 8080");
