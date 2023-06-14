// routes/navbar/index.tsx
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/cloudflare";

export let loader = async ({ request, context }: LoaderArgs) => {

  const { getUser } = await import("~/utils/session.server");
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;

  return json({ discord_user_id });
}


export default function Navbar() {
  const { discord_user_id } = useLoaderData();

  return (<div className="navbar bg-base-100">
  <div className="flex-1">
    <Link className="btn btn-ghost normal-case text-xl" to="/">Stellar Linked Roles</Link>
  </div>
  <div className="flex-none gap-2">
    
    <Link className="btn btn-primary normal-case text-xl" to="/">Login</Link>
        
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
          
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>

  );
}