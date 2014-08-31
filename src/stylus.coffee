stylus = require 'stylus'
nib = require 'nib'
path = require 'path'
url = require 'url'
module.exports.parser = (staticPath) ->
  (req, res, next) ->
    process.nextTick next
    urlInfo = url.parse req.url
    ext = path.extname urlInfo.pathname
    if ext == '.styl'
      file = path.join staticPath, req.url
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
          if !res.headersSent
            end.call self
          return
        str = Buffer.concat(bufList, bufLength).toString encoding
        stylus(str).set('filename', file).use(nib()).render (err, css) ->
          throw err if err
          buf = new Buffer css, encoding
          res.header 'Content-Length', buf.length
          res.header 'Content-Type', 'text/css'
          write.call res, buf
          end.call res
    return
