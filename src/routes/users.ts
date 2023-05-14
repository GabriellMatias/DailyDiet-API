import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middleware/check-sessionId-exists'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex('users').select()

    return { users }
  })

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
      })
      const { email, name } = createUserBodySchema.parse(request.body)

      let sessionId = request.cookies.sessionId
      if (!sessionId) {
        sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 4, // 4 days
        })
      }

      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )
}
