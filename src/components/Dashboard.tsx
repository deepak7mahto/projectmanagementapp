import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string | null;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, tasks }) => {
  // Calculate task status distribution
  const statusCounts = {
    open: 0,
    in_progress: 0,
    review: 0,
    completed: 0,
  };

  tasks.forEach((task) => {
    if (task && task.status && task.status in statusCounts) {
      statusCounts[task.status as keyof typeof statusCounts]++;
    }
  });

  // Calculate task priority distribution
  const priorityCounts = {
    Low: 0,
    Medium: 0,
    High: 0,
    Urgent: 0,
  };

  tasks.forEach((task) => {
    if (task && task.priority && task.priority in priorityCounts) {
      priorityCounts[task.priority as keyof typeof priorityCounts]++;
    }
  });

  // Calculate tasks per project
  const projectTaskCounts: Record<string, number> = {};
  const projectNames: Record<string, string> = {};

  projects.forEach((project) => {
    if (project && project.id) {
      projectTaskCounts[project.id] = 0;
      projectNames[project.id] = (project as Project).name ?? "Unnamed Project";
    }
  });

  tasks.forEach((task) => {
    if (task && task.project_id && task.project_id in projectTaskCounts) {
      projectTaskCounts[task.project_id]!++;
    }
  });

  // Prepare data for task status chart
  const statusChartData = {
    labels: ["Open", "In Progress", "Review", "Completed"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          statusCounts.open,
          statusCounts.in_progress,
          statusCounts.review,
          statusCounts.completed,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)", // blue
          "rgba(255, 206, 86, 0.5)", // yellow
          "rgba(153, 102, 255, 0.5)", // purple
          "rgba(75, 192, 192, 0.5)", // green
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for task priority chart
  const priorityChartData = {
    labels: ["Low", "Medium", "High", "Urgent"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [
          priorityCounts.Low,
          priorityCounts.Medium,
          priorityCounts.High,
          priorityCounts.Urgent,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)", // blue
          "rgba(255, 206, 86, 0.5)", // yellow
          "rgba(255, 99, 132, 0.5)", // red
          "rgba(153, 102, 255, 0.5)", // purple
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for tasks per project chart
  const projectTasksChartData = {
    labels: Object.keys(projectTaskCounts).map((id) => {
      const name = projectNames[id] || "Unknown";
      // Truncate long project names
      return name && typeof name === "string" && name.length > 15
        ? name.substring(0, 15) + "..."
        : name;
    }),
    datasets: [
      {
        label: "Tasks per Project",
        data: Object.values(projectTaskCounts),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tasks per Project",
      },
    },
  };

  return (
    <React.Fragment>
      {/* Summary cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          marginBottom: 32,
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            padding: 16,
            backgroundColor: "#e3f2fd",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, color: "#0070f3" }}>
            Total Projects
          </h3>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            {projects.length}
          </p>
        </div>

        <div
          style={{
            padding: 16,
            backgroundColor: "#e8f5e9",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, color: "#4caf50" }}>
            Total Tasks
          </h3>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            {tasks.length}
          </p>
        </div>

        <div
          style={{
            padding: 16,
            backgroundColor: "#fff8e1",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, color: "#ff9800" }}>
            In Progress
          </h3>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            {statusCounts.in_progress}
          </p>
        </div>

        <div
          style={{
            padding: 16,
            backgroundColor: "#f3e5f5",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, color: "#9c27b0" }}>
            Completed
          </h3>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            {statusCounts.completed}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          marginBottom: 32,
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>
            Task Status Distribution
          </h3>
          <div style={{ height: 300 }}>
            <Pie data={statusChartData} />
          </div>
        </div>

        <div
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>
            Task Priority Distribution
          </h3>
          <div style={{ height: 300 }}>
            <Pie data={priorityChartData} />
          </div>
        </div>
      </div>

      {/* Bar chart for tasks per project */}
      <div
        style={{
          padding: 16,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          marginBottom: 32,
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>
          Tasks per Project
        </h3>
        <div style={{ height: 300 }}>
          <Bar options={barOptions} data={projectTasksChartData} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
