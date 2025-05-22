import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../../components/TaskCard';

// Mock the utility functions
jest.mock('../../utils/supabaseTags', () => ({
  getTagsForTask: jest.fn().mockResolvedValue([
    { id: '1', name: 'Frontend' },
    { id: '2', name: 'Bug' }
  ])
}));

jest.mock('../../utils/supabaseUsers', () => ({
  getProfileById: jest.fn().mockResolvedValue({
    id: 'user1',
    displayName: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  })
}));

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'in_progress',
    priority: 'High',
    project_id: 'project1',
    created_by: 'user1',
    created_at: '2024-05-22T12:00:00Z',
    updated_at: '2024-05-22T12:00:00Z',
    assigned_to: 'user1',
    due_date: '2024-06-22T12:00:00Z'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title and description', async () => {
    await act(async () => {
      render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
      );
    });

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays correct status and priority badges', async () => {
    await act(async () => {
      render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
      );
    });

    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('displays tags when they are loaded', async () => {
    await act(async () => {
      render(
        <TaskCard
          task={mockTask}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
    });

    await screen.findByText('Frontend');
    await screen.findByText('Bug');

    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('displays assigned user when loaded', async () => {
    await act(async () => {
      render(
        <TaskCard
          task={mockTask}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
    });

    await screen.findByText('John Doe');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    await act(async () => {
      render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Edit'));
    });
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('shows delete confirmation and calls onDelete when confirmed', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    await act(async () => {
      render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this task?');
    expect(mockOnDelete).toHaveBeenCalledWith('1');

    confirmSpy.mockRestore();
  });

  it('displays overdue styling for past due dates', async () => {
    const overdueMockTask = {
      ...mockTask,
      due_date: '2024-01-01T12:00:00Z',
      status: 'open'
    };

    await act(async () => {
      render(
      <TaskCard
        task={overdueMockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
      );
    });

    expect(screen.getByText('OVERDUE')).toBeInTheDocument();
  });
});
