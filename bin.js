var fileName = function (url) {
  return url.split('/').pop() || 'index.html';
};
