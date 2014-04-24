(function() {
  var assert, ext, extFile, fs, jsc, path;

  assert = require('assert');

  jsc = require('jscoverage');

  fs = require('fs');

  path = require('path');

  extFile = '../dest/ext';

  if (process.env.NODE_ENV === 'cov') {
    ext = jsc.require(module, extFile);
  } else {
    ext = require(extFile);
  }

  describe('ext', function() {
    return describe('#converter', function() {
      return it('should convert successful', function(done) {
        var converter, fileUrl, mockReq;
        fileUrl = 'http://vicanso.com/test.js';
        converter = ext.converter(path.join(__dirname, '../files'));
        mockReq = {
          url: fileUrl,
          originalUrl: fileUrl
        };
        return converter(mockReq, {}, function() {
          if (mockReq.url === mockReq.originalUrl && mockReq.url === fileUrl.replace('.js', '.coffee')) {
            return done();
          } else {
            return done(new Error('covert ext fail!'));
          }
        });
      });
    });
  });

}).call(this);
