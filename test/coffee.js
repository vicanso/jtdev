(function() {
  var assert, coffee, coffeeFile, fs, jsStr, jsc, path;

  assert = require('assert');

  jsc = require('jscoverage');

  fs = require('fs');

  path = require('path');

  coffeeFile = '../dest/coffee';

  if (process.env.NODE_ENV === 'cov') {
    coffee = jsc.require(module, coffeeFile);
  } else {
    coffee = require(coffeeFile);
  }

  jsStr = '(function() {\n  var test;\n\n  test = function() {\n    return console.dir(\'...\');\n  };\n\n}).call(this);\n';

  describe('coffee', function() {
    return describe('#parser', function() {
      return it('should parser successful', function(done) {
        var buf, checkSuccess, completed, mockReq, mockRes, parser;
        buf = fs.readFileSync(path.join(__dirname, '../files/test.coffee'));
        parser = coffee.parser();
        completed = 0;
        checkSuccess = function() {
          completed++;
          if (completed === 3) {
            return done();
          }
        };
        mockReq = {
          url: '/test.coffee'
        };
        mockRes = {
          write: function(buf) {
            if (buf.toString() === jsStr) {
              return checkSuccess();
            }
          },
          end: function() {},
          header: function(key, value) {
            if (key === 'Content-Length' && value === 101) {
              return checkSuccess();
            } else if (key === 'Content-Type' && value === 'application/javascript') {
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
