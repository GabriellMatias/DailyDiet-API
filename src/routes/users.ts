import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })
    const { name } = createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 4, // 4 days
      })
    }

    await knex('users').insert({
      id: sessionId,
      name,
    })

    return reply.status(201).send()
  })
}
