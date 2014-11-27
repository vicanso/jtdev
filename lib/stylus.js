"use strict";
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
var url = require('url');

exports.parser = function(staticPath, options){

  options = options || {};
  return function(req, res, next){
    GLOBAL.setImmediate(next);
    var urlInfo = url.parse(req.url);
    var ext = path.extname(urlInfo.pathname);
    if(ext !== '.styl'){
      return;
    }
    var file = path.join(staticPath, req.url);
    var write = res.write;
    var end = res.end;
    var bufList = [];
    var bufLength = 0;
    res.write = function(chunk, encoding){
      bufList.push(chunk);
      bufLength += chunk.length;
    };
    res.end = function(chunk, encoding){
      if(Buffer.isBuffer(chunk)){
        bufList.push(chunk);
        bufLength += chunk.length;
      }
      if(!bufLength){
        if(!res.headersSent){
          end.call(res);
        }
        return;
      }
      var str = Buffer.concat(bufList, bufLength).toString(encoding);
      stylus(str, options).set('filename', file).use(nib()).render(function(err, css){
        if(err){
          throw err;
        }
        var buf = new Buffer(css, encoding);
        res.set({
          'Content-Length' : buf.length,
          'Content-Type' : 'text/css'
        });
        write.call(res, buf);
        end.call(res);
      });
    };
  };
  
};