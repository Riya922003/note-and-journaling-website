import React from 'react';
import { useNavigate } from 'react-router-dom';
import RemindersView from '../components/RemindersView';
import Sidebar from '../components/Sidebar';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
};

type RemindersPageProps = {
  notes: Note[];
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
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

const RemindersPage: React.FC<RemindersPageProps> = ({
  notes,
  onUpdateReminder,
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        notes={notes}
        onUpdateReminder={onUpdateReminder}
        labels={labels}
        selectedLabel={selectedLabel}
        onLabelSelect={onLabelSelect}
        onSelectNote={onSelectNote}
        defaultView="reminders"
      />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <RemindersView
            notes={notes}
            onSelectNote={onSelectNote}
            onUpdateReminder={onUpdateReminder}
            onNavigateHome={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

export default RemindersPage; 