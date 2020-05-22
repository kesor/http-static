// based on https://nodejs.org/en/knowledge/HTTP/servers/how-to-serve-static-files/

const http = require('http'),
      fs = require('fs')

const PORT = process.env.PORT || '8080'

function handler(req, res) {
  const filename = __dirname + req.url
  let stat
  try {
    stat = fs.statSync(filename)
  } catch (err) {
    const resJSON = JSON.stringify(err)
    res.writeHead(404, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(resJSON)
    })
    return res.end(resJSON)
  }
  const fileSize = stat.size;
  const fileModTime = stat.mtime;
  const fileStream = fs.createReadStream(filename, { emitClose: true })
  res.writeHead(200, {
    'Content-Length': fileSize,
    'Last-Modified': fileModTime,
  })
  fileStream.pipe(res)
}

http.createServer(handler).listen(PORT)
