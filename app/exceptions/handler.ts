import { Exception } from '@adonisjs/core/exceptions'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof Exception) {
      return ctx.response.status(error.status).json({ error })
    }
    if (error instanceof Error) {
      console.log('error', error.constructor.name)
      if (error.constructor.name === 'DatabaseError') {
        return ctx.response.status(400).json({ error: error.detail })
      }
      return ctx.response.status(400).json({ error })
    }
    super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
