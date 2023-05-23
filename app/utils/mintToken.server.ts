// import { BASE_FEE, Asset, Keypair, TransactionBuilder, Networks, Operation } from "stellar-base";

// export async function mintToken(
//   context: any,
//   publickey: string,
//   discord_user_id: string
// ) {
//   const accessToken = context.request.headers
//     .get("Cookie")
//     ?.match(/accesstoken=([^;]+)/)?.[1];
//   if (!accessToken) {
//     return new Response("Missing access token", { status: 400 });
//   }
//   const serverPublicKey = context.env.botpubkey;
//   const serverSecretKey = context.env.serversecretkey;
//   const validity = jwt.verify(accessToken, serverSecretKey);

//   const decoded: JwtPayload = jwt.decode(accessToken);
//   if (!validity) {
//     return new Response("Invalid JWT", { status: 400 });
//   }

//   const userPublicKey = decoded.sub;

//   const serverKeypair = Keypair.fromSecret(serverSecretKey);

//   const defaultRole = new Asset("defaultrole", serverPublicKey);

//   const transaction = new TransactionBuilder(serverKeypair, {
//     fee: BASE_FEE,
//     networkPassphrase: Networks.PUBLIC, // Use Networks.PUBLIC for the mainnet
//   })
//     .addOperation(
//       Operation.changeTrust({
//         asset: defaultRole,
//         source: userPublicKey,
//       })
//     )
//     .addOperation(
//       Operation.payment({
//         destination: userPublicKey,
//         asset: defaultRole,
//         amount: "0.0000001",
//       })
//     )
//     .setTimeout(0)
//     .build();

//   transaction.sign(serverKeypair);

//   const xdr = transaction.toXDR();
//   return xdr;
// }
