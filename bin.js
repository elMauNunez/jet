var fs = require('fs');
var hyperquest = require('hyperquest');

var fileName = function (url) {
  return url.split('/').pop() || 'index.html';
};

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

var handleData = function (size, name) {
  return function (data) {
    console.log(data);
  };
};

var handleResponse = function (size, name) {
  return function (res) {
    if (badStatus(res.statusCode)) throw res.statusMessage;
    var totalFileSize = size + Number(res.headers['content-length']);
    res.on('data', handleData(totalFileSize, name));
  };
};

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
