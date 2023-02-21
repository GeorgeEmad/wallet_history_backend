import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  /**
   * User login
   * @param param0
   * @returns
   */
   public async user_login({ request, response, auth }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password'])
    console.log(uid + " -- " + password)
    try {
      const token = await auth.use('Users').attempt(uid, password)
      return response.status(200).json({
        message: 'user logged in',
        data: {token:token, user:token.user}
      })
    } catch (error){
      return response.status(400).send(error)
    }
  }


  /**
   * User register
   * @param param0
   * @returns
   */
  public async user_register({ request, response }: HttpContextContract) {
    let {email, phoneNumber, password,} = await request.validate(RegisterValidator)
    const user = await User.create({ email, phoneNumber, password})
    return response.created({
      message: 'user created',
      data: user
    })
  }


  /**
   * Logout
   * @param param0
   * @returns
   */
  public async user_logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200).json({
      message: 'logged out'
    })
  }

}
