var http = require("http");
var fs = require("fs");

const routes = {
    api: "/api",
};
var server = http.createServer((request, response) => {
    switch (request.url) {
        case routes.api: {
            var readStream = fs.createReadStream(`${__dirname}/src/data.json`, "utf8");
            response.writeHead(200, { "Content-Type": "application/json" });

            /**
             * Pipe the card data to a writable stream
             * to the response
             */
            readStream.pipe(response);
            break;
        }
        default: {
            var readStream = fs.createReadStream(`${__dirname}/src/index.html`, "utf8");

            response.writeHead(200, { "Content-Type": "text/html" });
            /**
             * Pipe from a readable stream to a writable stream
             * to the response
             */
            readStream.pipe(response);
            break;
        }
    }
});

server.listen(3000, "127.0.0.1");
