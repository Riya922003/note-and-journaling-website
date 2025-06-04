import React, { useState } from 'react';
import CreateNote from '../components/CreateNote';
import EditNote from '../components/EditNote';
import ViewNotes from '../components/ViewNotes';
import Sidebar from '../components/Sidebar';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

type NotesPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onSelectNote: (id: string | null) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: (title: string, content: string) => void;
  onAddLabel: (noteId: string, label: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  onUpdateColor: (noteId: string, color: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
  selectedNoteId: string | null;
};

const NotesPage: React.FC<NotesPageProps> = ({
  notes,
  onUpdateReminder,
  onSelectNote,
  onEditNote,
  onDeleteNote,
  onCreateNote,
  onAddLabel,
  onRemoveLabel,
  onUpdateColor,
  labels,
  selectedLabel,
  onLabelSelect,
  selectedNoteId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  // First filter by search query, then by selected label
  const filteredNotes = notes
    .filter(note => {
      const searchLower = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.labels.some(label => label.toLowerCase().includes(searchLower))
      );
    })
    .filter(note => selectedLabel ? note.labels.includes(selectedLabel) : true);

  const handleCancelViewEdit = () => {
    onSelectNote(null);
    setIsEditing(false);
  };

  const handleSelectNoteOnly = (id: string | null) => {
    onSelectNote(id);
    setIsEditing(false);
  };

  const handleDeleteFromEdit = (id: string) => {
    onDeleteNote(id);
    handleCancelViewEdit();
  };

  const handleOpenEditDialog = (id: string) => {
    onSelectNote(id);
    setIsEditing(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={handleSelectNoteOnly}
        defaultView="notes"
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Keep Clone</h1>
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {!showCreateForm ? (
              <div
                className="bg-white rounded-lg shadow-md p-4 mb-8 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                onClick={() => {
                  setShowCreateForm(true);
                  onSelectNote(null);
                  setIsEditing(false);
                }}
              >
                <input
                  type="text"
                  placeholder="Take a note..."
                  readOnly
                  className="w-full text-gray-700 placeholder-gray-500 focus:outline-none cursor-pointer"
                />
              </div>
            ) : (
              <div className="mb-8">
                <CreateNote
                  onCreate={onCreateNote}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {selectedNote && isEditing ? (
              <EditNote
                note={selectedNote}
                onSave={onEditNote}
                onCancel={handleCancelViewEdit}
                onDelete={handleDeleteFromEdit}
              />
            ) : (
              <ViewNotes
                notes={filteredNotes}
                onEditClick={handleOpenEditDialog}
                onUpdateReminder={onUpdateReminder}
                onAddLabel={onAddLabel}
                onRemoveLabel={onRemoveLabel}
                onLabelSelect={onLabelSelect}
                onUpdateColor={onUpdateColor}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotesPage; 