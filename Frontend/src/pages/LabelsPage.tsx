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

type LabelsPageProps = {
  notes: Note[];
  onSelectNote: (id: string | null) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onAddLabel: (noteId: string, label: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  onUpdateColor: (noteId: string, color: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
  selectedNoteId: string | null;
};

const LabelsPage: React.FC<LabelsPageProps> = ({
  notes,
  onSelectNote,
  onEditNote,
  onDeleteNote,
  onAddLabel,
  onRemoveLabel,
  onUpdateColor,
  labels,
  selectedLabel,
  onLabelSelect,
  selectedNoteId
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState<string | null>(null);
  const [showLabelInput, setShowLabelInput] = React.useState<string | null>(null);
  const [newLabel, setNewLabel] = React.useState("");
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  const PASTEL_COLORS = [
    "bg-red-100", "bg-yellow-100", "bg-green-100", "bg-blue-100", "bg-indigo-100", "bg-purple-100", "bg-pink-100",
    "bg-red-200", "bg-yellow-200", "bg-green-200", "bg-blue-200", "bg-indigo-200", "bg-purple-200", "bg-pink-200",
  ];

  // Show all notes with labels when no label is selected, filter when a label is selected
  const filteredNotes = selectedLabel 
    ? notes.filter(note => note.labels.includes(selectedLabel))
    : notes.filter(note => note.labels.length > 0);  // Show only notes that have labels

  const handleCancelViewEdit = () => {
    onSelectNote(null);
    setIsEditing(false);
  };

  const handleEditNote = (id: string, title: string, content: string, reminder: Date | null) => {
    onEditNote(id, title, content, reminder);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={onSelectNote}
        defaultView="labels"
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedLabel 
                ? `Notes with label "${selectedLabel}"` 
                : 'All Labeled Notes'}
            </h1>
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
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setShowColorPicker(showColorPicker === note.id ? null : note.id)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </button>
                    {showColorPicker === note.id && (
                      <div className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="grid grid-cols-4 gap-2">
                          {PASTEL_COLORS.map(color => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full ${color} hover:ring-2 hover:ring-gray-300`}
                              onClick={() => {
                                onUpdateColor(note.id, color);
                                setShowColorPicker(null);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-4">{note.content}</p>
                  
                  {note.reminder && (
                    <div className="text-sm text-gray-500 mb-2">
                      Reminder: {note.reminder.toLocaleString()}
                    </div>
                  )}

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
                    <button
                      onClick={() => setShowLabelInput(note.id)}
                      className="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-full border border-blue-200"
                    >
                      + Add Label
                    </button>
                    {showLabelInput === note.id && (
                      <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <input
                          type="text"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newLabel.trim()) {
                              onAddLabel(note.id, newLabel.trim());
                              setNewLabel("");
                              setShowLabelInput(null);
                            }
                          }}
                          placeholder="Enter label..."
                          className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    )}
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
                      onClick={() => onDeleteNote(note.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes with labels found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LabelsPage; 