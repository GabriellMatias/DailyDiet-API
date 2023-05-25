import fastify from 'fastify'
import { env } from './env'
import fastifyCookie from '@fastify/cookie'
import { userRoutes } from './routes/users'
import { dietRoutes } from './routes/diets'

const app = fastify()

app.register(fastifyCookie)

app.register(userRoutes, {
  prefix: 'user',
})
app.register(dietRoutes, {
  prefix: 'diets',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('running!')
  })
