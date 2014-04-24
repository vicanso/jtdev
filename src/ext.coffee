path = require 'path'
fs = require 'fs'
url = require 'url'
convertExts = 
  'js' : 'coffee'
  'css' : 'styl'

module.exports.converter = (staticPath) ->
  (req, res, next) ->
    urlInfo = url.parse req.url
    file = path.join staticPath, urlInfo.pathname
    ext = path.extname(file).substring 1
    destExt = convertExts[ext]
    if destExt
      fs.exists file, (exists) ->
        if exists
          next()
        else
          req.url = req.url.replace ".#{ext}", ".#{destExt}"
          req.originalUrl = req.originalUrl.replace ".#{ext}", ".#{destExt}"
          next()
    else
      next()
