import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateNote from '../components/CreateNote';
import EditNote from '../components/EditNote';
import ViewNotes from '../components/ViewNotes';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { notesApi, Note as ApiNote } from '../services/api';

// Convert API note to frontend note format
const apiNoteToFrontendNote = (note: ApiNote) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    reminder: null, // TODO: Add reminder support
    labels: note.tags,
    color: note.isPublic ? 'bg-yellow-100' : 'bg-white'
});

// Convert frontend note to API note format
const frontendNoteToApiNote = (note: FrontendNote): Omit<ApiNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'> => ({
    title: note.title,
    content: note.content,
    tags: note.labels,
    isPublic: note.color === 'bg-yellow-100'
});

type FrontendNote = {
    id: string;
    title: string;
    content: string;
    reminder: Date | null;
    labels: string[];
    color?: string;
};

interface NotesPageProps {
    selectedLabel: string | null;
    onLabelSelect: (label: string | null) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ selectedLabel, onLabelSelect }) => {
    const navigate = useNavigate();
    const { user, backendUser } = useAuth();
    const [notes, setNotes] = useState<FrontendNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch notes when user changes
    useEffect(() => {
        const fetchNotes = async () => {
            if (!user) {
                setNotes([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                if (user.isAnonymous) {
                    // For anonymous users, start with empty notes
                    setNotes([]);
                    setError(null);
                } else {
                    // For authenticated users, fetch notes from API
                    const apiNotes = await notesApi.getNotes();
                    setNotes(apiNotes.map(apiNoteToFrontendNote));
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching notes:', err);
                setError('Failed to load notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [user]);

    const handleCreateNote = async (title: string, content: string, reminder: Date | null) => {
        if (!user) {
            setError('Please sign in to create notes');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, create notes locally
                const newNote: FrontendNote = {
                    id: Date.now().toString(),
                    title,
                    content,
                    reminder,
                    labels: [],
                    color: 'bg-white'
                };
                setNotes([newNote, ...notes]);
                setIsCreating(false);
            } else {
                // For authenticated users, create notes via API
                const newNote = await notesApi.createNote({
                    title,
                    content,
                    tags: [],
                    isPublic: false
                });
                setNotes([apiNoteToFrontendNote(newNote), ...notes]);
                setIsCreating(false);
            }
        } catch (err) {
            console.error('Error creating note:', err);
            setError('Failed to create note');
        }
    };

    const handleEditNote = async (id: string, title: string, content: string, reminder: Date | null) => {
        if (!user) {
            setError('Please sign in to edit notes');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, edit notes locally
                setNotes(notes.map(note => 
                    note.id === id ? { ...note, title, content, reminder } : note
                ));
                setIsEditing(false);
                setSelectedNoteId(null);
            } else {
                // For authenticated users, edit notes via API
                const noteToUpdate = notes.find(note => note.id === id);
                if (!noteToUpdate) return;

                const updatedNote = await notesApi.updateNote(id, {
                    title,
                    content,
                    tags: noteToUpdate.labels,
                    isPublic: noteToUpdate.color === 'bg-yellow-100'
                });

                setNotes(notes.map(note => 
                    note.id === id ? apiNoteToFrontendNote(updatedNote) : note
                ));
                setIsEditing(false);
                setSelectedNoteId(null);
            }
        } catch (err) {
            console.error('Error updating note:', err);
            setError('Failed to update note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!user) {
            setError('Please sign in to delete notes');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, delete notes locally
                setNotes(notes.filter(note => note.id !== id));
                if (selectedNoteId === id) {
                    setSelectedNoteId(null);
                }
            } else {
                // For authenticated users, delete notes via API
                await notesApi.deleteNote(id);
                setNotes(notes.filter(note => note.id !== id));
                if (selectedNoteId === id) {
                    setSelectedNoteId(null);
                }
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            setError('Failed to delete note');
        }
    };

    const handleAddLabel = async (noteId: string, label: string) => {
        if (!user) {
            setError('Please sign in to add labels');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, add labels locally
                setNotes(notes.map(note => {
                    if (note.id === noteId && !note.labels.includes(label)) {
                        return {
                            ...note,
                            labels: [...note.labels, label]
                        };
                    }
                    return note;
                }));
            } else {
                // For authenticated users, add labels via API
                const noteToUpdate = notes.find(note => note.id === noteId);
                if (!noteToUpdate) return;

                const updatedLabels = [...noteToUpdate.labels, label];
                const updatedNote = await notesApi.updateNote(noteId, {
                    ...frontendNoteToApiNote(noteToUpdate),
                    tags: updatedLabels
                });

                setNotes(notes.map(note => 
                    note.id === noteId ? apiNoteToFrontendNote(updatedNote) : note
                ));
            }
        } catch (err) {
            console.error('Error adding label:', err);
            setError('Failed to add label');
        }
    };

    const handleRemoveLabel = async (noteId: string, label: string) => {
        if (!user) {
            setError('Please sign in to remove labels');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, remove labels locally
                setNotes(notes.map(note => {
                    if (note.id === noteId) {
                        return {
                            ...note,
                            labels: note.labels.filter(l => l !== label)
                        };
                    }
                    return note;
                }));
            } else {
                // For authenticated users, remove labels via API
                const noteToUpdate = notes.find(note => note.id === noteId);
                if (!noteToUpdate) return;

                const updatedLabels = noteToUpdate.labels.filter(l => l !== label);
                const updatedNote = await notesApi.updateNote(noteId, {
                    ...frontendNoteToApiNote(noteToUpdate),
                    tags: updatedLabels
                });

                setNotes(notes.map(note => 
                    note.id === noteId ? apiNoteToFrontendNote(updatedNote) : note
                ));
            }
        } catch (err) {
            console.error('Error removing label:', err);
            setError('Failed to remove label');
        }
    };

    const handleUpdateColor = async (noteId: string, color: string) => {
        if (!user) {
            setError('Please sign in to update note color');
            return;
        }

        try {
            if (user.isAnonymous) {
                // For anonymous users, update colors locally
                setNotes(notes.map(note => 
                    note.id === noteId ? { ...note, color } : note
                ));
            } else {
                // For authenticated users, update colors via API
                const noteToUpdate = notes.find(note => note.id === noteId);
                if (!noteToUpdate) return;

                const updatedNote = await notesApi.updateNote(noteId, {
                    ...frontendNoteToApiNote(noteToUpdate),
                    isPublic: color === 'bg-yellow-100'
                });

                setNotes(notes.map(note => 
                    note.id === noteId ? apiNoteToFrontendNote(updatedNote) : note
                ));
            }
        } catch (err) {
            console.error('Error updating note color:', err);
            setError('Failed to update note color');
        }
    };

    const handleSelectNote = (noteId: string | null) => {
        setSelectedNoteId(noteId);
        if (noteId) {
            navigate(`/note/${noteId}`);
        }
    };

    // Get unique labels from all notes
    const allLabels = Array.from(new Set(notes.flatMap(note => note.labels))).sort();

    // Filter notes based on selected label
    const filteredNotes = selectedLabel
        ? notes.filter(note => note.labels.includes(selectedLabel))
        : notes;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading notes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                labels={allLabels}
                selectedLabel={selectedLabel}
                onLabelSelect={onLabelSelect}
                notes={notes}
                onSelectNote={handleSelectNote}
                onCreateNote={() => setIsCreating(true)}
            />
            
            <main className="flex-1 overflow-y-auto p-6">
                {isCreating ? (
                    <CreateNote
                        onCreate={handleCreateNote}
                        onCancel={() => setIsCreating(false)}
                    />
                ) : isEditing && selectedNoteId ? (
                    <EditNote
                        note={notes.find(note => note.id === selectedNoteId)!}
                        onSave={handleEditNote}
                        onCancel={() => {
                            setIsEditing(false);
                            setSelectedNoteId(null);
                        }}
                        onDelete={handleDeleteNote}
                    />
                ) : (
                    <ViewNotes
                        notes={filteredNotes}
                        onEditClick={(id) => {
                            setSelectedNoteId(id);
                            setIsEditing(true);
                        }}
                        onUpdateReminder={() => {}} // TODO: Implement reminder functionality
                        onAddLabel={handleAddLabel}
                        onRemoveLabel={handleRemoveLabel}
                        onLabelSelect={onLabelSelect}
                        onUpdateColor={handleUpdateColor}
                        onCreateNote={() => setIsCreating(true)}
                    />
                )}
            </main>
        </div>
    );
};

export default NotesPage; 