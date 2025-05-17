import React from 'react';

// Define Task interface locally for now
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string | null;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // Determine status color
  let statusColor = '#777';
  if (task.status === 'open') statusColor = '#0070f3';
  if (task.status === 'in_progress') statusColor = '#f5a623';
  if (task.status === 'review') statusColor = '#7928ca';
  if (task.status === 'completed') statusColor = '#0070f3';
  
  // Determine priority color
  let priorityColor = '#777';
  if (task.priority === 'Low') priorityColor = '#0070f3';
  if (task.priority === 'Medium') priorityColor = '#f5a623';
  if (task.priority === 'High') priorityColor = '#ff0000';
  if (task.priority === 'Urgent') priorityColor = '#7928ca';
  
  // Format date if exists
  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : 'No due date';

  return (
    <div 
      style={{ 
        border: '1px solid #eee', 
        borderRadius: 8, 
        padding: 16, 
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 18 }}>{task.title}</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <span 
            style={{ 
              display: 'inline-block', 
              padding: '4px 8px', 
              borderRadius: 12, 
              fontSize: 12, 
              backgroundColor: `${statusColor}20`, 
              color: statusColor,
              fontWeight: 500
            }}
          >
            {task.status.replace('_', ' ')}
          </span>
          {task.priority && (
            <span 
              style={{ 
                display: 'inline-block', 
                padding: '4px 8px', 
                borderRadius: 12, 
                fontSize: 12, 
                backgroundColor: `${priorityColor}20`, 
                color: priorityColor,
                fontWeight: 500
              }}
            >
              {task.priority}
            </span>
          )}
        </div>
      </div>
      
      {task.description && (
        <p style={{ margin: '8px 0', color: '#555' }}>
          {task.description}
        </p>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 14, color: '#666' }}>
        <div>
          <div>Due: {formattedDate}</div>
          {task.assigned_to && <div>Assigned to: {task.assigned_to}</div>}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => onEdit(task)}
            style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              border: '1px solid #ddd', 
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              border: '1px solid #f44336', 
              background: '#fff',
              color: '#f44336',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
