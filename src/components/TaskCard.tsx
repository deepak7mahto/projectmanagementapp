import React, { useEffect, useState } from 'react';
import { getTagsForTask } from '../utils/supabaseTags';
import { getProfileById } from '../utils/supabaseUsers';

// Define interfaces
interface Tag {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [assignedUser, setAssignedUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch tags and assigned user on component mount
  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        // Fetch tags for this task
        if (task.id) {
          const taskTags = await getTagsForTask(task.id);
          setTags(taskTags);
        }
        
        // Fetch assigned user details if there's an assigned user
        if (task.assigned_to) {
          try {
            const userProfile = await getProfileById(task.assigned_to);
            setAssignedUser(userProfile);
          } catch (err) {
            console.error('Error fetching assigned user:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching task data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskData();
  }, [task.id, task.assigned_to]);
  
  // Determine status color
  let statusColor = '#777';
  if (task.status === 'open') statusColor = '#0070f3';
  if (task.status === 'in_progress') statusColor = '#f5a623';
  if (task.status === 'review') statusColor = '#7928ca';
  if (task.status === 'completed') statusColor = '#0cce6b';
  
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

  // Calculate if task is overdue
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div 
      style={{ 
        border: `1px solid ${isOverdue ? '#ffcdd2' : '#eee'}`, 
        borderRadius: 8, 
        padding: 16, 
        backgroundColor: isOverdue ? '#fff8f8' : '#fff',
        boxShadow: isOverdue ? '0 2px 8px rgba(255,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 18, color: isOverdue ? '#d32f2f' : '#333' }}>{task.title}</h4>
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
      
      {/* Display tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {tags.map(tag => (
            <span 
              key={tag.id}
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                backgroundColor: '#e0f7fa',
                color: '#00838f',
                fontWeight: 500
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 16, 
        paddingTop: 12,
        borderTop: '1px solid #eee',
        fontSize: 14, 
        color: '#666' 
      }}>
        <div>
          <div style={{ color: isOverdue ? '#d32f2f' : '#666' }}>
            <span style={{ fontWeight: 500 }}>Due:</span> {formattedDate}
            {isOverdue && <span style={{ color: '#d32f2f', fontWeight: 600, marginLeft: 6 }}>OVERDUE</span>}
          </div>
          {task.assigned_to && (
            <div style={{ marginTop: 4 }}>
              <span style={{ fontWeight: 500 }}>Assigned to:</span> {assignedUser ? assignedUser.full_name : task.assigned_to}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => onEdit(task)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: 4, 
              border: '1px solid #ddd', 
              background: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
              padding: '6px 12px', 
              borderRadius: 4, 
              border: '1px solid #f44336', 
              background: '#fff',
              color: '#f44336',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
