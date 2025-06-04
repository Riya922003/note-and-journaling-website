import React, { useState, useEffect } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
};

type EditNoteProps = {
  note: Note;
  onSave: (id: string, title: string, content: string, reminder: Date | null) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

const EditNote: React.FC<EditNoteProps> = ({ note, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [reminderDate, setReminderDate] = useState(note.reminder ? note.reminder.toISOString().split('T')[0] : "");
  const [reminderTime, setReminderTime] = useState(note.reminder ? note.reminder.toTimeString().slice(0, 5) : "");

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setReminderDate(note.reminder ? note.reminder.toISOString().split('T')[0] : "");
    setReminderTime(note.reminder ? note.reminder.toTimeString().slice(0, 5) : "");
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
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
      onSave(note.id, title, content, reminder);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 max-h-[90vh] flex flex-col">
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
            Edit Note
          </h2>
        </div>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <div className="relative flex-1 flex flex-col min-h-0">
            <textarea
              placeholder="Write your note content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 resize-none min-h-[200px] overflow-y-auto break-words"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
              {content.length} characters
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="reminder-date" className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
              <input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={e => setReminderDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 mb-1">Reminder Time (Optional)</label>
              <input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-4 border-t border-gray-100">
          <button 
            type="submit"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </span>
          </button>
          <button 
            type="button"
            onClick={() => onDelete(note.id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Delete</span>
            </span>
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;