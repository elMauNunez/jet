#!/usr/bin/env node

var fs = require('fs');
var hyperquest = require('hyperquest');

var fileName = function (url) {
  return url.split('/').pop() || 'index.html';
};

// Pass the size of a file to a callback function.
var fileSize = function (name, callback) {
  fs.stat(name, function (err, stats) {
    if (!stats)
      return callback(0);

    return callback(stats.size);
  });
};

var badStatus = function (statusCode) {
  return Number(statusCode) >= 400;
};

var fileAppend = function (name, data) {
  fs.appendFile(name, data, function (err) {
    if (err) throw 'Cannot write ' + name;
  });
};


// Given the current size, the name and the remaining size of a file, makes a
// function that handle the data returned by the server, writing the contents
// to the file and printing the download progreess.
var handleData = function (currentSize, remainingSize, name) {
  var totalSize = currentSize + remainingSize;
  var accumulator = currentSize;
  return function (data) {
    accumulator += data.length;
    console.log(parseInt(accumulator / totalSize * 100) + '%');
    fileAppend(name, data);
  };
};

// Given the size and the name of a file, makes a function that handles an
// HTTP(S) response, validating it status code and handling its 'data' event.
var handleResponse = function (size, name) {
  return function (res) {
    if (badStatus(res.statusCode)) throw res.statusMessage;
    var remainingSize = Number(res.headers['content-length']);
    res.on('data', handleData(size, remainingSize, name));
  };
};

// Given a URL and the name of a file, makes a function that given the size of a
// a file, makes an HTTP(S) request and handles the 'response' event.
var request = function (url, name) {
  return function (size) {
    var req = hyperquest(url);
    req.setHeader('Range', 'bytes=' + size + '-');
    req.on('response', handleResponse(size, name));
  };
};

var get = function (url) {
  var name = fileName(url);
  fileSize(name, request(url, name));
};

get(process.argv[2]);
