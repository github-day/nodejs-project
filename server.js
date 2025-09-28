'use strict';
var http = require('http');
const fs = require('node:fs');
const NodeRSA = require('node-rsa');
var port = process.env.PORT || 1337;

const key = new NodeRSA({ b: 2048 });

const enc = key.encrypt('hello', 'base64');

const dec = key.decrypt(enc,'utf8')

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(enc);
    res.write('\n');
    res.write(key.exportKey('pkcs8-public-pem'));
    res.end('Hello World\n');
    
}).listen(port);
