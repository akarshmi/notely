import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Settings, Plus, Star, Edit, Trash2, Pin, Moon, Sun } from 'lucide-react';
import './NotelyDashboard.css'; // Import your CSS styles


const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [userName, setUserName] = useState('');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteStats, setNoteStats] = useState({
    total: 0,
    totalWords: 0,
    pinnedCount: 0,
    recentlyEdited: 0
  });
  
  // Form state for creating/editing notes
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Check authentication and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.username);
    }
    
    // Fetch notes
    fetchNotes();
    // Fetch stats
    fetchStats();
  }, [navigate]);

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

  // Fetch notes from the API
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Fetch note statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setNoteStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
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
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      filtered = filtered.slice(0, 5);
    }
    
    // Always show pinned notes at top unless searching
    if (!searchQuery && activeFilter !== 'recent') {
      filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
      });
    }
    
    return filtered;
  };

  // Create a new note
  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    const tags = noteTags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          tags: tags,
          pinned: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setShowCreateModal(false);
      
      // Reset form
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
      
      // Update stats
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Edit an existing note
  const handleEditNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    const tags = noteTags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          tags: tags,
          pinned: editingNote.pinned
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      const updatedNote = await response.json();
      
      setNotes(notes.map(note => 
        note.id === editingNote.id ? updatedNote : note
      ));
      
      setEditingNote(null);
      
      // Update stats
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      setNotes(notes.filter(note => note.id !== id));
      
      // Update stats
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Toggle pin status
  const togglePin = async (id) => {
    const noteToUpdate = notes.find(note => note.id === id);
    
    if (!noteToUpdate) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pinned: !noteToUpdate.pinned
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      const updatedNote = await response.json();
      
      setNotes(notes.map(note => 
        note.id === id ? updatedNote : note
      ));
      
      // Update stats
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can store the preference in localStorage if needed
    localStorage.setItem('darkMode', !darkMode);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
          <button className="toggle-button" onClick={handleLogout}>
            <Settings size={18} />
          </button>
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
          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your notes...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="error-container">
              <p className="error-message">Error: {error}</p>
              <button onClick={fetchNotes} className="retry-button">Retry</button>
            </div>
          )}
          
          {/* Calendar View (Conditionally Rendered) */}
          {!isLoading && !error && showCalendarView && (
            <div className="calendar-container">
              <h2 className="calendar-title">Calendar View</h2>
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-header">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const currentDate = new Date();
                  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
                  const day = i - firstDay + 1;
                  const month = currentDate.getMonth();
                  const year = currentDate.getFullYear();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  
                  const hasNote = notes.some(note => {
                    const noteDate = new Date(note.date);
                    return noteDate.getDate() === day && 
                           noteDate.getMonth() === month && 
                           noteDate.getFullYear() === year;
                  });
                  
                  return (
                    <div 
                      key={i} 
                      className={`calendar-day ${day <= 0 || day > daysInMonth ? 'faded' : ''} 
                        ${hasNote ? 'has-note' : ''}`}
                    >
                      <div className="day-content">
                        <span>{day > 0 && day <= daysInMonth ? day : ''}</span>
                        {hasNote && <div className="note-indicator"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {!isLoading && !error && (
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
                      {formatDate(note.date)}
                    </span>
                    <span>{note.wordCount} words</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && getFilteredNotes().length === 0 && (
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
};

export default Dashboard;