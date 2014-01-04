(function() {
  var async, path, stylus;

  stylus = require('stylus');

  async = require('async');

  path = require('path');

  module.exports.parser = function(filePath) {
    return function(req, res, next) {
      var bufLength, bufList, end, ext, file, write;
      process.nextTick(next);
      ext = path.extname(req.url);
      if (ext === '.styl') {
        file = path.join(filePath, req.url);
        write = res.write;
        end = res.end;
        bufList = [];
        bufLength = 0;
        res.write = function(chunk, encoding) {
          bufList.push(chunk);
          return bufLength += chunk.length;
        };
        return res.end = function(chunk, encoding) {
          var self, str;
          self = this;
          if (Buffer.isBuffer(chunk)) {
            bufList.push(chunk);
            bufLength += chunk.length;
          }
          if (!bufLength) {
            if (!res.headerSent) {
              end.call(self);
            }
            return;
          }
          str = Buffer.concat(bufList, bufLength).toString(encoding);
          return async.waterfall([
            function(cbf) {
              return stylus.render(str, {
                filename: file
              }, cbf);
            }, function(css, cbf) {
              var buf;
              buf = new Buffer(css, encoding);
              res.header('Content-Length', buf.length);
              res.header('Content-Type', 'text/css');
              write.call(res, buf);
              return end.call(res);
            }
          ], function(err) {
            if (err) {
              throw err;
            }
          });
        };
      }
    };
  };

}).call(this);
