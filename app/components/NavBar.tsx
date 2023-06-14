import { Link, useNavigate } from "@remix-run/react";


export const NavBar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/verify");
  };

  return(
<div className="navbar bg-base-100">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost normal-case text-xl">CommuniDAO</Link>
      
    </div>
    <div className="flex-none gap-2">
      <div className="form-control">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
      </div>
      {isLoggedIn ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
              <Link to="/profile" className="justify-between">Profile</Link>
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={handleButtonClick}
        >
          Login With Discord
        </button>
      )}
    </div>
  </div>
  );
}
  