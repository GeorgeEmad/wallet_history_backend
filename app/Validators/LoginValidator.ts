import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    password: schema.string([rules.minLength(6)]),
    phoneNumber: schema.string([rules.exists({ table: 'user', column: 'phone_number' })]),
    email: schema.string([rules.exists({ table: 'user', column: 'email' }), rules.email()]),
  })


  public messages: CustomMessages = {}
}
