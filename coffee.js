(function() {
  var async, coffeeScript, path;

  coffeeScript = require('coffee-script');

  async = require('async');

  path = require('path');

  module.exports.parser = function(filePath) {
    return function(req, res, next) {
      var bufLength, bufList, end, ext, write;
      process.nextTick(next);
      ext = path.extname(req.url);
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
          var buf, err, file, js, moduleStr, self, str;
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
          file = req.url.substring(0, req.url.length - ext.length);
          moduleStr = "module = GLOBAL_MODULES['" + file + "'] = {id : '" + file + "'}\nexports = module.exports = {}\n";
          str = moduleStr + str;
          try {
            js = coffeeScript.compile(str);
          } catch (_error) {
            err = _error;
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
