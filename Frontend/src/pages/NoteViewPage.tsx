import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EditNote from '../components/EditNote';

// Define pastel colors array
const PASTEL_COLORS = [
  "bg-red-100", "bg-yellow-100", "bg-green-100", "bg-blue-100", "bg-indigo-100", "bg-purple-100", "bg-pink-100",
  "bg-red-200", "bg-yellow-200", "bg-green-200", "bg-blue-200", "bg-indigo-200", "bg-purple-200", "bg-pink-200",
] as const;

type PastelColor = typeof PASTEL_COLORS[number];

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

type NoteViewPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onEditNote: (id: string, title: string, content: string, reminder: Date | null) => void;
  onDeleteNote: (id: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  onUpdateColor: (noteId: string, color: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
};

const NoteViewPage: React.FC<NoteViewPageProps> = ({
  notes,
  onUpdateReminder,
  onEditNote,
  onDeleteNote,
  onRemoveLabel,
  onUpdateColor,
  labels,
  selectedLabel,
  onLabelSelect,
}) => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const colorPickerRef = React.useRef<HTMLDivElement>(null);

  const note = notes.find(n => n.id === noteId);

  // Close color picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorSelect = (color: string) => {
    if (note) {
      onUpdateColor(note.id, color);
      setShowColorPicker(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEdit = (id: string, title: string, content: string, reminder: Date | null) => {
    onEditNote(id, title, content, reminder);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    onDeleteNote(id);
    navigate('/');
  };

  if (!note) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          notes={notes}
          labels={labels}
          selectedLabel={selectedLabel}
          onLabelSelect={onLabelSelect}
          onSelectNote={(id) => id && navigate(`/note/${id}`)}
          defaultView="notes"
        />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
            <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={(id) => id && navigate(`/note/${id}`)}
        defaultView="notes"
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Change Color
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="inline-flex items-center px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {showColorPicker && (
            <div 
              ref={colorPickerRef}
              className="absolute right-0 mt-2 mr-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
            >
              <div className="grid grid-cols-5 gap-1">
                {PASTEL_COLORS.map((color: PastelColor) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-6 h-6 rounded-full ${color} border border-gray-300`}
                  />
                ))}
              </div>
            </div>
          )}

          {isEditing ? (
            <EditNote
              note={note}
              onSave={handleEdit}
              onCancel={handleCancelEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className={`bg-white rounded-lg shadow-lg p-8 ${note.color || ''}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
              
              {note.reminder && (
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-md px-3 py-2 mb-4">
                  <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reminder: {note.reminder.toLocaleString()}
                  <button
                    onClick={() => onUpdateReminder(note.id, null)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              {note.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.labels.map(label => (
                    <span
                      key={label}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {label}
                      <button
                        onClick={() => onRemoveLabel(note.id, label)}
                        className="ml-2 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Created: {new Date(parseInt(note.id)).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NoteViewPage; 