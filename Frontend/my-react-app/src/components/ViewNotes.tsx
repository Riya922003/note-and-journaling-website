import React from "react";

type Note = {
  id: string;
  title: string;
  content: string;
};

type ViewNotesProps = {
  notes: Note[];
  onSelect: (id: string) => void;
};

const ViewNotes: React.FC<ViewNotesProps> = ({ notes, onSelect }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
        My Notes
      </h2>
    </div>

    <div className="space-y-3">
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id)}
          className="group cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                  {note.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {note.content}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors duration-200" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-400">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(parseInt(note.id)).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
      
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

export default ViewNotes;
