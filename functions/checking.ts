import { parse } from 'cookie';

interface Env {
  SESSION_STORAGE: KVNamespace;
  authsigningkey: any;
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cookies = context.request.headers.get("Cookie")
  const cookieHeader = parse(cookies);
  console.log(cookieHeader)
  const ourURL = new URL(context.request.url).origin
  const posturl = new URL('/auth', ourURL).toString();
  // make sure the state parameter exists
  const { clientState, discord_user_id } = cookieHeader;

  console.log(`the discord_user_id is ${discord_user_id}`)

  console.log("It's in the test")
  const html = `
  <!DOCTYPE html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-freighter-api/1.3.1/index.min.js"></script>
  </head>
  <body>
  <button id="connectButton">1: Connect Your Freighter</button>
  <button id="getChallengeButton" style="display:none">2: Get the Challenge TX</button>
  <button id="signButton" style="display:none">3: Sign the Challenge TX</button>
  <button id="submitButton" style="display:none">4: Submit the challenge TX and get the auth tokens</button>
  <button id="checkRolesButton" style="display:none">5: Check your stellar account to see if you have any roles</button>
  <button id="claimDefaultButton" style="display:none">6: Claim the default membership token</button>

  <script id="clientScript"></script>
  
  </body>
  `;

  const clientScript = `
  var public_key;
  var challengeXDR;
  var signedXDR;
  var accessToken;
  var roles;
  const discord_user_id = "${discord_user_id}";
  
  const connectButton = document.getElementById('connectButton');
  const getChallengeButton = document.getElementById('getChallengeButton');
  const signButton = document.getElementById('signButton');
  const submitButton = document.getElementById('submitButton');
  const checkRolesButton = document.getElementById('checkRolesButton');
  const claimDefaultButton = document.getElementById('claimDefaultButton');

  connectButton.addEventListener('click', async () => {
    console.log('discord_user_id', ${discord_user_id.toString()});
    public_key = await window.freighterApi.getPublicKey();
    console.log("the pubkey", public_key);
    connectButton.style.display = 'none';
    getChallengeButton.style.display = 'block';
  });
  getChallengeButton.addEventListener('click', async () => {
    let fetchurl = "${posturl}" + "?userid=" + "${discord_user_id}" + "&account=" + public_key;
    getChallengeButton.style.display = 'none';
    signButton.style.display = 'block';
    console.log('fetching challenge tx from', fetchurl);
    const response = await fetch(fetchurl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const challengeData = await response.json();
    console.log("HERE IS THE RESPONSE", challengeData);
    challengeXDR = challengeData;
  });

  const userSignTransaction = async (
    xdr,
    network,
    signWith
  ) => {
    let signedTransaction = "";
    let error = "";
  
    try {
      signedTransaction = await window.freighterApi.signTransaction(xdr, {
        network,
        accountToSign: signWith,
      });
    } catch (e) {
      error = e;
    }
  
    if (error) {
      return error;
    }
  
    return signedTransaction;
  };

  signButton.addEventListener('click', async () => {
    signedXDR = await userSignTransaction(challengeXDR.Transaction, "TESTNET");
    signButton.style.display = 'none';
    submitButton.style.display = 'block';
    console.log("the signed xdr", signedXDR);
  });

  submitButton.addEventListener('click', async () => {
    let fetchurl = "${posturl}" + "?userid=" + "${discord_user_id}" + "&account=" + public_key;
    const rawResponse = await fetch(fetchurl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Transaction: signedXDR,
        NETWORK_PASSPHRASE: challengeXDR.Network_Passphrase,
        discord_user_id: "${discord_user_id}"
      })
    });
    accessToken = await rawResponse.json();
    submitButton.style.display = 'none';
    checkRolesButton.style.display = 'block';
    console.log(accessToken);
  });

  checkRolesButton.addEventListener('click', async () => {
    let fetchurl = "${ourURL}" + "/checkroles?userid=" + "${discord_user_id}" + "&account=" + public_key;
    const rawResponse = await fetch(fetchurl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'set-cookie': 'accesstoken=accessToken.token; path=/;'
      },
      body: JSON.stringify({
        Transaction: signedXDR,
        NETWORK_PASSPHRASE: challengeXDR.Network_Passphrase,
        discord_user_id: "${discord_user_id}"
      })
    });
    roles = await rawResponse.json();
    console.log(roles);
    checkRolesButton.style.display = 'none';
    if (!roles.length) {
      claimDefaultButton.style.display = 'block';
    }
  });

  claimDefaultButton.addEventListener('click', async () => {
    const defaultClaimURL = ("${ourURL}" + "/defaultclaim");

    // Fetch the transaction XDR from the 'defaultclaim' endpoint
    const response = await fetch(defaultClaimURL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'set-cookie': 'accesstoken=accessToken.token; path=/;'
      },
    });

    if (!response.ok) {
        console.error('Failed to fetch the default claim transaction XDR');
        return;
      }
      
      const defaultClaimXDR = await response.text();
      console.log("the default claim xdr is:", defaultClaimXDR);
      
      // Sign the transaction using Freighter
      const signedDefaultClaimXDR = await userSignTransaction(defaultClaimXDR, "TESTNET");
      console.log('signedDefaultClaimXDR', signedDefaultClaimXDR);
      
      // Do something with the signed transaction, e.g., submit it to the Stellar network
      // ...
    });
    `;


  const rewriter = new HTMLRewriter()
    .on('script#clientScript', {
      element: (element) => {
        element.setInnerContent(clientScript, { html: false });
      }
    });

  const response = new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });

  return rewriter.transform(response);
}
