import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get the auth token
const getAuthToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user');
    }
    return user.getIdToken();
};

// Generic API request function
const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Notes API
export const notesApi = {
    // Get all notes
    getNotes: () => apiRequest<Note[]>('/notes'),

    // Get a single note
    getNote: (id: string) => apiRequest<Note>(`/notes/${id}`),

    // Create a new note
    createNote: (note: Omit<Note, 'id'>) => 
        apiRequest<Note>('/notes', {
            method: 'POST',
            body: JSON.stringify(note),
        }),

    // Update a note
    updateNote: (id: string, note: Partial<Note>) =>
        apiRequest<Note>(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(note),
        }),

    // Delete a note
    deleteNote: (id: string) =>
        apiRequest<void>(`/notes/${id}`, {
            method: 'DELETE',
        }),
};

// User API
export const userApi = {
    // Get current user profile
    getProfile: () => apiRequest<User>('/auth/me'),

    // Update user profile
    updateProfile: (data: { name: string }) =>
        apiRequest<User>('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// Types
export interface Note {
    id: string;
    title: string;
    content: string;
    userId: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
} 