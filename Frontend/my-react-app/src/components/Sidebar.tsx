import React, { useState } from 'react';

type SidebarProps = {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    reminder: Date | null;
  }>;
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ notes, onUpdateReminder }) => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNoteId) {
      let reminder: Date | null = null;
      if (reminderDate && reminderTime) {
        try {
          const dateTimeString = `${reminderDate}T${reminderTime}:00`;
          reminder = new Date(dateTimeString);
          if (isNaN(reminder.getTime())) {
            reminder = null;
            console.error("Invalid reminder date or time");
          }
        } catch (error) {
          console.error("Error creating reminder Date object:", error);
          reminder = null;
        }
      } else if (reminderDate) {
        try {
          const date = new Date(reminderDate);
          if (!isNaN(date.getTime())) {
            date.setHours(0, 0, 0, 0);
            reminder = date;
          } else {
            console.error("Invalid reminder date");
          }
        } catch (error) {
          console.error("Error creating reminder Date object (date only):", error);
        }
      }
      onUpdateReminder(selectedNoteId, reminder);
      setShowReminderModal(false);
      setSelectedNoteId(null);
      setReminderDate("");
      setReminderTime("");
    }
  };

  const handleNoteSelect = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNoteId(noteId);
      setReminderDate(note.reminder ? note.reminder.toISOString().split('T')[0] : "");
      setReminderTime(note.reminder ? note.reminder.toTimeString().slice(0, 5) : "");
      setShowReminderModal(true);
    }
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
        <div className="p-4 space-y-2">
          {/* Notes Link */}
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-yellow-100 rounded-full font-semibold hover:bg-yellow-200 transition-colors duration-200">
            <svg className="h-5 w-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2.5-10a4.5 4.5 0 010 9c-.835 0-2.826-.445-4.5-.915-1.674.47-3.665.915-4.5.915a4.5 4.5 0 010-9z"></path>
            </svg>
            Notes
          </a>

          {/* Reminders Section */}
          <div className="mt-6">
            <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Reminders</div>
            {notes.map(note => (
              <button
                key={note.id}
                onClick={() => handleNoteSelect(note.id)}
                className="w-full flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 text-left"
              >
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                  {note.reminder && (
                    <p className="text-xs text-gray-500">
                      {note.reminder.toLocaleString()}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Labels Section */}
          <div className="mt-6">
            <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Labels</div>
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5c.75 0 1.5.25 2 .75l3.5 3.5c.5.5.75 1.25.75 2V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"></path>
              </svg>
              blog
            </a>
            
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l8.5-8.5z"></path>
              </svg>
              Edit labels
            </a>
          </div>

          {/* Archive and Bin Links */}
          <div className="mt-6">
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
              Archive
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Bin
            </a>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReminderModal(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <form onSubmit={handleReminderSubmit} className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Set Reminder
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="reminder-date" className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
                    <input
                      id="reminder-date"
                      type="date"
                      value={reminderDate}
                      onChange={e => setReminderDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 mb-1">Reminder Time (Optional)</label>
                    <input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Reminder</span>
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (selectedNoteId) {
                      onUpdateReminder(selectedNoteId, null);
                    }
                    setShowReminderModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove Reminder</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
