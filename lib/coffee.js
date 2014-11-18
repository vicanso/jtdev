"use strict";
var coffeeScript = require('coffee-script');
var path = require('path');
var url = require('url');
var querystring = require('querystring');

exports.parser = function(staticPath){
  return function(req, res, next){
    GLOBAL.setImmediate(next);
    var urlInfo = url.parse(req.url);
    var ext = path.extname(urlInfo.pathname);
    if(ext !== '.coffee'){
      return;
    }
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
      var js = '';
      try{
        js = coffeeScript.compile(Buffer.concat(bufList, bufLength).toString(encoding));
      }catch(err){
        console.error("*****ERROR*****");
        console.error('file:' + urlInfo.pathname);
        console.error('line:' + err.location.first_line);
        throw err;
      }
      var buf = new Buffer(js, encoding);
      res.set({
        'Content-Length' : buf.length,
        'Content-Type' : 'application/javascript'
      });
      write.call(res, buf);
      end.call(res);
    };
  };
};