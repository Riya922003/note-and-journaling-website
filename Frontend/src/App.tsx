import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotesPage from './pages/NotesPage'
import RemindersPage from './pages/RemindersPage'
import LabelsPage from './pages/LabelsPage'
import NoteViewPage from './pages/NoteViewPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

const AppRoutes: React.FC = () => {
  const { user, signInAnonymouslyUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Sign in anonymously when the app loads if there's no user
  useEffect(() => {
    if (!user) {
      signInAnonymouslyUser();
    }
  }, [user, signInAnonymouslyUser]);

  // Get unique labels from all notes
  const allLabels = Array.from(new Set(notes.flatMap(note => note.labels))).sort();

  const handleEditNote = (id: string, title: string, content: string, reminder: Date | null) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title, content, reminder } : note
    ));
    setSelectedNoteId(null);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const handleSelectNote = (id: string | null) => {
    setSelectedNoteId(id);
  };

  const handleUpdateReminder = (noteId: string, reminder: Date | null) => {
    console.log('Updating reminder in App.tsx:', { noteId, reminder });
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        console.log('Updating note:', note.id, 'New reminder:', reminder);
        return { ...note, reminder };
      }
      return note;
    }));
  };

  const handleLabelSelect = (label: string | null) => {
    setSelectedLabel(label);
  };

  const handleAddLabel = (noteId: string | null, label: string) => {
    if (!noteId) return;
    setNotes(notes.map(note => {
      if (note.id === noteId && !note.labels.includes(label)) {
        return {
          ...note,
          labels: [...note.labels, label]
        };
      }
      return note;
    }));
  };

  const handleRemoveLabel = (noteId: string | null, label: string) => {
    if (!noteId) return;
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          labels: note.labels.filter(l => l !== label)
        };
      }
      return note;
    }));
  };

  const handleUpdateColor = (noteId: string | null, color: string) => {
    if (!noteId) return;
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, color } : note
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <NotesPage
                selectedLabel={selectedLabel}
                onLabelSelect={handleLabelSelect}
              />
            } 
          />
          <Route 
            path="/note/:noteId" 
            element={
              <NoteViewPage
                notes={notes}
                onUpdateReminder={handleUpdateReminder}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onRemoveLabel={handleRemoveLabel}
                onUpdateColor={handleUpdateColor}
                labels={allLabels}
                selectedLabel={selectedLabel}
                onLabelSelect={handleLabelSelect}
              />
            } 
          />
          <Route 
            path="/reminders" 
            element={
              <RemindersPage
                notes={notes}
                onUpdateReminder={handleUpdateReminder}
                onSelectNote={handleSelectNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onRemoveLabel={handleRemoveLabel}
                labels={allLabels}
                selectedLabel={selectedLabel}
                onLabelSelect={handleLabelSelect}
                selectedNoteId={selectedNoteId}
              />
            } 
          />
          <Route 
            path="/labels" 
            element={
              <LabelsPage
                notes={notes}
                onSelectNote={handleSelectNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onAddLabel={handleAddLabel}
                onRemoveLabel={handleRemoveLabel}
                onUpdateColor={handleUpdateColor}
                labels={allLabels}
                selectedLabel={selectedLabel}
                onLabelSelect={handleLabelSelect}
                selectedNoteId={selectedNoteId}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
