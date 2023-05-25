import { z } from 'zod'

export function checkIdParamExists(idParam: string) {
  const idParamSchema = z.string()

  const id = idParamSchema.parse(idParam)

  if (!id) {
    throw new Error('Missing ID Param')
  }
  return id
}
