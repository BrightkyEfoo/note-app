import Note from '#models/note'
import { createNoteValidator, destroyNoteValidator, updateNoteValidator } from '#validators/note'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class NotesController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const { currentAccessToken, ...user } = await auth.authenticate()
    console.log({ user: user.$attributes.id })
    const notes = await Note.query().where('user_id', user.$attributes.id)
    return notes
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const { currentAccessToken, ...user } = await auth.authenticate()
    const note = await request.validateUsing(createNoteValidator)
    const newNote = await Note.create({ ...note, userId: user.$attributes.id })
    return newNote
  }

  /**
   * Show individual record
   */
  async show({ request }: HttpContext) {
    const { params } = await request.validateUsing(destroyNoteValidator)
    const note = await Note.findByOrFail({ id: params.id })
    return note
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request }: HttpContext) {
    const { params, ...update } = await request.validateUsing(updateNoteValidator)
    const note = await Note.find(params.id)
    if (!note) {
      throw new Exception('Note not found', { status: 404, cause: '', code: 'E_NOT_FOUND' })
    }
    if (Object.keys(update).length === 0) {
      return note
    }
    await Note.query().where('id', params.id).update(update)
    return { ...note.toJSON(), ...update }
  }

  /**
   * Delete record
   */
  async destroy({ auth, request }: HttpContext) {
    const { currentAccessToken, ...user } = await auth.authenticate()
    const { params } = await request.validateUsing(destroyNoteValidator)
    const note = await Note.query()
      .where('id', params.id)
      .where('user_id', user.$attributes.id)
      .firstOrFail()
    if (!note) {
      throw new Exception('Note not found', { status: 404, cause: '', code: 'E_NOT_FOUND' })
    }
    note.delete()
    return note
  }
}
