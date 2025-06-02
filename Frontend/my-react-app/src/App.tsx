import { useState } from 'react'
import CreateNote from './components/CreateNote'
// import ViewNotes from './components/ViewNotes'
import ViewNote from './components/ViewNote'
import EditNote from './components/EditNote'
import Sidebar from './components/Sidebar'

type Note = {
  id: string;
  title: string;
  content: string;
  reminder: Date | null;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleCreateNote = (title: string, content: string, reminder: Date | null) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      reminder
    };
    setNotes([newNote, ...notes]);
    setShowCreateForm(false);
  };

  const handleEditNote = (id: string, title: string, content: string, reminder: Date | null) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title, content, reminder } : note
    ));
    setIsEditing(false);
    setSelectedNoteId(null);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setIsEditing(false);
    }
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsEditing(false);
    setShowCreateForm(false);
  }

  const handleCancelViewEdit = () => {
    setSelectedNoteId(null);
    setIsEditing(false);
  }

  const handleUpdateReminder = (noteId: string, reminder: Date | null) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, reminder } 
        : note
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        notes={notes} 
        onUpdateReminder={handleUpdateReminder}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header/Search Area (Basic placeholder) */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Hamburger menu icon can go here */}
              {/* <button className="text-gray-500 hover:text-gray-600 lg:hidden">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button> */}
              <h1 className="text-xl font-semibold text-gray-800">Keep Clone</h1>
              {/* Basic Search Input */}
              <input
                type="text"
                placeholder="Search"
                className="hidden md:block flex-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Icons for refresh, list/grid view toggle, settings could go here */}
            </div>
          </div>
        </header>

        {/* Main Note Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* "Take a note" input area */}
            {!showCreateForm ? (
              <div
                className="bg-white rounded-lg shadow-md p-4 mb-8 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                onClick={() => {
                  setShowCreateForm(true);
                  setSelectedNoteId(null);
                }}
              >
                <input
                  type="text"
                  placeholder="Take a note..."
                  readOnly
                  className="w-full text-gray-700 placeholder-gray-500 focus:outline-none cursor-pointer"
                />
                 {/* Add icons for checklists, drawing, image etc. here */}
              </div>
            ) : (
              <div className="mb-8">
                 <CreateNote 
                   onCreate={handleCreateNote} 
                   onCancel={() => setShowCreateForm(false)}
                 />
              </div>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 p-4 cursor-pointer flex flex-col justify-between"
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                      {note.reminder && (
                        <div className="flex items-center text-blue-500" title={`Reminder set for ${note.reminder.toLocaleString()}`}>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.405L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-5">{note.content}</p>
                  </div>

                  {note.reminder && (
                    <div className="mt-4 text-xs text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {note.reminder.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {notes.length === 0 && !showCreateForm && (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No notes yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new note.</p>
              </div>
            )}
          </div>
        </main>

        {/* Selected Note View/Edit Modal or Section */}
        {selectedNote && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
             <div className="relative p-8 bg-white w-full max-w-lg mx-auto rounded-lg shadow-xl">
               {/* Close button */}
               <button
                 className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                 onClick={handleCancelViewEdit}
               >
                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>

               {/* Render ViewNote or EditNote */}
               {!isEditing ? (
                 <ViewNote
                   note={selectedNote}
                   onEdit={() => setIsEditing(true)}
                   onDelete={(id) => {
                     handleDeleteNote(id);
                     handleCancelViewEdit();
                   }}
                 />
               ) : (
                 <EditNote
                   note={selectedNote}
                   onSave={handleEditNote}
                   onCancel={handleCancelViewEdit}
                 />
               )}
             </div>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;
