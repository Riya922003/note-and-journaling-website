import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
  labels: string[];
  color?: string;
};

type ViewNotesProps = {
  notes: Note[];
  onEditClick: (id: string) => void;
  onUpdateReminder: (noteId: string, reminder: Date | null) => void;
  onAddLabel: (noteId: string, label: string) => void;
  onRemoveLabel: (noteId: string, label: string) => void;
  onLabelSelect: (label: string | null) => void;
  onUpdateColor: (noteId: string, color: string) => void;
  onCreateNote?: () => void;
};

const PASTEL_COLORS = [
  "bg-red-100", "bg-yellow-100", "bg-green-100", "bg-blue-100", "bg-indigo-100", "bg-purple-100", "bg-pink-100",
  "bg-red-200", "bg-yellow-200", "bg-green-200", "bg-blue-200", "bg-indigo-200", "bg-purple-200", "bg-pink-200",
];

const ViewNotes: React.FC<ViewNotesProps> = ({ 
  notes, 
  onEditClick,
  onUpdateReminder,
  onAddLabel,
  onRemoveLabel,
  onLabelSelect,
  onUpdateColor,
  onCreateNote
}) => {
  const navigate = useNavigate();
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [showEditMenu, setShowEditMenu] = useState<string | null>(null);
  const [showLabelInput, setShowLabelInput] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const editMenuRef = useRef<HTMLDivElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close date picker, edit menu, and label input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(null);
        setReminderDate(null);
        setReminderTime(null);
      }
      if (editMenuRef.current && !editMenuRef.current.contains(event.target as Node)) {
        setShowEditMenu(null);
      }
      if (labelInputRef.current && !labelInputRef.current.contains(event.target as Node)) {
        setShowLabelInput(null);
        setNewLabel("");
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReminderClick = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Opening reminder picker for note:', note);
    console.log('Current reminder:', note.reminder);
    setShowDatePicker(note.id);
    setReminderDate(note.reminder ? new Date(note.reminder) : new Date());
    setReminderTime(note.reminder ? new Date(note.reminder) : new Date());
    setShowEditMenu(null);
    setShowLabelInput(null);
    setShowColorPicker(null);
  };

  const handleEditClick = (noteId: string) => {
    onEditClick(noteId);
  };

  const handleLabelIconClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setShowLabelInput(noteId);
    setNewLabel("");
    setShowEditMenu(null);
    setShowDatePicker(null);
    setShowColorPicker(null);
  };

  const handleColorIconClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setShowColorPicker(noteId);
    setShowEditMenu(null);
    setShowDatePicker(null);
    setShowLabelInput(null);
  };

  const handleSaveReminder = (noteId: string) => {
    console.log('Saving reminder for note:', noteId);
    console.log('Reminder date:', reminderDate);
    console.log('Reminder time:', reminderTime);
    
    const combinedDateTime = reminderDate && reminderTime
      ? moment(reminderDate).set({
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
        second: reminderTime.getSeconds(),
      }).toDate()
      : reminderDate;
    
    console.log('Combined date time:', combinedDateTime);
    onUpdateReminder(noteId, combinedDateTime || null);
    setShowDatePicker(null);
  };

  const handleRemoveReminder = (noteId: string) => {
    onUpdateReminder(noteId, null);
    setShowDatePicker(null);
  };

  const handleLabelKeyPress = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === "Enter" && newLabel.trim() !== "") {
      e.preventDefault();
      onAddLabel(noteId, newLabel.trim());
      setNewLabel("");
      setShowLabelInput(null);
    }
  };

  const handleRemoveLabelClick = (noteId: string, label: string) => {
    onRemoveLabel(noteId, label);
  };

  const handleColorSelect = (noteId: string, color: string) => {
    onUpdateColor(noteId, color);
    setShowColorPicker(null);
  };

  const handleNoteClick = (noteId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or interactive elements
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('input') ||
      showDatePicker === noteId ||
      showEditMenu === noteId ||
      showLabelInput === noteId ||
      showColorPicker === noteId
    ) {
      return;
    }
    navigate(`/note/${noteId}`);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            My Notes
          </h2>
        </div>
        {onCreateNote && (
          <button
            onClick={onCreateNote}
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Note
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={(e) => handleNoteClick(note.id, e)}
              onMouseEnter={() => setHoveredNoteId(note.id)}
              onMouseLeave={() => {
                if (!showDatePicker && !showEditMenu && !showLabelInput && !showColorPicker) {
                  setHoveredNoteId(null);
                }
              }}
              className={`group relative cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] aspect-square ${note.color || 'bg-white'}`}
            >
              <div 
                className={`h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col`}
              >
                {/* Note Header */}
                <div className="p-3 flex-1 min-h-0 relative">
                  {/* Reminder Bell Icon */}
                  {note.reminder && (
                    <div className="absolute top-2 right-2 text-blue-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-[8] overflow-hidden">
                    {note.content}
                  </p>
                </div>

                {/* Note Footer */}
                <div className="p-2 border-t border-gray-100/50">
                  {/* Labels Display */}
                  {note.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.labels.map(label => (
                        <span
                          key={label}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                              handleRemoveLabelClick(note.id, label);
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Icons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400">
                      <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(parseInt(note.id)).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      {(hoveredNoteId === note.id || showDatePicker === note.id || showEditMenu === note.id || showLabelInput === note.id || showColorPicker === note.id) && (
                        <>
                          {/* Color Picker Icon */}
                          <button
                            onClick={(e) => handleColorIconClick(e, note.id)}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors duration-200"
                            title="Change color"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                          </button>

                          {/* Label Icon */}
                          <button
                            onClick={(e) => handleLabelIconClick(e, note.id)}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors duration-200"
                            title="Add label"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5c.75 0 1.5.25 2 .75l3.5 3.5c.5.5.75 1.25.75 2V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                            </svg>
                          </button>

                          {/* Reminder Icon */}
                          <button
                            onClick={(e) => handleReminderClick(e, note)}
                            className={`p-1 rounded-full transition-colors duration-200 ${
                              note.reminder ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={note.reminder ? 'Change reminder' : 'Add reminder'}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>

                          {/* Edit Icon */}
                          <button
                            onClick={() => handleEditClick(note.id)}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors duration-200"
                            title="Edit note"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dropdowns and Popups */}
                {showLabelInput === note.id && (
                  <div 
                    ref={labelInputRef}
                    className="absolute right-0 bottom-full mb-2 mr-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyPress={(e) => handleLabelKeyPress(e, note.id)}
                      placeholder="Add label..."
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                )}

                {showDatePicker === note.id && (
                  <div ref={datePickerRef} className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Set Reminder</h3>
                      <button
                        onClick={() => setShowDatePicker(null)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <DatePicker
                          selected={reminderDate}
                          onChange={(date: Date | null) => setReminderDate(date)}
                          dateFormat="MMMM d, yyyy"
                          inline
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <DatePicker
                          selected={reminderTime}
                          onChange={(time: Date | null) => setReminderTime(time)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeFormat="HH:mm"
                          dateFormat="h:mm aa"
                          inline
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <button
                        onClick={() => handleSaveReminder(note.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleRemoveReminder(note.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {showEditMenu === note.id && (
                  <div 
                    ref={editMenuRef}
                    className="absolute right-0 bottom-full mb-2 mr-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEditClick(note.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveLabelClick(note.id, note.labels[0])}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {/* Color Picker Popup */}
                {showColorPicker === note.id && (
                  <div 
                    ref={colorPickerRef}
                    className="absolute right-0 bottom-full mb-2 mr-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-5 gap-1">
                      {PASTEL_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(note.id, color)}
                          className={`w-6 h-6 rounded-full ${color} border border-gray-300`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {notes.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Notes Yet</h3>
            <p className="text-gray-500">Create your first note to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNotes;
