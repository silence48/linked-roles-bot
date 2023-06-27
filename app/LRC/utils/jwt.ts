import jwt from '@tsndr/cloudflare-worker-jwt'
import decode from 'jwt-decode'

export const encodeData = async (payload: any, JWT_SECRET_KEY: string) => {
  const privateKey = JWT_SECRET_KEY || 'MY_SECRET_KEY'
  const token = await jwt.sign(payload, privateKey)
  return btoa(token).replace(/\//g, '_').replace(/\+/g, '-')
}

export const decodeData = async (payload: string, JWT_SECRET_KEY: string) => {
  const token = atob(payload.replace(/_/g, '/').replace(/-/g, '+'))
  const privateKey = JWT_SECRET_KEY || 'MY_SECRET_KEY'
  const verify = await jwt.verify(token, privateKey)
  if (verify) {
    const deco = decode(token)
    return deco
  } else {
    return undefined;
  }
}
