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
    if (req.url === '/') {
        fs.readFile('index.html', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('error occurred while reading the file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        })
    } else {
        res.writeHead(404);
        res.end('Page not found');
    }
    
}).listen(port);
