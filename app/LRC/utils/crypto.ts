// import crypto from 'crypto';
// const algorithm = 'aes-256-cbc'
// const key = env.APP_SECRET_KEY || '7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+';
// const iv = crypto.randomBytes(16);


async function importKeyHMAC(secret: string) {
    return await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    )
  }
  
  async function importKeyAES(secret: string) {
    return await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])
  }
  
  export async function sign(message: string, secret: string) {
    const key = await importKeyHMAC(secret)
  
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(message),
    )
  
    // Convert ArrayBuffer to Base64
    return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\//g, '_').replace(/\+/g, '-')
  }
  
  export async function verify(message: string, signature: string, secret: string) {
    const key = await importKeyHMAC(secret)
    const sigBuf = Uint8Array.from(atob(signature.replace(/_/g, '/').replace(/-/g, '+')), c => c.charCodeAt(0))
  
    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuf,
      new TextEncoder().encode(message),
    )
  }
  
  export async function encrypt(text: string, secret: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); //get a unique iv to encrypt
    const myText = new TextEncoder().encode(text) // need TextEncoder to encode to buffer
    const key = await importKeyAES(secret)
    const myDigest = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      myText
    )
  
    const a = {
      "iv": btoa(JSON.stringify(new Uint8Array(iv))),
      "text": btoa(JSON.stringify(new Uint8Array(myDigest)))
    }
  
    return btoa(JSON.stringify(a));
  }
  
  export async function decrypt(encodeText: string, secret: string) {
    let a = JSON.parse(atob(encodeText)) //parse to get iv and the encoded text
    const key = await importKeyAES(secret)
    const result = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: Uint8Array.from(Object.values(JSON.parse(atob(a.iv)))).buffer
      },
      key,
      Uint8Array.from(Object.values(JSON.parse(atob(a.text)))).buffer
    )//decode to get result, detailed configuration could check cloudflare website. 
  
    return new TextDecoder().decode(result);//Use TextDecoder to decode text to normal readable format.
  
  }
  
  export async function sha256(str: string) {
    let buffer = new TextEncoder().encode(str)
    return crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
      return hex(hash)
    })
  }
  
  function hex(buffer: any) {
    let digest = ''
    let view = new DataView(buffer)
    for (let i = 0; i < view.byteLength; i += 4) {
      let value = view.getUint32(i)
      let stringValue = value.toString(16)
      let padding = '00000000'
      let paddedValue = (padding + stringValue).slice(-padding.length)
      digest += paddedValue
    }
    return digest
  }
  