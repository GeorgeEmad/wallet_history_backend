import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    password: schema.string([rules.minLength(6)]),
    phoneNumber: schema.string([rules.unique({ table: 'user', column: 'phone_number' })]),
    email: schema.string([rules.unique({ table: 'user', column: 'email' }), rules.email()]),
  })


  public messages: CustomMessages = {}
}
