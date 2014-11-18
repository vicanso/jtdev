"use strict";
var path = require('path');
var assert = require('assert');
var ext = require('../lib/ext');
var stylus = require('../lib/stylus');
var coffee = require('../lib/coffee');
var express = require('express');
var request = require('request');
var app = express();
var staticPath = path.join(__dirname, '../files');
app.use('/static', ext.converter(staticPath));
app.use('/static', stylus.parser(staticPath));
app.use('/static', coffee.parser(staticPath));
app.use('/static', express.static(staticPath));
var server = app.listen(8000);

var urlPrefix = 'http://localhost:8000';
describe('ext', function(){
  describe('converter', function(){
    it('should convert ext success', function(done){
      request.get(urlPrefix + '/static/test.css', function(err, res, data){
        if(data === 'body {\n  font: 12px Helvetica, Arial, sans-serif;\n}\na.button {\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n}\n'){
          done();
        }else{
          done(new Error('converter fail'))
        }
      });
    });
  });
});


describe('stylus', function(){
  describe('parser', function(){
    it('should parser stylus to css success', function(done){
      request.get(urlPrefix + '/static/test.css', function(err, res, data){
        if(data === 'body {\n  font: 12px Helvetica, Arial, sans-serif;\n}\na.button {\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n}\n'){
          done();
        }else{
          done(new Error('parser fail'))
        }
      });
    });
  });
});


describe('coffee', function(){
  describe('parser', function(){
    it('should parser coffee to js success', function(done){
      request.get(urlPrefix + '/static/test.coffee', function(err, res, data){
        if(data === '(function() {\n  var test;\n\n  test = function() {\n    return console.dir(\'...\');\n  };\n\n}).call(this);\n'){
          done();
        }else{
          done(new Error('parser fail'))
        }
        server.close();
      });
    });
  });
});
