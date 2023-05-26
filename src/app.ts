import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { userRoutes } from './routes/users'
import { dietRoutes } from './routes/diets'

export const app = fastify()

app.register(fastifyCookie)

app.register(userRoutes, {
  prefix: 'user',
})
app.register(dietRoutes, {
  prefix: 'diets',
})
