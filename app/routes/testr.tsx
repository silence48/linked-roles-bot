// routes/navbar/index.tsx
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Link } from "@remix-run/react";

export let loader = async ({ request, context }: LoaderArgs) => {

  const { getUser } = await import("~/utils/session.server");
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;

  return json({ discord_user_id });
}


export default function Navbar() {
  const { discord_user_id } = useLoaderData();

  return (
    <nav className="flex items-center justify-between p-6 bg-brand-primary">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img src="/path-to-your-logo.png" alt="Logo" className="w-8 h-8" />
        </Link>
      </div>

      <div className="hidden md:block">
        <input
          type="search"
          placeholder="Search..."
          className="px-3 py-2 rounded-md text-text-primary bg-background-primary"
        />
      </div>

      <div className="flex items-center space-x-4">
        {discord_user_id ? (
          <img src="/path-to-profile-icon.png" alt="Profile" className="w-8 h-8 rounded-full" />
        ) : (
          <button className="px-3 py-2 rounded-md text-brand-primary bg-background-primary">
            Login with Discord
          </button>
        )}
      </div>
    </nav>
  );
}
