import React, { useState } from 'react';
import CreateNote from '../components/CreateNote';
import ViewNote from '../components/ViewNote';
import EditNote from '../components/EditNote';
import Sidebar from '../components/Sidebar';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
};

type NotesPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onSelectNote: (id: string) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: (title: string, content: string, reminder: Date | null) => void;
  onAddLabel: (noteId: string, label: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
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
  labels,
  selectedLabel,
  onLabelSelect,
  selectedNoteId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLabelInput, setShowLabelInput] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");

  const selectedNote = notes.find(note => note.id === selectedNoteId);
  const filteredNotes = selectedLabel 
    ? notes.filter(note => note.labels.includes(selectedLabel))
    : notes;

  const handleCancelViewEdit = () => {
    onSelectNote(null);
    setIsEditing(false);
  };

  const handleLabelKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, noteId: string) => {
    if (e.key === 'Enter' && newLabel.trim()) {
      onAddLabel(noteId, newLabel.trim());
      setNewLabel("");
      setShowLabelInput(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        onUpdateReminder={onUpdateReminder}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={onSelectNote}
        defaultView="notes"
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Keep Clone</h1>
              <input
                type="text"
                placeholder="Search"
                className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {!showCreateForm ? (
              <div
                className="bg-white rounded-lg shadow-md p-4 mb-8 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                onClick={() => {
                  setShowCreateForm(true);
                  onSelectNote(null);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 p-4 cursor-pointer relative"
                  onClick={() => onSelectNote(note.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLabelInput(note.id);
                        }}
                      >
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5c.75 0 1.5.25 2 .75l3.5 3.5c.5.5.75 1.25.75 2V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                      </button>
                      {note.reminder && (
                        <div className="flex items-center text-blue-500">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-5">{note.content}</p>

                  {showLabelInput === note.id ? (
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyPress={(e) => handleLabelKeyPress(e, note.id)}
                        onBlur={() => {
                          setShowLabelInput(null);
                          setNewLabel("");
                        }}
                        placeholder="Add label..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    </div>
                  ) : (
                    note.labels.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.labels.map(label => (
                          <span
                            key={label}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLabelSelect(label);
                            }}
                          >
                            {label}
                            <button
                              className="ml-1 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveLabel(note.id, label);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            {filteredNotes.length === 0 && !showCreateForm && (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No notes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedLabel 
                    ? `No notes with the label "${selectedLabel}"`
                    : "Get started by creating a new note."}
                </p>
              </div>
            )}
          </div>
        </main>

        {selectedNote && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 bg-white w-full max-w-lg mx-auto rounded-lg shadow-xl">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={handleCancelViewEdit}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!isEditing ? (
                <ViewNote
                  note={selectedNote}
                  onEdit={() => setIsEditing(true)}
                  onDelete={(id) => {
                    onDeleteNote(id);
                    handleCancelViewEdit();
                  }}
                  onRemoveReminder={(id) => onUpdateReminder(id, null)}
                />
              ) : (
                <EditNote
                  note={selectedNote}
                  onSave={onEditNote}
                  onCancel={handleCancelViewEdit}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage; 