
export const EXPRESS_PORT = 'EXPRESS_PORT'
export const MAILGUN_HOST = 'MAILGUN_HOST'
export const MAINGUN_PORT = 'MAINGUN_PORT'
export const MAILGUN_USER = 'MAILGUN_USER'
export const MAINGUN_PASS = 'MAINGUN_PASS'
export const SECRET_KEY = 'SECRET_KEY'

export const getEnv = (envKey: string): string => {
  return process.env[envKey] || ''
}