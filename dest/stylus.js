(function() {
  var nib, path, stylus, url;

  stylus = require('stylus');

  nib = require('nib');

  path = require('path');

  url = require('url');

  module.exports.parser = function(staticPath, options) {
    if (options == null) {
      options = {};
    }
    return function(req, res, next) {
      var bufLength, bufList, end, ext, file, urlInfo, write;
      process.nextTick(next);
      urlInfo = url.parse(req.url);
      ext = path.extname(urlInfo.pathname);
      if (ext === '.styl') {
        file = path.join(staticPath, req.url);
        write = res.write;
        end = res.end;
        bufList = [];
        bufLength = 0;
        res.write = function(chunk, encoding) {
          bufList.push(chunk);
          return bufLength += chunk.length;
        };
        res.end = function(chunk, encoding) {
          var self, str;
          self = this;
          if (Buffer.isBuffer(chunk)) {
            bufList.push(chunk);
            bufLength += chunk.length;
          }
          if (!bufLength) {
            if (!res.headersSent) {
              end.call(self);
            }
            return;
          }
          str = Buffer.concat(bufList, bufLength).toString(encoding);
          return stylus(str, options).set('filename', file).use(nib()).render(function(err, css) {
            var buf;
            if (err) {
              throw err;
            }
            buf = new Buffer(css, encoding);
            res.header('Content-Length', buf.length);
            res.header('Content-Type', 'text/css');
            write.call(res, buf);
            return end.call(res);
          });
        };
      }
    };
  };

}).call(this);
