import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabaseClient";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Project Management App</title>
        <meta name="description" content="A collaborative project management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Project <span className="text-[hsl(280,100%,70%)]">Management</span> App
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            A powerful tool to manage your projects, tasks, and team collaboration in one place.
          </p>
          <div className="flex flex-col items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Sign in / Sign up to get started
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
