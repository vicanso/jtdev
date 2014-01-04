coffeeScript = require 'coffee-script'
async = require 'async'
path = require 'path'
module.exports.parser = (filePath) ->
  (req, res, next) ->
    process.nextTick next
    ext = path.extname req.url
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
        str = Buffer.concat(bufList, bufLength).toString encoding
        file = req.url.substring 0 , req.url.length - ext.length
        # if file != '/base/javascripts/module'
        moduleStr = "module = GLOBAL_MODULES['#{file}'] = {id : '#{file}'}\nexports = module.exports = {}\n"
        str = moduleStr + str
        try
          js = coffeeScript.compile str
        catch err
          throw err if err
          return
        buf = new Buffer js, encoding
        res.header 'Content-Length', buf.length
        res.header 'Content-Type', 'application/javascript'
        write.call res, buf
        end.call res
