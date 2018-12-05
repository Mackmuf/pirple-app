// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// HTTP Server
// The server should respond to request with a string
const server = http.createServer( (req, res) => {
  serverLogic(req, res);
});

// Start the server http and listen on port 3000
const port = config.httpport;
server.listen(port, () => {
  console.log(`Server is listening on port ${port} in ${config.envName} mode`);
});

// HTTPS Server
const httpsServerOption = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

const secureServer = https.createServer(httpsServerOption, (req, res) => {
  serverLogic(req, res);
});

// Start the server http and listen on port 3000
const securePort = config.httpsport;
secureServer.listen(securePort, () => {
  console.log(`Server is listening on port ${securePort} in ${config.envName} mode`);
});

// Logic for all request coming to the server
const serverLogic = (req, res) => {
  // Get URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObj = parsedUrl.query;

  // Get http method
  const method = req.method.toLowerCase();

  // Get headers as object
  const headers = req.headers;

  // Get he payload
  const decoder = new StringDecoder('utf-8');
  let payloadBuffer = '';
  req.on('data', (data) => {
    payloadBuffer += decoder.write(data);
  });
  req.on('end', () => {
    payloadBuffer += decoder.end();

    // Choose the right handlers, if not found send notFound handler
    const chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

    // Construct the data obj to send to the handler
    const data = {
      'path': path,
      'queryStringObj': queryStringObj,
      'method': method,
      'headers': headers,
      'payload': payloadBuffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Define the right Status code
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Define a payload if any return empty object
      payload = typeof(payload) == 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      /* console.log(`Request received on path: ${trimmedPath}`);
      console.log(`with method: ${method}`);
      console.log('query object is: ', queryStringObj);
      console.log('headers are: ', headers);
      console.log('request is received with a payload: ', payloadBuffer); */

    });

  });
};

// define handlers
var handlers = {};

// sample handler
handlers.sample = (data, callback) => {
  // Callback a http status code and a payload obj
  callback(406, {'name': 'sample'});
};

// Hello handler
handlers.hello = (data, callback) => {
  //const d = data
  callback(200, JSON.parse(data.payload));
};

// 404 handlers
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  'sample': handlers.sample,
  'hello': handlers.hello
}