//another support library
const http = require('http');

//start server
http.createServer((request, response) => {
    const { method, url } = request;
    response.writeHead(200, {'Content-Type': 'application/json'});

    //there is no IE9 javscript engine. You can use all moder javascript stuf. Like template string!
    response.write(`{"message": "You just send a ${method} request with context path '${url}'"}`);
    console.log(url);
    response.end();
}).listen(8080);

console.log("Server started at: http://localhost:8080");
