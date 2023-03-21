import { response } from 'cfw-easy-utils'
export async function onRequest(context) {

    const { TOMLKEYS } = context.env
    const stellarToml = await TOMLKEYS.get('STELLAR_TOML')
  
    if (!stellarToml)
      throw {status: 404, message: `The stellar.toml is not yet available, make sure it's been written to the KV store.`}
  
    return response.text(stellarToml, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=2419200', // 28 days
      }
    })
  }