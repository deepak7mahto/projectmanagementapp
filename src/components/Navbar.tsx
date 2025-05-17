import Link from "next/link";
import React from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <nav style={{
      width: "100%",
      background: "#1a237e",
      color: "#fff",
      padding: "12px 0",
      marginBottom: 32,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
            Project Management App
          </Link>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/projects" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
            Projects
          </Link>
          <Link href="/tasks" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
            Tasks
          </Link>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 24,
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
