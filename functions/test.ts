import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
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
      <script>
      var public_key
      var challengeXDR
      // Create a button element
      const button = document.createElement('button')
      // Set the button text
      button.innerText = '1: Connect Your Freighter'
      // Set the button id
      button.id = 'mainButton'
      const discord_user_id = ${discord_user_id}
      // Attach the "click" event to your button
      button.addEventListener('click', () => {
        // Do something when the button is clicked
        ConnectFreighter(${discord_user_id})
      })
      document.body.appendChild(button)
      
        async function ConnectFreighter(discord_user_id) {
          console.log('discord_user_id', discord_user_id);
          public_key = await window.freighterApi.getPublicKey();
          console.log("the pubkey", public_key);
          button.innerText = '2: Get the Challenge TX'
          button.addEventListener('click', () => {
            // Do something when the button is clicked
            GetChallengeTx(discord_user_id);
          })
          document.body.appendChild(button)
          return public_key;
        }
        async function GetChallengeTx(discord_user_id) {
          let fetchurl=(\"${posturl}\"+"?userid="+ discord_user_id + "&account=" + public_key);
          
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
                challengeXDR = JSON.stringify(response);               
               }).catch((error) => {console.log(error)})

               console.log("the challenge xdr", challengeXDR)
               button.innerText = '3: Sign the Challenge TX'
                button.addEventListener('click', () => {
                  signedXDR = SignChallengeTx(challengeXDR, discord_user_id);
                  console.log('signed', signedXDR)
                });
                document.body.appendChild(button)
              };

            async function SignChallengeTx(challengeXDR, discord_user_id) {
               
               const signedXDR = await window.freighterApi.signTransaction(challengeXDR, "TESTNET", public_key);
               console.log("the signed xdr", signedXDR)

            }
               //.then((signedXDR) =>{
               // fetch(fetchurl, {
               //     method: 'POST',
               //     headers: {
               //         'Accept': 'application/json',
               //         'Content-Type': 'application/json'
               //     },
               //     body: JSON.stringify({"Transaction": signedXDR, "NETWORK_PASSPHRASE": "Test SDF Network ; September 2015", "discord_user_id": discord_user_id}),
               // })
                //.then((tokens)=>{
                //  console.log(tokens)
                //  document.cookie = "access_token=" + tokens.access_token + "; path=/";
                //  window.location.replace("${ourURL}"+"/checkroles")
                //})
              //)
               //}
        /*
       function getPubKey(input){
        console.log(input)
        window.freighterApi.getPublicKey(input).then(response => {console.log(response)})
       }*/
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