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

var request = function (url) {
  return function (size) {
    var req = hyperquest(url);
    req.setHeader('Range', 'bytes=' + size + '-');
    req.on('response', console.log);
  };
};
