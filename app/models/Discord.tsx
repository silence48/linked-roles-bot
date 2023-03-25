import type { Context } from 'hono';
import { User } from '.';

export class Discord {
  static async getOAuthUrl(env: any) {
    const state = crypto.randomUUID();
    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
    url.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'role_connections.write identify');
    url.searchParams.set('prompt', 'consent');
    return { state, url: url.toString() };
  }
   
  static async getOAuthTokens(
    code: string,
    env: any
  ) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const data = new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    });
  
    const response = await fetch(url, { method: 'POST', body: data, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    console.log("the response from oauth tokens", response)
    return response.json()
  }
  
  static async getUserData(tokens: any) {
    const url = 'https://discord.com/api/v10/oauth2/@me';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    return response.json();
  }
/**
 * @typedef DiscordRoleMetaData
 * @type {
 * @property {ApplicationRoleConnectionMetadataType} Type - 	type of metadata value
 * @property  {string} key -  name of the metadata field (1-100 characters)
 * @property  {string} name - name of the metadata field (1-100 characters)
 * @property  {dictionary} name_localizations?: 
 * @property  {string} description
 * @property  {dictionary} description_localizations
 * @property {string} id - an ID.
 * @property {string} name - your name.
 * @property {number} age - your age.
 */
/*FIELD	TYPE	DESCRIPTION
type	ApplicationRoleConnectionMetadataType	type of metadata value
key	string	dictionary key for the metadata field (must be a-z, 0-9, or _ characters; 1-50 characters)
name	string	name of the metadata field (1-100 characters)
name_localizations?	dictionary with keys in available locales	translations of the name
description	string	description of the metadata field (1-200 characters)
description_localizations?	dictionary with keys in available locales	translations of the description*/

  static async pushMetadata(
    discord_user_id: string,
    data: any, // inside the data object goes the refresh_token, TODO
    metadata: {pilot: number, captain: number, navigator: number},
    env: any
  ) {

    console.log('Pushing metadata to discord')
    console.log(metadata)
    // GET/PUT /users/@me/applications/:id/role-connection
    const url = `https://discord.com/api/v10/users/@me/applications/${env.DISCORD_CLIENT_ID}/role-connection`;
    // const accessToken = await getAccessToken(discord_user_id, data);
    const { access_token: accessToken } = await User.findOne('discord_user_id', discord_user_id, env.DB)
    const body = {
      platform_name: 'Stellar Discord Bot',
      metadata,
    };
    try {
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Pushing successful')

    } catch (e) {
      // const err = e as GaxiosError;
      // console.error(e);
      // console.log(util.inspect(err.response?.data, false, 12));
      // throw e;
    }
  }

  static async getMetadata(discord_user_id: string, data: any, env: any) {
    // GET/PUT /users/@me/applications/:id/role-connection
    const url = `https://discord.com/api/v10/users/@me/applications/${env.DISCORD_CLIENT_ID}/role-connection`;
    const { access_token: accessToken } = await User.findOne('discord_user_id', discord_user_id, env.DB)
    const metadata = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })).json()
    return metadata;
    // const accessToken = await getAccessToken(discord_user_id, data);
    // const res = await request({
    //   url,
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // return res.data;
  }
}