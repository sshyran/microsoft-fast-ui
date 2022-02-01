var http = require("http");
var fs = require("fs");

var server = http.createServer((request, response) => {
    var readStream = fs.createReadStream(`${__dirname}/src/index.html`, "utf8");

    response.writeHead(200, { "Content-Type": "text/html" });
    /**
     * Pipe from a readable stream to a writable stream
     * in this case the response
     */
    readStream.pipe(response);
});

server.listen(3000, "127.0.0.1");
