assert = require 'assert'
jsc = require 'jscoverage'
fs = require 'fs'
path = require 'path'
stylusFile = '../dest/stylus'

if process.env.NODE_ENV == 'cov'
  stylus = jsc.require module, stylusFile
else
  stylus = require stylusFile

cssStr = 'body {\n  font: 12px Helvetica, Arial, sans-serif;\n}\na.button {\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n}\n'

describe 'stylus', ->
  describe '#parser', ->
    it 'should parser successful', (done) ->
      buf = fs.readFileSync path.join __dirname, '../files/test.styl'
      parser = stylus.parser path.join __dirname, '../files'
      completed = 0
      checkSuccess = ->
        completed++
        done() if completed == 3

      mockReq = 
        url : '/test.styl'
      mockRes = 
        write : (buf) ->
          checkSuccess() if buf.toString() == cssStr
        end : (buf) ->
        header : (key, value) ->
          if key == 'Content-Length' && value == 144
            checkSuccess()
          else if key == 'Content-Type' && value == 'text/css'
            checkSuccess()
      parser mockReq, mockRes, ->
      mockRes.write buf.slice 0, 1
      mockRes.end buf.slice 1

