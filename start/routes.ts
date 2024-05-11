/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', '#controllers/users_controller.login')
        router.post('/register', '#controllers/users_controller.register')
      })
      .prefix('/auth')
    router
      .group(() => {
        router.get('/', '#controllers/notes_controller.index')
        router.post('/', '#controllers/notes_controller.store')
        router
          .group(() => {
            router.get('/', '#controllers/notes_controller.show')
            router.put('/', '#controllers/notes_controller.update')
            router.delete('/', '#controllers/notes_controller.destroy')
          })
          .prefix('/:id')
          .where('id', router.matchers.number())
      })
      .prefix('/notes')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
