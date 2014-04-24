(function() {
  var convertExts, fs, path, url;

  path = require('path');

  fs = require('fs');

  url = require('url');

  convertExts = {
    'js': 'coffee',
    'css': 'styl'
  };

  module.exports.converter = function(staticPath) {
    return function(req, res, next) {
      var destExt, ext, file, urlInfo;
      urlInfo = url.parse(req.url);
      file = path.join(staticPath, urlInfo.pathname);
      ext = path.extname(file).substring(1);
      destExt = convertExts[ext];
      if (destExt) {
        return fs.exists(file, function(exists) {
          if (exists) {
            return next();
          } else {
            req.url = req.url.replace("." + ext, "." + destExt);
            req.originalUrl = req.originalUrl.replace("." + ext, "." + destExt);
            return next();
          }
        });
      } else {
        return next();
      }
    };
  };

}).call(this);
