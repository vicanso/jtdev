assert = require 'assert'
jsc = require 'jscoverage'
fs = require 'fs'
path = require 'path'
extFile = '../dest/ext'

if process.env.NODE_ENV == 'cov'
  ext = jsc.require module, extFile
else
  ext = require extFile

describe 'ext', ->
  describe '#converter', ->
    it 'should convert successful', (done) ->
      fileUrl = 'http://vicanso.com/test.js'
      converter = ext.converter path.join __dirname, '../files'
      mockReq = 
        url : fileUrl
        originalUrl : fileUrl
      converter mockReq, {}, ->
        if mockReq.url == mockReq.originalUrl && mockReq.url == fileUrl.replace '.js', '.coffee'
          done()
        else
          done new Error 'covert ext fail!'