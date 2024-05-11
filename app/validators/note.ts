import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new note.
 */
export const createNoteValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    content: vine.string().trim().minLength(4),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing note.
 */
export const updateNoteValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    content: vine.string().trim().minLength(4).optional(),
    params: vine.object({
      id: vine.number(),
    }),
  })
)

export const destroyNoteValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
  })
)
