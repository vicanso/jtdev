"use strict";
var path = require('path');
var fs = require('fs');
var url = require('url');
var convertExts = {
  'js' : 'coffee',
  'css' : 'styl'
};

exports.converter = function(staticPath){
  return function(req, res, next){
    var urlInfo = url.parse(req.url);
    var file = path.join(staticPath, urlInfo.pathname);
    var ext = path.extname(file).substring(1);
    var destExt = convertExts[ext];
    if(destExt){
      fs.exists(file, function(exists){
        if(exists){
          next();
        }else{
          req.url = req.url.replace(('.' + ext), ('.' + destExt));
          req.originalUrl = req.originalUrl.replace(('.' + ext), ('.' + destExt));
          next();
        }
      });
    }else{
      next();
    }
  };
};