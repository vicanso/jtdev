coffeeScript = require 'coffee-script'
async = require 'async'
path = require 'path'
url = require 'url'
querystring = require 'querystring'
module.exports.parser = (filePath) ->
  (req, res, next) ->
    process.nextTick next
    urlInfo = url.parse req.url
    ext = path.extname urlInfo.pathname
    if ext == '.coffee'
      write = res.write
      end = res.end
      bufList = []
      bufLength = 0
      res.write = (chunk, encoding) ->
        bufList.push chunk
        bufLength += chunk.length
      res.end = (chunk, encoding) ->
        self = @
        if Buffer.isBuffer chunk
          bufList.push chunk
          bufLength += chunk.length
        if !bufLength
          if !res.headerSent
            end.call self
          return
        try
          js = coffeeScript.compile Buffer.concat(bufList, bufLength).toString encoding
        catch err
          throw err if err
          return
        buf = new Buffer js, encoding
        res.header 'Content-Length', buf.length
        res.header 'Content-Type', 'application/javascript'
        write.call res, buf
        end.call res
