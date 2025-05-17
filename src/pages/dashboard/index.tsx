import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Project Management App</title>
        <meta name="description" content="Project management dashboard" />
      </Head>
      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user?.name}!</h1>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dashboard cards will go here */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
                <p className="mt-2 text-sm text-gray-500">View and manage your projects</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
                <p className="mt-2 text-sm text-gray-500">View and manage your tasks</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Team</h2>
                <p className="mt-2 text-sm text-gray-500">View and manage your team</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
