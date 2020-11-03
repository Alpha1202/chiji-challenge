import 'regenerator-runtime/runtime'
import express from 'express'

import middlewareConfig from './db/middlewares'
import config from './db/config/config'

const { port } = config

const app = express()
middlewareConfig(app)

const routes = []

routes.map((route) => app.use('/api/v1', route))

app.all('*', (req, res) =>
  res.status(404).send({
    status: 'error',
    message: 'Aliens ate this route',
  }),
)

app
  .listen(port, () => console.log(`Welcome, listening to ${port}`))
  .on('error', (err) => {
    if (err.syscall !== 'listen') {
      throw err
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
    // handle specific listen errors with friendly messages

    switch (err.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw err
    }
  })
