import React from 'react';

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
};

type RemindersViewProps = {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
};

const RemindersView: React.FC<RemindersViewProps> = ({ notes, onSelectNote, onUpdateReminder }) => {
  const notesWithReminders = notes.filter(note => note.reminder !== null);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Reminders
        </h2>
      </div>

      {notesWithReminders.length > 0 ? (
        <div className="space-y-4">
          {notesWithReminders.map(note => (
            <div
              key={note.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => onSelectNote(note.id)}
                    className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {note.content}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                  <button
                    onClick={() => onSelectNote(note.id)}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onUpdateReminder(note.id, null)}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {note.reminder?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Reminders Set</h3>
          <p className="text-gray-500">Add reminders to your notes to see them here!</p>
        </div>
      )}
    </div>
  );
};

export default RemindersView; 