(function() {
  var coffeeScript, path, querystring, url;

  coffeeScript = require('coffee-script');

  path = require('path');

  url = require('url');

  querystring = require('querystring');

  module.exports.parser = function() {
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
        res.end = function(chunk, encoding) {
          var buf, err, js, self;
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
          try {
            js = coffeeScript.compile(Buffer.concat(bufList, bufLength).toString(encoding));
          } catch (_error) {
            err = _error;
            console.error("*****ERROR*****");
            console.error("file:" + urlInfo.pathname);
            console.error("line:" + err.location.first_line);
            throw err;
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
