import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetUserTransactionValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({

    params: schema.object().members({
      page: schema.number(),
    }),
    from: schema.string.optional(),
    to: schema.string.optional(),
    type: schema.enum.optional(['income', 'expense'] as const),
    purpose: schema.string.optional({ trim: true }),
  })


  public messages: CustomMessages = {}
}
