
//import fetch from 'node-fetch';
const DISCORD_BOT_TOKEN = env.DISCORD_BOT_TOKEN;
const DISCORD_CLIENT_ID = env.DISCORD_CLIENT_ID;


/**
 * Register the metadata to be stored by Discord. This should be a one time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7, boolean_neq=8
//let rolemetadata = []
//rolemetadata.push({
//    "key": 
//});


const body = [
  {
    "key":"sorobanquest",
    "name":"Soroban Quester",
    "description":"This role is for the number of soroban quests completed.",
    "type":2
},
{
    "key":"stellarquest",
    "name":"Stellar Quester",
    "description":"This role is for the number of stellar quests completed.",
    "type":2
},
{
  "key":"scftier",
  "name":"Stellar Community Fund Tier",
  "description":"This role is for what tier you are.",
  "type":2
},
];

const response = await fetch(url, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
  },
});
if (response.ok) {
  const data = await response.json();
  console.log(data);
} else {
  //throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
  const data = await response.text();
  console.log(data);
}