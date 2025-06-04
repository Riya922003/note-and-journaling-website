import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

type View = 'notes' | 'reminders' | 'labels';

type SidebarProps = {
  notes: Note[];
  labels: string[];
  selectedLabel: string | null;
  onLabelSelect: (label: string | null) => void;
  onSelectNote: (id: string | null) => void;
  defaultView?: View;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  labels,
  selectedLabel,
  onLabelSelect,
  onSelectNote,
  defaultView = 'notes'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<View>(defaultView);

  // Update currentView when location changes
  React.useEffect(() => {
    if (location.pathname === '/reminders') {
      setCurrentView('reminders');
    } else if (location.pathname === '/labels') {
      setCurrentView('labels');
    } else {
      setCurrentView('notes');
    }
  }, [location]);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (view === 'reminders') {
      navigate('/reminders');
    } else if (view === 'labels') {
      navigate('/labels');
    } else {
      navigate('/');
    }
  };

  const handleLabelClick = (label: string) => {
    onLabelSelect(label === selectedLabel ? null : label);
  };

  const handleNoteClick = (noteId: string) => {
    onSelectNote(noteId);
  };

  const notesWithReminders = notes.filter(note => note.reminder !== null);
  const notesWithLabels = notes.filter(note => note.labels.length > 0);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4">
        <button
          onClick={() => handleViewChange('notes')}
          className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
            currentView === 'notes' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => handleViewChange('reminders')}
          className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
            currentView === 'reminders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Reminders ({notesWithReminders.length})
        </button>
        <button
          onClick={() => handleViewChange('labels')}
          className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
            currentView === 'labels' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Labels ({notesWithLabels.length})
        </button>
      </div>

      {currentView === 'labels' && (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Labels</h3>
          <div className="space-y-1">
            {labels.map(label => (
              <button
                key={label}
                onClick={() => handleLabelClick(label)}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  label === selectedLabel ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentView === 'notes' && (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Notes</h3>
          <div className="space-y-1">
            {notes.slice(0, 5).map(note => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 truncate"
              >
                {note.title || 'Untitled Note'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
