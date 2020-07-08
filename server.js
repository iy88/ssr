const express = require('express')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const bodyParse = require('body-parser');
const compression = require('compression');
app.use(compression());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.disable('x-powered-by');
app.prepare().then(() => {
  const server = express()

  server.get('/',(req,res)=>{
    return app.render(req,res,req.originalUrl,req.query);
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port,'0.0.0.0', (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})