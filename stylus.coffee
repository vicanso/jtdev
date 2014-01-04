stylus = require 'stylus'
async = require 'async'
path = require 'path'
module.exports.parser = (filePath) ->
  (req, res, next) ->
    process.nextTick next
    ext = path.extname req.url
    if ext == '.styl'
      file = path.join filePath, req.url
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
        async.waterfall [
          (cbf) ->
            stylus.render str, {
              filename : file
            }, cbf
          (css, cbf) ->
            buf = new Buffer css, encoding
            res.header 'Content-Length', buf.length
            res.header 'Content-Type', 'text/css'
            write.call res, buf
            end.call res
        ], (err) ->
          throw err if err
