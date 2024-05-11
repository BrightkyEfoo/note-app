import User from '#models/user'
import { authValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async login({ request }: HttpContext) {
    const { username, password } = await request.validateUsing(authValidator)
    const user = await User.findForAuth(['username'], username)
    if (!user || (user && !(await User.verifyCredentials(username, password)))) {
      return {
        error: 'Invalid username or password',
      }
    }
    const token = await User.accessTokens.create(user, undefined, {
      name: 'api',
      expiresIn: '5 hours',
    })
    return {
      user: user.toJSON(),
      token: token,
    }
  }

  async register({ request }: HttpContext) {
    const { username, password } = await request.validateUsing(authValidator)
    const user = await User.create({ username, password })
    return user
  }
}
