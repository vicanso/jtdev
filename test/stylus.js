(function() {
  var assert, cssStr, fs, jsc, path, stylus, stylusFile;

  assert = require('assert');

  jsc = require('jscoverage');

  fs = require('fs');

  path = require('path');

  stylusFile = '../dest/stylus';

  if (process.env.NODE_ENV === 'cov') {
    stylus = jsc.require(module, stylusFile);
  } else {
    stylus = require(stylusFile);
  }

  cssStr = 'body {\n  font: 12px Helvetica, Arial, sans-serif;\n}\na.button {\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n}\n';

  describe('stylus', function() {
    return describe('#parser', function() {
      return it('should parser successful', function(done) {
        var buf, checkSuccess, completed, mockReq, mockRes, parser;
        buf = fs.readFileSync(path.join(__dirname, '../files/test.styl'));
        parser = stylus.parser(path.join(__dirname, '../files'));
        completed = 0;
        checkSuccess = function() {
          completed++;
          if (completed === 3) {
            return done();
          }
        };
        mockReq = {
          url: '/test.styl'
        };
        mockRes = {
          write: function(buf) {
            if (buf.toString() === cssStr) {
              return checkSuccess();
            }
          },
          end: function(buf) {},
          header: function(key, value) {
            if (key === 'Content-Length' && value === 144) {
              return checkSuccess();
            } else if (key === 'Content-Type' && value === 'text/css') {
              return checkSuccess();
            }
          }
        };
        parser(mockReq, mockRes, function() {});
        mockRes.write(buf.slice(0, 1));
        return mockRes.end(buf.slice(1));
      });
    });
  });

}).call(this);
