import { useState, useEffect } from 'react';
import { Search, Calendar, Settings, Plus, Star, Edit, Trash2, Pin, Moon, Sun } from 'lucide-react';
import './NotelyDashboard.css'; // Import your CSS styles

// Main Dashboard Component
export default function NotelyDashboard() {

  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [userName, setUserName] = useState('');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);


  // Form state for creating/editing notes
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Setting username from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  // Fetch notes from the server
  const fetchNotes = async () => {
    const token = localStorage.getItem('token'); // Get the JWT token

    try {
      const response = await fetch('https://notely-backend-api.onrender.com//api/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Attach token here
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();

      // Convert string dates to Date objects
      const formattedNotes = data.map(note => ({
        ...note,
        date: new Date(note.date)
      }));

      setNotes(formattedNotes);

    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Initial fetch of notes
  useEffect(() => {
    fetchNotes();
  }, []);

  // Set form data when editing a note
  useEffect(() => {
    if (editingNote) {
      setNoteTitle(editingNote.title);
      setNoteContent(editingNote.content);
      setNoteTags(editingNote.tags.join(', '));
    } else {
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    }
  }, [editingNote]);

  // Calculate statistics
  const noteStats = {
    total: notes.length,
    totalWords: notes.reduce((sum, note) => sum + note.wordCount, 0),
    pinnedCount: notes.filter(note => note.pinned).length,
    recentlyEdited: notes.filter(note => {
      const daysAgo = (new Date() - note.date) / (1000 * 60 * 60 * 24);
      return daysAgo < 7;
    }).length
  };

  // Filter function
  const getFilteredNotes = () => {
    let filtered = [...notes];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    if (activeFilter === 'pinned') {
      filtered = filtered.filter(note => note.pinned);
    } else if (activeFilter === 'recent') {
      filtered.sort((a, b) => b.date - a.date);
      filtered = filtered.slice(0, 5);
    }

    // Always show pinned notes at top unless searching
    if (!searchQuery && activeFilter !== 'recent') {
      filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.date - a.date;
      });
    }

    return filtered;
  };

  // Functions to handle note actions
  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const tags = noteTags.split(',').map(tag => tag.trim()).filter(Boolean);

    const token = localStorage.getItem('token');

    const noteData = {
      title: noteTitle,
      content: noteContent,
      tags: tags,
      pinned: false
    };

    try {
      const response = await fetch('https://notely-backend-api.onrender.com//api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();

      // Convert the date string to a Date object
      newNote.date = new Date(newNote.date);

      // Add the new note to the state
      setNotes([newNote, ...notes]);
      setShowCreateModal(false);

      // Reset form
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');

    } catch (error) {
      console.error('Error creating note:', error);
      // You might want to add error handling UI here
    }
  };

  const handleEditNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const tags = noteTags.split(',').map(tag => tag.trim()).filter(Boolean);

    const token = localStorage.getItem('token');

    const updatedNoteData = {
      title: noteTitle,
      content: noteContent,
      tags: tags,
      pinned: editingNote.pinned
    };

    try {
      const response = await fetch(`https://notely-backend-api.onrender.com//api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNoteData)
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedNote = await response.json();

      // Convert the date string to a Date object
      updatedNote.date = new Date(updatedNote.date);

      // Update notes state
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));

      // Clear editing state
      setEditingNote(null);

    } catch (error) {
      console.error('Error updating note:', error);
      // You might want to add error handling UI here
    }
  };

  const handleDeleteNote = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://notely-backend-api.onrender.com//api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Remove note from state
      setNotes(notes.filter(note => note.id !== id));

    } catch (error) {
      console.error('Error deleting note:', error);
      // You might want to add error handling UI here
    }
  };

  const togglePin = async (id) => {
    const token = localStorage.getItem('token');
    const noteToUpdate = notes.find(note => note.id === id);

    if (!noteToUpdate) return;

    const updatedPinStatus = !noteToUpdate.pinned;

    try {
      const response = await fetch(`https://notely-backend-api.onrender.com//api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pinned: updatedPinStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update note pin status');
      }

      const updatedNote = await response.json();

      // Convert the date string to a Date object
      updatedNote.date = new Date(updatedNote.date);

      // Update notes state
      setNotes(notes.map(note => note.id === id ? updatedNote : note));

    } catch (error) {
      console.error('Error updating pin status:', error);
      // You might want to add error handling UI here
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };



  // JSX for the dashboard
  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">N</div>
          <h1 className="text-xl font-bold">Notely</h1>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li>
              <button
                onClick={() => setActiveFilter('all')}
                className={`nav-item ${activeFilter === 'all' ? 'active' : ''}`}
              >
                <Search size={18} className="nav-icon" />
                All Notes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveFilter('pinned')}
                className={`nav-item ${activeFilter === 'pinned' ? 'active' : ''}`}
              >
                <Star size={18} className="nav-icon" />
                Favorites
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`nav-item ${activeFilter === 'recent' ? 'active' : ''}`}
              >
                <Edit size={18} className="nav-icon" />
                Recently Edited
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowCalendarView(!showCalendarView)}
                className={`nav-item ${showCalendarView ? 'active' : ''}`}
              >
                <Calendar size={18} className="nav-icon" />
                Calendar View
              </button>
            </li>
          </ul>
        </nav>

        <div className="stats-box">
          <h3 className="stats-title">Note Statistics</h3>
          <div className="stats-list">
            <div className="stats-item">
              <span>Total Notes:</span>
              <span className="stats-value">{noteStats.total}</span>
            </div>
            <div className="stats-item">
              <span>Word Count:</span>
              <span className="stats-value">{noteStats.totalWords}</span>
            </div>
            <div className="stats-item">
              <span>Pinned Notes:</span>
              <span className="stats-value">{noteStats.pinnedCount}</span>
            </div>
          </div>
        </div>

        <div className="toggle-buttons">
          <button
            onClick={toggleDarkMode}
            className={`toggle-button ${darkMode ? 'toggle-dark' : ''}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="settings-dropdown-container">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="toggle-button"
            >
              <Settings size={18} />
            </button>

            {showSettingsDropdown && (
              <div className="settings-dropdown">
                <button
                  onClick={handleLogout}
                  className="settings-dropdown-item"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>



      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <h2 className="header-greeting">Welcome back, {userName}!</h2>
            <p className="header-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="new-note-btn"
            >
              <Plus size={18} />
              New Note
            </button>
          </div>
        </header>

        {/* Main Note Area */}
        <main className="main-area">
          {/* Calendar View (Conditionally Rendered) */}
          {showCalendarView && (
            <div className="calendar-container">
              <h2 className="calendar-title">Calendar View</h2>
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 4; // Start from previous month
                  const hasNote = notes.some(note =>
                    note.date.getDate() === (day > 0 ? day : 30 + day) &&
                    note.date.getMonth() === (day > 0 ? 4 : 3)
                  );

                  return (
                    <div
                      key={i}
                      className={`calendar-day ${day <= 0 || day > 31 ? 'faded' : ''} 
                        ${hasNote ? 'has-note' : ''}`}
                    >
                      <div className="day-content">
                        <span>{day > 0 && day <= 31 ? day : day <= 0 ? 30 + day : day - 31}</span>
                        {hasNote && <div className="note-indicator"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div className="notes-grid">
            {getFilteredNotes().map(note => (
              <div key={note.id} className="note-card">
                {/* Note Header */}
                <div className={`note-header ${note.pinned ? 'pinned' : ''}`}>
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={() => togglePin(note.id)}
                      className={`note-action-btn ${note.pinned ? 'pinned' : ''}`}
                    >
                      <Pin size={16} />
                    </button>
                    <button
                      onClick={() => setEditingNote(note)}
                      className="note-action-btn"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="note-action-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Note Content */}
                <div className="note-content">
                  <p className="note-text">
                    {note.content}
                  </p>

                  {/* Tags */}
                  <div className="note-tags">
                    {note.tags.map(tag => (
                      <span key={tag} className="note-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Note Footer */}
                <div className="note-footer">
                  <span>
                    {note.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span>{note.wordCount} words</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getFilteredNotes().length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-container">
                <Search size={24} />
              </div>
              <h3 className="empty-title">No notes found</h3>
              <p className="empty-message">
                {searchQuery ? 'Try a different search term or tag' : 'Create your first note by clicking the "New Note" button'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Note Modal */}
      {(showCreateModal || editingNote) && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="modal-title">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h2>

              <div className="form-group">
                <div>
                  <label className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Content
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={8}
                    className="form-textarea"
                  ></textarea>
                </div>

                <div>
                  <label className="form-label">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingNote(null);
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? handleEditNote : handleCreateNote}
                  className="btn-primary"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}