import React, { useState } from "react";

type CreateNoteProps = {
  onCreate: (title: string, content: string, reminder: Date | null) => void;
  onCancel: () => void;
};

const CreateNote: React.FC<CreateNoteProps> = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onCreate(title, content, null); // Always create note without reminder initially
      setTitle("");
      setContent("");
      onCancel(); // Close the dialog after creating the note
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Create New Note
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              placeholder="Write your note content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 min-h-[200px] resize-y"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {content.length} characters
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Note</span>
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

export default CreateNote;