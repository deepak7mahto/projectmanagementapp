import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabaseClient";
import Head from "next/head";
import Link from "next/link";
import Dashboard from "../components/Dashboard";
import { getProjects } from "../utils/supabaseProjects";
import { getTasksByProject } from "../utils/supabaseTasks";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProjects([]);
      setTasks([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsData = await getProjects(user?.id);
      setProjects(projectsData || []);
      const allTasks: any[] = [];
      for (const project of projectsData) {
        const projectTasks = await getTasksByProject(project.id);
        if (projectTasks && projectTasks.length > 0) {
          allTasks.push(...projectTasks);
        }
      }
      setTasks(allTasks);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Project Management App</title>
        <meta name="description" content="A collaborative project management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Project <span className="text-[hsl(280,100%,70%)]">Management</span> App
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            A powerful tool to manage your projects, tasks, and team collaboration in one place.
          </p>
          {error && (
            <div style={{ color: 'red', background: '#ffebee', padding: 12, borderRadius: 4, marginBottom: 16 }}>{error}</div>
          )}
          {user ? (
            loading ? (
              <div style={{ color: '#fff', margin: 32 }}>Loading your dashboard...</div>
            ) : (
              <Dashboard projects={projects} tasks={tasks} />
            )
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Sign in / Sign up to get started
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
