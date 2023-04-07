
export const onRequest: PagesFunction<Env> = async (context) => {
    const request = context.request
    const { searchParams } = new URL(request.url);
    let q = searchParams.get('q');
    let t = searchParams.get('type');

    const data = {
      "stellar_address": "bob*stellar.org",
      "account_id": "GCIBUCGPOHWMMMFPFTDWBSVHQRT4DIBJ7AD6BZJYDITBK2LCVBYW7HUQ",
      "memo_type": "id",
      "memo": "123",
      "Thequery": q,
      "the type": t
    };

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  };


  interface Env {
    SESSION_STORAGE: KVNamespace;
  }
  