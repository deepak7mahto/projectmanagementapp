import Link from "next/link";
import React from "react";
import {
  FaSignOutAlt,
  FaTasks,
  FaProjectDiagram,
  FaUserCircle,
} from "react-icons/fa";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user, logout, loading, isAuthenticated } = useUser();

  return (
    <nav className="w-full bg-indigo-900 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Logo / App Name */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-lg font-extrabold tracking-wide text-white">
              PM
            </span>
            <span className="hidden sm:inline">Project Management</span>
          </Link>
        </div>
        {/* Nav Links and User Info: Only for authenticated users */}
        {isAuthenticated && !loading && (
          <>
            <div className="flex items-center gap-6">
              <Link
                href="/projects"
                className="flex items-center gap-1 transition hover:text-blue-300"
              >
                <FaProjectDiagram className="inline-block" />
                <span className="hidden sm:inline">Projects</span>
              </Link>
              <Link
                href="/tasks"
                className="flex items-center gap-1 transition hover:text-blue-300"
              >
                <FaTasks className="inline-block" />
                <span className="hidden sm:inline">Tasks</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-blue-200" />
                <span
                  className="max-w-[120px] truncate text-sm font-medium"
                  title={user?.displayName || user?.email}
                >
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 rounded bg-red-500 px-3 py-1.5 font-semibold text-white transition hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none"
                title="Logout"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </>
        )}
        {!isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="flex items-center gap-1 transition hover:text-blue-300"
            >
              <FaUserCircle className="text-2xl text-blue-200" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
