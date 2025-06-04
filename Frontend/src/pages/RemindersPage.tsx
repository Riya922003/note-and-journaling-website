import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EditNote from '../components/EditNote';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

type RemindersPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onSelectNote: (id: string | null) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
  selectedNoteId: string | null;
};

const RemindersPage: React.FC<RemindersPageProps> = ({
  notes,
  onUpdateReminder,
  onSelectNote,
  onEditNote,
  onDeleteNote,
  onRemoveLabel,
  labels,
  selectedLabel,
  onLabelSelect,
  selectedNoteId
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const navigate = useNavigate();
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleCancelViewEdit = () => {
    onSelectNote(null);
    setIsEditing(false);
  };

  const handleEditNote = (id: string, title: string, content: string, reminder: Date | null) => {
    onEditNote(id, title, content, reminder);
    setIsEditing(false);
  };

  // Filter notes to show only those with reminders
  const notesWithReminders = notes.filter(note => note.reminder !== null);
  
  // Further filter by selected label if one is selected
  const filteredNotes = selectedLabel 
    ? notesWithReminders.filter(note => note.labels.includes(selectedLabel))
    : notesWithReminders;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={onSelectNote}
        defaultView="reminders"
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              title="Go to Home"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
          {selectedNote && isEditing ? (
            <EditNote
              note={selectedNote}
              onSave={handleEditNote}
              onCancel={handleCancelViewEdit}
              onDelete={onDeleteNote}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`relative rounded-lg shadow-md p-4 ${note.color || 'bg-white'} hover:shadow-lg transition-shadow duration-200`}
                >
                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-4">{note.content}</p>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    Reminder: {note.reminder?.toLocaleString()}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.labels.map(label => (
                      <span
                        key={label}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        onClick={() => onRemoveLabel(note.id, label)}
                      >
                        {label} ×
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        onSelectNote(note.id);
                        setIsEditing(true);
                      }}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onUpdateReminder(note.id, null)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Remove Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reminders found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RemindersPage; 