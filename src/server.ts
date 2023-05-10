import fastify from 'fastify'
import { env } from './env'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('running!')
  })
