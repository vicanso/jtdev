(function() {
  var convertExts, fs, path;

  path = require('path');

  fs = require('fs');

  convertExts = {
    'js': 'coffee',
    'css': 'styl'
  };

  module.exports.converter = function(staticPath) {
    return function(req, res, next) {
      var destExt, ext, file;
      file = path.join(staticPath, req.url);
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
