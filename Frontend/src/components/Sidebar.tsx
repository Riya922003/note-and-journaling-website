import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type SidebarProps = {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    reminder: Date | null;
    labels: string[];
  }>;
  labels: string[];
  defaultView?: 'notes' | 'reminders' | 'labels';
};

type View = 'notes' | 'reminders' | 'labels';

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  labels,
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

  const notesWithReminders = notes.filter(note => note.reminder !== null);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4">
        <div className="space-y-2">
          <button
            onClick={() => handleViewChange('notes')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentView === 'notes' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Notes
          </button>

          <button
            onClick={() => handleViewChange('reminders')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentView === 'reminders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reminders</span>
            </div>
            {notesWithReminders.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {notesWithReminders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleViewChange('labels')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentView === 'labels' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5c.75 0 1.5.25 2 .75l3.5 3.5c.5.5.75 1.25.75 2V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <span>Labels</span>
            </div>
            {labels.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {labels.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
