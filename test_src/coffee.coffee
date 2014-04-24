assert = require 'assert'
jsc = require 'jscoverage'
fs = require 'fs'
path = require 'path'
coffeeFile = '../dest/coffee'

if process.env.NODE_ENV == 'cov'
  coffee = jsc.require module, coffeeFile
else
  coffee = require coffeeFile

jsStr = '(function() {\n  var test;\n\n  test = function() {\n    return console.dir(\'...\');\n  };\n\n}).call(this);\n'

describe 'coffee', ->
  describe '#parser', ->
    it 'should parser successful', (done) ->
      buf = fs.readFileSync path.join __dirname, '../files/test.coffee'
      parser = coffee.parser()
      completed = 0
      checkSuccess = ->
        completed++
        done() if completed == 3
      mockReq = 
        url : '/test.coffee'
      mockRes = 
        write : (buf) ->
          checkSuccess() if buf.toString() == jsStr
        end : ->
        header : (key, value) ->
          if key == 'Content-Length' && value == 101
            checkSuccess()
          else if key == 'Content-Type' && value == 'application/javascript'
            checkSuccess()
      parser mockReq, mockRes, ->
      mockRes.write buf.slice 0, 1
      mockRes.end buf.slice 1