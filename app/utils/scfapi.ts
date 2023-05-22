const SCF_API = `http://localhost:8787`;

export async function handleResponse(response: Response) {
    const { headers, ok } = response;
    const contentType = headers.get('content-type');
    
    const content = contentType
      ? contentType.includes('json')
        ? response.json()
        : response.text()
      : { status: response.status, message: response.statusText };
    if (ok) return content;
    else throw await content;
  }  

export const updatePublicKeys = async (
    discordToken: string,
    signedMessage: SignedMessage
  ) => {
    return await fetch(`${SCF_API}/update-public-keys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
      body: JSON.stringify({ signedMessage: signedMessage }),
    }).then(handleResponse);
  };
  
  type Proof = { txt: string; pk: string };
  type ProofsResponse = { proofs: Proof[] };
  
  export const getProofTxt = async (discordToken: string): Promise<ProofsResponse> => {
    const response = await fetch(`${SCF_API}/export-proof`, {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    });
    
    const data = await response.json();
    return data;
  };
  
  export const getDeveloper = async (
    discordToken: string
  ): Promise<Developer> => {
    return await fetch(`${SCF_API}/developer`, {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    }).then(handleResponse);
  };