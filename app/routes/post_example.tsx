import { json, type ActionFunction, redirect} from '@remix-run/cloudflare';

export let action: ActionFunction = async ({
    request,
    context,
  }): Promise<Response | null> => {
    try {
      const ctx = context as any;
      let form = await request.formData();
      const fields = Array.from(form.entries())
      const data: any = Object.fromEntries(fields);

      // Example
      const { results, success } = await ctx.DB.prepare(
        `INSERT INTO users (name, created_at, updated_at)
          VALUES("Tim", datetime('now'), datetime('now')) RETURNING *;`
      ).all()

        console.log('ctx', ctx)
        console.log('data', data)
        console.log('ctx.DB', ctx.DB)
        
      return redirect('/')
    } catch (error: any) {
      return json({message: 'ERROR'})
    }
  }

  export default function Data() {

    return <div>
        <form method="POST" action="/data">
            <input id="name" name="name" />
            <button type="submit">SUBMIT</button>
        </form>
    </div>
}