import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardComponent from "../../components/Dashboard";
import { getProjects } from "../../utils/supabaseProjects";
import { getTasksByProject } from "../../utils/supabaseTasks";

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  // Fetch projects and tasks data
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all projects
      const projectsData = await getProjects();
      setProjects(projectsData || []);
      
      // Fetch tasks for all projects
      const allTasks: any[] = [];
      
      for (const project of projectsData) {
        const projectTasks = await getTasksByProject(project.id);
        if (projectTasks && projectTasks.length > 0) {
          allTasks.push(...projectTasks);
        }
      }
      
      setTasks(allTasks);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
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
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Welcome back, {session.user?.name || 'User'}!</h1>
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                type="button"
                onClick={() => router.push('/projects/add')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  borderRadius: 4,
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                New Project
              </button>
              <button
                type="button"
                onClick={() => router.push('/tasks/add')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  borderRadius: 4,
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                New Task
              </button>
            </div>
          </div>
          
          {error && (
            <div style={{ color: 'red', padding: 12, backgroundColor: '#ffebee', borderRadius: 4, marginBottom: 16 }}>
              {error}
            </div>
          )}
          

          {/* Quick navigation cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 16,
            marginBottom: 32
          }}>
            <Link 
              href="/projects" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit'
              }}
            >
              <div style={{ 
                padding: 24, 
                backgroundColor: '#fff', 
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: '1px solid #eee'
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Projects</h2>
                <p style={{ margin: 0, color: '#666' }}>View and manage all projects</p>
                <div style={{ marginTop: 16, fontSize: 32, fontWeight: 700, color: '#0070f3' }}>{projects.length}</div>
              </div>
            </Link>
            
            <Link 
              href="/tasks" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit'
              }}
            >
              <div style={{ 
                padding: 24, 
                backgroundColor: '#fff', 
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: '1px solid #eee'
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Tasks</h2>
                <p style={{ margin: 0, color: '#666' }}>View and manage all tasks</p>
                <div style={{ marginTop: 16, fontSize: 32, fontWeight: 700, color: '#0070f3' }}>{tasks.length}</div>
              </div>
            </Link>
          </div>
          
          {/* Dashboard charts */}
          <DashboardComponent projects={projects} tasks={tasks} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
