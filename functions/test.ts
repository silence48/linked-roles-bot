
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



      <script>
      var public_key;
      var challengeXDR;
      var signedXDR;
      const discord_user_id = ${discord_user_id};
      
      const connectButton = document.getElementById('connectButton');
      const getChallengeButton = document.getElementById('getChallengeButton');
      const signButton = document.getElementById('signButton');
      const submitButton = document.getElementById('submitButton');

      connectButton.addEventListener('click', async () => {
        console.log('discord_user_id', discord_user_id);
        public_key = await window.freighterApi.getPublicKey();
        console.log("the pubkey", public_key);
        connectButton.style.display = 'none';
        getChallengeButton.style.display = 'block';
      });
      
      getChallengeButton.addEventListener('click', () => {
        let fetchurl = \"${posturl}\"+"?userid="+ discord_user_id + "&account=" + public_key;
        getChallengeButton.style.display = 'none';
        signButton.style.display = 'block';
        console.log('fetching challenge tx from', fetchurl);
        fetch(fetchurl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }).then(response => response.json())
          .then((response) => {
            console.log("HERE IS THE RESPONSE", response);
            console.log(response.Transaction);
            console.log(response.Network_Passphrase);
            console.log(public_key);
            console.log("the type of response.transaction is:", typeof(response.Transaction));
            console.log("the type of response.network_passphrase is:", typeof(response.Network_Passphrase));
            challengeXDR = response;
          }).catch((error) => {console.log(error)})
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

        const userSignedTransaction = await userSignTransaction(challengeXDR.Transaction, "TESTNET");
        userSignedTransaction.then((result) => {
          signedXDR = result;
        });

        signButton.style.display = 'none';
        submitButton.style.display = 'block';
        console.log("the signed xdr", signedXDR);
      });

      submitButton.addEventListener('click', async () => {
        let fetchurl = "${posturl}"+"?userid="+ discord_user_id + "&account=" + public_key;

        (async () => {
          const rawResponse = await fetch(fetchurl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Transaction: signedXDR,
              NETWORK_PASSPHRASE: challengeXDR.Network_Passphrase,
              discord_user_id: discord_user_id
            })
          });
          const content = await rawResponse.json();
        
          console.log(content);
        })();
      });


    </script>
      
      </body>
      `;

      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }

    function getChallengeURL(discord_user_id, stellaraccount, context, state) {
        //const { codeVerifier, codeChallenge } = generateCodeVerifier();
        //const state = crypto.randomBytes(20).toString('hex');
      
        const url = new URL('http://127.0.0.1:8788/auth');
        url.searchParams.set('userid', discord_user_id);
        url.searchParams.set('account', stellaraccount);
        url.searchParams.set('redirect_uri', "http://127.0.0.1:8788");  //probably the user page
        //url.searchParams.set('code_challenge', codeChallenge);
        //url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set('state', state);
        //url.searchParams.set('response_type', 'code');
        //url.searchParams.set(
      //    'scope',
          //'user'
        //);
        url.searchParams.set('prompt', 'consent');
        return { state, url: url.toString() };
      }