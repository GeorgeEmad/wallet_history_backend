import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(['income', 'expense'] as const),
    amount: schema.number(),
    purpose: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}
