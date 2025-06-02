import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotesPage from './pages/NotesPage'
import RemindersPage from './pages/RemindersPage'
import LabelsPage from './pages/LabelsPage'

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Get unique labels from all notes
  const allLabels = Array.from(new Set(notes.flatMap(note => note.labels))).sort();

  const handleCreateNote = (title: string, content: string, reminder: Date | null) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      reminder,
      labels: []
    };
    setNotes([newNote, ...notes]);
  };

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

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleUpdateReminder = (noteId: string, reminder: Date | null) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, reminder } 
        : note
    ));
  };

  const handleLabelSelect = (label: string | null) => {
    setSelectedLabel(label);
  };

  const handleAddLabel = (noteId: string, label: string) => {
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

  const handleRemoveLabel = (noteId: string, label: string) => {
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

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <NotesPage
            notes={notes}
            onUpdateReminder={handleUpdateReminder}
            onSelectNote={handleSelectNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onCreateNote={handleCreateNote}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
            labels={allLabels}
            selectedLabel={selectedLabel}
            onLabelSelect={handleLabelSelect}
            selectedNoteId={selectedNoteId}
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
            onAddLabel={handleAddLabel}
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
            onUpdateReminder={handleUpdateReminder}
            onSelectNote={handleSelectNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onAddLabel={handleAddLabel}
            onRemoveLabel={handleRemoveLabel}
            labels={allLabels}
            selectedLabel={selectedLabel}
            onLabelSelect={handleLabelSelect}
            selectedNoteId={selectedNoteId}
          />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
