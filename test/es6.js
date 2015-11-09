'use strict';
const assert = require('assert');
const path = require('path');
const es6 = require('../lib/es6');
const util = require('util');


function execGenerator(g, arr, v, cb) {
  if (util.isFunction(arr)) {
    cb = arr;
    arr = [];
    v = null;
  }
  // console.dir(v);
  let result = g.next(v);
  console.dir(result);
  if (!result.done) {
    result.value.then(function(v) {
      execGenerator(g, arr, v, cb);
    }, cb);
  } else {
    cb(null, arr);
  }
}

describe('es6 parse', function() {
  it('should parse es6 file success', function(done) {
    let file = path.join(__dirname, '../files/test.js');
    let g = es6(file);
    let result = [];
    execGenerator(g, function(err, result) {
      if (err) {
        done(err);
      } else {
        console.dir(result);

      }
    });
    // g.next().value.then(function(readable) {
    //   assert.equal(readable, false);
    //   g.next(readable).value.then(function(readable) {
    //     assert.equal(readable, false);
    //   }, done);
    // }, done);
  });
});