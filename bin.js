var fs = require('fs');

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
