import Link from "next/link";
import React from "react";

export default function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}
