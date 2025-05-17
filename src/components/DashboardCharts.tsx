import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Task {
  id: string;
  name: string;
  status: string;
  projectId: string;
}

interface DashboardChartsProps {
  projects: Project[];
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a020f0'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ projects, tasks }) => {
  // Aggregate project statuses
  const projectStatusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [projects]);

  // Aggregate tasks by project
  const taskByProject = React.useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.name] = 0;
    });
    tasks.forEach(t => {
      const proj = projects.find(p => p.id === t.projectId);
      if (proj) counts[proj.name] += 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [projects, tasks]);

  // Aggregate tasks by status
  const taskStatusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [tasks]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
      {/* Project Status Bar Chart */}
      <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Projects by Status</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={projectStatusCounts}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0070f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Tasks by Project Bar Chart */}
      <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Tasks per Project</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={taskByProject}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Task Status Pie Chart */}
      <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Tasks by Status</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={taskStatusCounts}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {taskStatusCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
