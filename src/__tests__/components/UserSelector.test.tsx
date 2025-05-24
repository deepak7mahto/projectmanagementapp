import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSelector from '../../components/UserSelector';

// Mock fetch
const mockUsers = [
  { id: 'user1', displayName: 'John Doe', email: 'john@example.com' },
  { id: 'user2', displayName: 'Jane Smith', email: 'jane@example.com' },
  { id: 'user3', displayName: 'Bob Wilson' }
];

describe('UserSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn();
    mockOnChange.mockClear();
  });

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise((resolve) => {
        // Never resolves to keep loading state
        setTimeout(resolve, 1000000);
      })
    );

    render(
      <UserSelector
        selectedUserId=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('displays users after successful fetch', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })
    );

    render(
      <UserSelector
        selectedUserId=""
        onChange={mockOnChange}
      />
    );

    // Should show loading initially
    expect(screen.getByText('Loading users...')).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Select a user')).toBeInTheDocument();
    });

    // Check if all users are rendered
    expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith (jane@example.com)')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('handles fetch error correctly', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(
      <UserSelector
        selectedUserId=""
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading users')).toBeInTheDocument();
      expect(screen.getByText('Failed to load user profiles')).toBeInTheDocument();
    });

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('handles network error correctly', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <UserSelector
        selectedUserId=""
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading users')).toBeInTheDocument();
      expect(screen.getByText('Failed to load user profiles')).toBeInTheDocument();
    });

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onChange when a user is selected', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })
    );

    render(
      <UserSelector
        selectedUserId=""
        onChange={mockOnChange}
      />
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Select a user')).toBeInTheDocument();
    });

    // Select a user
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'user1' }
    });

    expect(mockOnChange).toHaveBeenCalledWith('user1');
  });

  it('displays selected user when selectedUserId is provided', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })
    );

    render(
      <UserSelector
        selectedUserId="user2"
        onChange={mockOnChange}
      />
    );

    await waitFor(() => {
      const selectElement = screen.getByRole('combobox');
      const selectedOption = Array.from(selectElement.children).find(
        child => (child as HTMLOptionElement).selected
      );
      expect(selectedOption?.textContent).toBe('Jane Smith (jane@example.com)');
    });
  });
});
