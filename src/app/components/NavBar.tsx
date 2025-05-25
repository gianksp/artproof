import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserNFTs } from "../store/productions";
import Link from "next/link";
import { AuthButton } from "./AuthButton";

export const NavBar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserNFTs());
  }, [])

  return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <Link href="/" className="flex items-center space-x-3 group">
                    <span className="text-xl font-heading font-bold text-brand-primary group-hover:text-brand-olive transition">
                      🎵 Artproof
                    </span>
                  </Link>
                  <form action="/" className="w-full sm:w-80">
                    <input
                      name="q"
                      type="search"
                      placeholder="Search events, artists, or roles..."
                      defaultValue=""
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-olive"
                    />
                  </form>
                </div>

                <div className="flex items-center">
                  <Link
                    href="/create"
                    className="text-sm font-medium text-brand-olive hover:text-brand-yellow transition mr-8"
                  >
                    + New Production
                  </Link>

                  {/* <button className="ml-8 px-4 py-2 text-sm bg-brand-olive text-white rounded-lg hover:bg-brand-yellow transition">
                    Login
                  </button> */}
                  <AuthButton></AuthButton>


                </div>
              </div>
            </nav>
  )
}