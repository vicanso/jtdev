(function() {
  var async, coffeeScript, path, querystring, url;

  coffeeScript = require('coffee-script');

  async = require('async');

  path = require('path');

  url = require('url');

  querystring = require('querystring');

  module.exports.parser = function(filePath) {
    return function(req, res, next) {
      var bufLength, bufList, end, ext, urlInfo, write;
      process.nextTick(next);
      urlInfo = url.parse(req.url);
      ext = path.extname(urlInfo.pathname);
      if (ext === '.coffee') {
        write = res.write;
        end = res.end;
        bufList = [];
        bufLength = 0;
        res.write = function(chunk, encoding) {
          bufList.push(chunk);
          return bufLength += chunk.length;
        };
        return res.end = function(chunk, encoding) {
          var buf, js, self;
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
          try {
            js = coffeeScript.compile(Buffer.concat(bufList, bufLength).toString(encoding));
          } catch (err) {
            if (err) {
              throw err;
            }
            return;
          }
          buf = new Buffer(js, encoding);
          res.header('Content-Length', buf.length);
          res.header('Content-Type', 'application/javascript');
          write.call(res, buf);
          return end.call(res);
        };
      }
    };
  };

}).call(this);
