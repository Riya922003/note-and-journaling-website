import React from 'react';
import Sidebar from '../components/Sidebar';
import ViewNote from '../components/ViewNote';
import EditNote from '../components/EditNote';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
};

type LabelsPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onSelectNote: (id: string) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onAddLabel: (noteId: string, label: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
  selectedNoteId: string | null;
};

const LabelsPage: React.FC<LabelsPageProps> = ({
  notes,
  onUpdateReminder,
  onSelectNote,
  onEditNote,
  onDeleteNote,
  onAddLabel,
  onRemoveLabel,
  labels,
  selectedLabel,
  onLabelSelect,
  selectedNoteId
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  const filteredNotes = selectedLabel 
    ? notes.filter(note => note.labels.includes(selectedLabel))
    : [];

  const handleCancelViewEdit = () => {
    onSelectNote(null);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        defaultView="labels"
      />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedLabel ? `Notes with label "${selectedLabel}"` : 'Select a label'}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 p-4 cursor-pointer"
                onClick={() => onSelectNote(note.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                  {note.reminder && (
                    <div className="flex items-center text-blue-500">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
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
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && selectedLabel && (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5c.75 0 1.5.25 2 .75l3.5 3.5c.5.5.75 1.25.75 2V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No notes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No notes with the label "{selectedLabel}"
              </p>
            </div>
          )}
        </div>
      </div>

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
  );
};

export default LabelsPage; 