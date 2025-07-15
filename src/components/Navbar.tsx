import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-n border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={"/"} className="font-mono text-xl font-bold text-white">
            social<span className="text-purple-500">.media</span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "text-purple-300 hover:text-purple-400 transition-colors "
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"/create"}
               className={({ isActive }) =>
                isActive
                  ? "text-purple-300 hover:text-purple-400 transition-colors "
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              Create Post
            </NavLink>
            <NavLink
              to={"/communities"}
              className={({ isActive }) =>
                isActive
                  ? "text-purple-300 hover:text-purple-400 transition-colors "
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              Communities
            </NavLink>
            <NavLink
              to={"/community/create"}
               className={({ isActive }) =>
                isActive
                  ? "text-purple-300 hover:text-purple-400 transition-colors "
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              Create Community
            </NavLink>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="user avatar"
                    className="size-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500 px-3 py-1 rounded"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="cursor-pointer bg-blue-500 py-1 px-3 rounded"
              >
                {" "}
                Sign in with Github
              </button>
            )}
          </div>

          {/* MENU_BUTTON */}
          <div className="md:hidden ">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}

      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1" >
            <Link
              to={"/"}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to={"/create"}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Post
            </Link>
            <Link
              to={"/communities"}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Communities
            </Link>
            <Link
              to={"/community/create"}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Community
            </Link>

            {/* Mobile_AUTH */}
            <div  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
              {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="user avatar"
                    className="size-8 rounded-full object-cover"
                  />
                )}
                {/* <span className="text-gray-300">{displayName}</span> */}
                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500 px-3 py-1 rounded"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="cursor-pointer bg-blue-500 py-1 px-3 rounded"
              >
                {" "}
                Sign in with Github
              </button>
            )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
