import React from 'react';

// Define constants locally for now
const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
];

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

interface TaskFormProps {
  formData: {
    title: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
    assigned_to: string;
  };
  editingTask: Task | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  editingTask,
  onSubmit,
  onCancel,
  handleInputChange
}) => {
  return (
    <form 
      onSubmit={onSubmit} 
      style={{ 
        marginTop: 16, 
        marginBottom: 32, 
        padding: 16, 
        border: '1px solid #eee', 
        borderRadius: 8, 
        backgroundColor: '#f9f9f9' 
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 16 }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
      
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Title *</label>
        <input
          id="title"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleInputChange}
          required
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Detailed task description"
          value={formData.description}
          onChange={handleInputChange}
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', minHeight: 80 }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="due_date" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Due Date</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleInputChange}
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label htmlFor="priority" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          >
            <option value="">Select Priority</option>
            {PRIORITY_OPTIONS.map((option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="status" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          >
            {STATUS_OPTIONS.map((option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <label htmlFor="assigned_to" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Assigned To</label>
          <input
            id="assigned_to"
            name="assigned_to"
            placeholder="User ID or email"
            value={formData.assigned_to}
            onChange={handleInputChange}
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #ddd', background: '#fff' }}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#0070f3', color: 'white', fontWeight: 500 }}
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
