import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middleware/check-sessionId-exists'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkIdParamExists } from '../utils/check-idParam-exists'

export async function dietRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId
      const diets = await knex('diets').where('session_id', sessionId).select()

      return { diets }
    },
  )
  app.get('/:id', async (request, reply) => {
    const { id }: any = request.params
    const idParam = checkIdParamExists(id)
    const diets = await knex('diets').where('id', idParam).select()
    return { diets }
  })
  app.post('/', async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isInDiet: z.boolean().default(false),
    })
    const { name, description, isInDiet } = createDietBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 4, // 4 days
      })
    }

    await knex('diets').insert({
      id: randomUUID(),
      name,
      description,
      is_in_diet: isInDiet,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('diets')
        .select(
          knex.raw(
            'count(*) filter (where is_in_diet = true) as totalWithinDiet',
          ),
          knex.raw(
            'count(*) filter (where is_in_diet = false) as totalOutsideDiet',
          ),
          knex.raw('count(*) as total'),
        )
        .where({ session_id: sessionId })

      return { summary }
    },
  )

  app.patch('/:id', async (request, reply) => {
    const editDietBodySchema = z.object({
      name: z.string().nullable(),
      description: z.string().nullable(),
      isInDiet: z.boolean().nullable(),
    })
    const { id }: any = request.params
    const idParam = checkIdParamExists(id)
    const { name, description, isInDiet } = editDietBodySchema.parse(
      request.body,
    )

    await knex('diets').where('id', idParam).update({
      name,
      description,
      is_in_diet: isInDiet,
      updated_at: new Date().toDateString(),
    })
    return reply.status(201).send({ message: 'diet update sucessfuly' })
  })

  app.delete('/:id', async (request, reply) => {
    const { id }: any = request.params
    const idParam = checkIdParamExists(id)
    await knex('diets').where('id', idParam).del()
  })
}
