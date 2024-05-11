import vine from '@vinejs/vine'

export const authValidator = vine.compile(
  vine.object({
    username: vine.string().trim(),
    password: vine.string().trim().minLength(6),
  })
)
