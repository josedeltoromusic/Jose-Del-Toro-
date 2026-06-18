import { useState } from 'react';
import { Biography, Release, Book, WritingPost, MusicEvent, LessonPricing, Inquiry } from '../types';
import { 
  Plus, Trash2, Save, RotateCcw, Download, Check, 
  BookOpen, Music, Calendar, FileText, User, DollarSign, Inbox, Mail, FileUp
} from 'lucide-react';

interface AdminPanelProps {
  biography: Biography;
  setBiography: (b: Biography) => void;
  releases: Release[];
  setReleases: (r: Release[]) => void;
  books: Book[];
  setBooks: (b: Book[]) => void;
  writings: WritingPost[];
  setWritings: (w: WritingPost[]) => void;
  events: MusicEvent[];
  setEvents: (e: MusicEvent[]) => void;
  lessonsPricing: LessonPricing;
  setLessonsPricing: (l: LessonPricing) => void;
  inquiries: Inquiry[];
  setInquiries: (i: Inquiry[]) => void;
  onResetAll: () => void;
  onClose: () => void;
}

type AdminTab = 'bio' | 'music' | 'books' | 'writings' | 'events' | 'lessons' | 'inquiries';

export default function AdminPanel({
  biography,
  setBiography,
  releases,
  setReleases,
  books,
  setBooks,
  writings,
  setWritings,
  events,
  setEvents,
  lessonsPricing,
  setLessonsPricing,
  inquiries,
  setInquiries,
  onResetAll,
  onClose
}: AdminPanelProps) {
  const [activeTab, setActiveTab ] = useState<AdminTab>('bio');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Editing state for new/selected items
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [releaseForm, setReleaseForm] = useState<Partial<Release>>({});
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackDuration, setNewTrackDuration] = useState('');

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<Partial<Book>>({});
  const [newPoemTitle, setNewPoemTitle] = useState('');
  const [newPoemContent, setNewPoemContent] = useState('');
  const [newReviewSource, setNewReviewSource] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<Partial<WritingPost>>({});

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<MusicEvent>>({});

  // Helper trigger to flash success status
  const flashStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus('');
    }, 2500);
  };

  // Biography changes
  const handleBioChange = (key: keyof Biography, value: string) => {
    const updated = { ...biography, [key]: value };
    setBiography(updated);
    flashStatus('Biography updated locally.');
  };

  // Lessons Pricing changes
  const handleLessonsPriceChange = (key: keyof LessonPricing, value: string) => {
    const updated = { ...lessonsPricing, [key]: value };
    setLessonsPricing(updated);
    flashStatus('Lessons pricing updated.');
  };

  // Releases methods
  const startEditRelease = (release: Release) => {
    setEditingReleaseId(release.id);
    setReleaseForm(release);
  };

  const startNewRelease = () => {
    const newId = `release-${Date.now()}`;
    const newR: Release = {
      id: newId,
      title: 'New Release Title',
      year: new Date().getFullYear().toString(),
      format: 'Album',
      description: 'Short description here.',
      tracks: []
    };
    setReleases([newR, ...releases]);
    setEditingReleaseId(newId);
    setReleaseForm(newR);
  };

  const saveRelease = () => {
    if (!editingReleaseId) return;
    const updated = releases.map(r => r.id === editingReleaseId ? { ...r, ...releaseForm } as Release : r);
    setReleases(updated);
    setEditingReleaseId(null);
    setReleaseForm({});
    flashStatus('Release saved.');
  };

  const deleteRelease = (id: string) => {
    if (confirm('Delete this release? This is irreversible.')) {
      setReleases(releases.filter(r => r.id !== id));
      if (editingReleaseId === id) {
        setEditingReleaseId(null);
        setReleaseForm({});
      }
      flashStatus('Release deleted.');
    }
  };

  const addTrackToForm = () => {
    if (!newTrackTitle.trim()) return;
    const currentTracks = releaseForm.tracks || [];
    const updatedTracks = [...currentTracks, { title: newTrackTitle, duration: newTrackDuration, lyrics: '' }];
    setReleaseForm({ ...releaseForm, tracks: updatedTracks });
    setNewTrackTitle('');
    setNewTrackDuration('');
  };

  const removeTrackFromForm = (index: number) => {
    const currentTracks = releaseForm.tracks || [];
    const updatedTracks = currentTracks.filter((_, i) => i !== index);
    setReleaseForm({ ...releaseForm, tracks: updatedTracks });
  };

  const updateTrackLyricInForm = (index: number, lyricText: string) => {
    const currentTracks = [...(releaseForm.tracks || [])];
    currentTracks[index] = { ...currentTracks[index], lyrics: lyricText };
    setReleaseForm({ ...releaseForm, tracks: currentTracks });
  };

  // Books methods
  const startEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setBookForm(book);
  };

  const startNewBook = () => {
    const newId = `book-${Date.now()}`;
    const newB: Book = {
      id: newId,
      title: 'New Book Title',
      year: new Date().getFullYear().toString(),
      description: 'Paperback description.',
      synopsis: 'A synopsis of the manuscript.',
      samplePoems: [],
      reviews: []
    };
    setBooks([newB, ...books]);
    setEditingBookId(newId);
    setBookForm(newB);
  };

  const saveBook = () => {
    if (!editingBookId) return;
    const updated = books.map(b => b.id === editingBookId ? { ...b, ...bookForm } as Book : b);
    setBooks(updated);
    setEditingBookId(null);
    setBookForm({});
    flashStatus('Book saved.');
  };

  const deleteBook = (id: string) => {
    if (confirm('Delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
      if (editingBookId === id) {
        setEditingBookId(null);
        setBookForm({});
      }
      flashStatus('Book deleted.');
    }
  };

  const addPoemToForm = () => {
    if (!newPoemTitle.trim()) return;
    const currentPoems = bookForm.samplePoems || [];
    setBookForm({
      ...bookForm,
      samplePoems: [...currentPoems, { title: newPoemTitle, content: newPoemContent }]
    });
    setNewPoemTitle('');
    setNewPoemContent('');
  };

  const removePoemFromForm = (index: number) => {
    const currentPoems = bookForm.samplePoems || [];
    setBookForm({
      ...bookForm,
      samplePoems: currentPoems.filter((_, i) => i !== index)
    });
  };

  const addReviewToForm = () => {
    if (!newReviewSource.trim() || !newReviewText.trim()) return;
    const currentReviews = bookForm.reviews || [];
    setBookForm({
      ...bookForm,
      reviews: [...currentReviews, { source: newReviewSource, text: newReviewText }]
    });
    setNewReviewSource('');
    setNewReviewText('');
  };

  const removeReviewFromForm = (index: number) => {
    const currentReviews = bookForm.reviews || [];
    setBookForm({
      ...bookForm,
      reviews: currentReviews.filter((_, i) => i !== index)
    });
  };

  // Writings methods
  const startEditPost = (post: WritingPost) => {
    setEditingPostId(post.id);
    setPostForm(post);
  };

  const startNewPost = () => {
    const newId = `post-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newP: WritingPost = {
      id: newId,
      date: today,
      title: 'New Writing Piece',
      category: 'Essay',
      content: 'Write something authentic...'
    };
    setWritings([newP, ...writings]);
    setEditingPostId(newId);
    setPostForm(newP);
  };

  const savePost = () => {
    if (!editingPostId) return;
    const updated = writings.map(w => w.id === editingPostId ? { ...w, ...postForm } as WritingPost : w);
    setWritings(updated);
    setEditingPostId(null);
    setPostForm({});
    flashStatus('Writing piece saved.');
  };

  const deletePost = (id: string) => {
    if (confirm('Delete this writing piece?')) {
      setWritings(writings.filter(w => w.id !== id));
      if (editingPostId === id) {
        setEditingPostId(null);
        setPostForm({});
      }
      flashStatus('Writing deleted.');
    }
  };

  // Events methods
  const startEditEvent = (event: MusicEvent) => {
    setEditingEventId(event.id);
    setEventForm(event);
  };

  const startNewEvent = () => {
    const newId = `event-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newE: MusicEvent = {
      id: newId,
      date: today,
      venue: 'The Quiet Room',
      city: 'Austin, TX',
      description: 'An evening of song cycles.'
    };
    setEvents([newE, ...events]);
    setEditingEventId(newId);
    setEventForm(newE);
  };

  const saveEvent = () => {
    if (!editingEventId) return;
    const updated = events.map(e => e.id === editingEventId ? { ...e, ...eventForm } as MusicEvent : e);
    setEvents(updated);
    setEditingEventId(null);
    setEventForm({});
    flashStatus('Event saved.');
  };

  const deleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
      if (editingEventId === id) {
        setEditingEventId(null);
        setEventForm({});
      }
      flashStatus('Event deleted.');
    }
  };

  // Delete message
  const deleteInquiry = (id: string) => {
    setInquiries(inquiries.filter(i => i.id !== id));
    flashStatus('Message removed.');
  };

  // Export database as JSON
  const exportDatabase = () => {
    const fullDb = {
      biography,
      releases,
      books,
      writings,
      events,
      lessonsPricing
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDb, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jose_del_toro_site_db_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    flashStatus('Database exported successfully.');
  };

  return (
    <div id="cms-dashboard-container" className="border-t border-current pt-8 mt-12 pb-16 font-mono text-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-current pb-4 gap-4">
        <div>
          <h2 id="cms-header-title" className="text-lg font-bold tracking-tight uppercase flex items-center gap-2">
            <span>[ Artist workspace & mini-cms ]</span>
          </h2>
          <p className="text-xs opacity-75 mt-0.5">Edit biography, write blogs, schedule tours, manage pricing and track inbox inquiries.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {saveStatus && (
            <span id="cms-save-notification" className="text-xs bg-current text-reverse px-2 py-0.5 animate-pulse">
              {saveStatus}
            </span>
          )}
          <button 
            id="cms-btn-export"
            onClick={exportDatabase}
            className="border border-current px-3 py-1 cursor-pointer text-xs hover:bg-current hover:text-reverse transition-colors flex items-center gap-1.5"
            title="Download full content configuration as JSON"
          >
            <Download className="w-3 h-3" />
            <span>Export database</span>
          </button>
          <button 
            id="cms-btn-reset-original"
            onClick={() => {
              if (confirm('Are you absolutely sure you want to reset all modifications to original defaults? This clears your localStorage content.')) {
                onResetAll();
                flashStatus('Reverted to typewriter original archives.');
              }
            }}
            className="border border-red-800 text-red-800 dark:text-red-400 dark:border-red-400 px-3 py-1 text-xs hover:bg-red-800 hover:text-white dark:hover:bg-red-400 dark:hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset to core defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset archives</span>
          </button>
          <button 
            id="cms-btn-exit"
            onClick={onClose}
            className="bg-current text-reverse font-bold px-3 py-1 cursor-pointer text-xs hover:opacity-90 transition-opacity"
          >
            Exit Workspace
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div id="cms-tabs" className="flex flex-wrap border-b border-current mb-6 mt-4 gap-1">
        {[
          { key: 'bio', label: 'Biography', icon: User },
          { key: 'music', label: 'Music Releases', icon: Music },
          { key: 'books', label: 'Poetry Books', icon: BookOpen },
          { key: 'writings', label: 'Writings', icon: FileText },
          { key: 'events', label: 'Tour Events', icon: Calendar },
          { key: 'lessons', label: 'Lessons Pricing', icon: DollarSign },
          { key: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              id={`cms-tab-btn-${tab.key}`}
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as AdminTab);
                // reset edits
                setEditingReleaseId(null);
                setEditingBookId(null);
                setEditingPostId(null);
                setEditingEventId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 border-t border-l border-r border-transparent cursor-pointer -mb-[1px] transition-colors ${
                isActive 
                  ? 'border-current font-bold bg-current text-reverse' 
                  : 'hover:opacity-75'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bio Editing */}
      {activeTab === 'bio' && (
        <div id="cms-section-bio" className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Short Biography (Introductory snippet)</label>
            <textarea 
              id="cms-bio-input-short"
              value={biography.shortBio} 
              onChange={(e) => handleBioChange('shortBio', e.target.value)}
              rows={2}
              className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Background (Personal origins)</label>
            <textarea 
              id="cms-bio-input-background"
              value={biography.background} 
              onChange={(e) => handleBioChange('background', e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Creative Work (Craft philosophy)</label>
            <textarea 
              id="cms-bio-input-creative"
              value={biography.creativeWork} 
              onChange={(e) => handleBioChange('creativeWork', e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Teaching Philosophy (For prospective students)</label>
            <textarea 
              id="cms-bio-input-teaching"
              value={biography.teachingPhilosophy} 
              onChange={(e) => handleBioChange('teachingPhilosophy', e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Music Releases */}
      {activeTab === 'music' && (
        <div id="cms-section-music">
          {editingReleaseId === null ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold uppercase tracking-wide">All Catalog Releases</span>
                <button 
                  id="cms-music-btn-new"
                  onClick={startNewRelease}
                  className="border border-current px-3 py-1 cursor-pointer flex items-center gap-1.5 text-xs hover:bg-current hover:text-reverse transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New catalog entry</span>
                </button>
              </div>
              <div className="border border-current">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-current opacity-75">
                      <th className="p-2 uppercase text-xs">Title/Year</th>
                      <th className="p-2 uppercase text-xs">Format</th>
                      <th className="p-2 uppercase text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releases.map(release => (
                      <tr key={release.id} className="border-b border-current last:border-b-0 hover:bg-neutral-100/10">
                        <td className="p-2">
                          <div className="font-bold">{release.title} ({release.year})</div>
                          <div className="text-xs opacity-75 line-clamp-1">{release.description}</div>
                        </td>
                        <td className="p-2 text-xs">{release.format}</td>
                        <td className="p-2 text-right">
                          <button 
                            onClick={() => startEditRelease(release)}
                            className="mr-3 hover:underline cursor-pointer"
                          >
                            [Edit]
                          </button>
                          <button 
                            onClick={() => deleteRelease(release.id)}
                            className="text-red-700 hover:underline cursor-pointer"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl border border-current p-4 relative">
              <h3 className="font-bold border-b border-current pb-2 uppercase">Editing Release: {releaseForm.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Title</label>
                  <input 
                    type="text"
                    value={releaseForm.title || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, title: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Year</label>
                  <input 
                    type="text"
                    value={releaseForm.year || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, year: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Format Type</label>
                  <input 
                    type="text"
                    value={releaseForm.format || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, format: e.target.value})}
                    placeholder="e.g. Album (12&quot; Vinyl / Digital)"
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Album Art/Release Description</label>
                <textarea 
                  value={releaseForm.description || ''}
                  onChange={(e) => setReleaseForm({...releaseForm, description: e.target.value})}
                  rows={2}
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Bandcamp URL (Aesthetic)</label>
                  <input 
                    type="text"
                    value={releaseForm.bandcampUrl || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, bandcampUrl: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Spotify URL (Aesthetic)</label>
                  <input 
                    type="text"
                    value={releaseForm.spotifyUrl || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, spotifyUrl: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">YouTube URL (Aesthetic)</label>
                  <input 
                    type="text"
                    value={releaseForm.youtubeUrl || ''}
                    onChange={(e) => setReleaseForm({...releaseForm, youtubeUrl: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Recording Credits</label>
                <input 
                  type="text"
                  value={releaseForm.credits || ''}
                  onChange={(e) => setReleaseForm({...releaseForm, credits: e.target.value})}
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                />
              </div>

              {/* Tracks editing inside form */}
              <div className="border border-current p-3 space-y-3">
                <span className="block text-xs uppercase font-bold tracking-wider border-b border-current pb-1">Track List & Lyrics Booklet</span>
                
                {/* List track list */}
                {(releaseForm.tracks || []).length === 0 ? (
                  <p className="text-xs italic opacity-70">No tracks added to this release booklet yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {(releaseForm.tracks || []).map((tr, index) => (
                      <div key={index} className="border border-current border-dashed p-2 bg-neutral-100/5 text-xs">
                        <div className="flex justify-between items-center mb-1 font-bold">
                          <span>{index + 1}. {tr.title} {tr.duration ? `(${tr.duration})` : ''}</span>
                          <button 
                            type="button" 
                            onClick={() => removeTrackFromForm(index)}
                            className="text-red-700 hover:underline"
                          >
                            [Remove Track]
                          </button>
                        </div>
                        <label className="block text-[10px] uppercase font-bold mb-1">Track Lyrics Manuscripts</label>
                        <textarea
                          placeholder="Type song lyrics here with line breaks..."
                          value={tr.lyrics || ''}
                          onChange={(e) => updateTrackLyricInForm(index, e.target.value)}
                          rows={3}
                          className="w-full bg-transparent text-[11px] border border-current p-1 focus:outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline track adder */}
                <div className="flex gap-2 items-end pt-2 border-t border-current border-dashed">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase mb-0.5">Track Title</label>
                    <input 
                      type="text" 
                      value={newTrackTitle} 
                      onChange={(e) => setNewTrackTitle(e.target.value)}
                      placeholder="e.g. Highway 90"
                      className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] uppercase mb-0.5">Duration</label>
                    <input 
                      type="text" 
                      value={newTrackDuration} 
                      onChange={(e) => setNewTrackDuration(e.target.value)}
                      placeholder="e.g. 4:12"
                      className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={addTrackToForm}
                    className="border border-current px-3 py-1 text-xs cursor-pointer hover:bg-current hover:text-reverse transition-colors"
                  >
                    Add Track
                  </button>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-2 justify-end border-t border-current pt-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingReleaseId(null);
                    setReleaseForm({});
                  }}
                  className="border border-current px-3 py-1 cursor-pointer text-xs hover:opacity-75"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={saveRelease}
                  className="bg-current text-reverse font-bold px-4 py-1 cursor-pointer text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Release</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Poetry Books */}
      {activeTab === 'books' && (
        <div id="cms-section-books">
          {editingBookId === null ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold uppercase tracking-wide">All Poetry Monographs</span>
                <button 
                  id="cms-books-btn-new"
                  onClick={startNewBook}
                  className="border border-current px-3 py-1 cursor-pointer flex items-center gap-1.5 text-xs hover:bg-current hover:text-reverse transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New poetry monograph</span>
                </button>
              </div>
              <div className="border border-current">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-current opacity-75">
                      <th className="p-2 uppercase text-xs">Title/Year</th>
                      <th className="p-2 uppercase text-xs">Sample Poems</th>
                      <th className="p-2 uppercase text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id} className="border-b border-current last:border-b-0 hover:bg-neutral-100/10">
                        <td className="p-2">
                          <div className="font-bold">{book.title} ({book.year})</div>
                          <div className="text-xs opacity-75 line-clamp-1">{book.description}</div>
                        </td>
                        <td className="p-2 text-xs">{(book.samplePoems || []).length} poems</td>
                        <td className="p-2 text-right">
                          <button 
                            onClick={() => startEditBook(book)}
                            className="mr-3 hover:underline cursor-pointer"
                          >
                            [Edit]
                          </button>
                          <button 
                            onClick={() => deleteBook(book.id)}
                            className="text-red-700 hover:underline cursor-pointer"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl border border-current p-4">
              <h3 className="font-bold border-b border-current pb-2 uppercase">Editing Manuscript: {bookForm.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Book Title</label>
                  <input 
                    type="text"
                    value={bookForm.title || ''}
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Publication Year</label>
                  <input 
                    type="text"
                    value={bookForm.year || ''}
                    onChange={(e) => setBookForm({...bookForm, year: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Catalog Description (Short)</label>
                <input 
                  type="text"
                  value={bookForm.description || ''}
                  onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1 font-bold">Synopsis & Paper details</label>
                <textarea 
                  value={bookForm.synopsis || ''}
                  onChange={(e) => setBookForm({...bookForm, synopsis: e.target.value})}
                  rows={3}
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Buy Link</label>
                  <input 
                    type="text"
                    value={bookForm.purchaseUrl || ''}
                    onChange={(e) => setBookForm({...bookForm, purchaseUrl: e.target.value})}
                    placeholder="e.g. https://bookshop.org"
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Cover Style</label>
                  <select 
                    value={bookForm.coverStyle?.borderStyle || 'border'}
                    onChange={(e) => setBookForm({
                      ...bookForm, 
                      coverStyle: { 
                        borderStyle: e.target.value, 
                        align: bookForm.coverStyle?.align || 'center' 
                      }
                    })}
                    className="w-full bg-transparent border border-current p-1.5 focus:outline-none text-xs"
                  >
                    <option value="border" className="bg-neutral-800 text-white">Solid thin border</option>
                    <option value="border-double" className="bg-neutral-800 text-white">Classic double line</option>
                    <option value="border-dashed" className="bg-neutral-800 text-white">Avant-garde dashed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Cover Alignment</label>
                  <select 
                    value={bookForm.coverStyle?.align || 'center'}
                    onChange={(e) => setBookForm({
                      ...bookForm, 
                      coverStyle: { 
                        align: e.target.value, 
                        borderStyle: bookForm.coverStyle?.borderStyle || 'border' 
                      }
                    })}
                    className="w-full bg-transparent border border-current p-1.5 focus:outline-none text-xs"
                  >
                    <option value="center" className="bg-neutral-800 text-white">Center-justified</option>
                    <option value="left" className="bg-neutral-800 text-white">Left-justified</option>
                  </select>
                </div>
              </div>

              {/* Sample poems booklet */}
              <div className="border border-current p-3 space-y-3">
                <span className="block text-xs uppercase font-bold tracking-wider border-b border-current pb-1">Sample Poems Exhibits</span>
                
                {(bookForm.samplePoems || []).length === 0 ? (
                  <p className="text-xs italic opacity-70">No poems compiled as sample exhibits yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(bookForm.samplePoems || []).map((p, pIndex) => (
                      <div key={pIndex} className="border border-current p-2 text-xs space-y-1">
                        <div className="flex justify-between items-center border-b border-current pb-1 opacity-80">
                          <span className="font-bold">{p.title}</span>
                          <button 
                            type="button" 
                            onClick={() => removePoemFromForm(pIndex)}
                            className="text-red-700 hover:underline"
                          >
                            [Remove Poem]
                          </button>
                        </div>
                        <pre className="font-mono text-[11px] leading-relaxed whitespace-pre opacity-90 p-1 overflow-x-auto">{p.content}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Poem Adder */}
                <div className="border border-current border-dashed p-2 space-y-2">
                  <span className="block text-[10px] uppercase font-bold opacity-75">Add a sample poem to manuscript view:</span>
                  <input 
                    type="text" 
                    value={newPoemTitle} 
                    onChange={(e) => setNewPoemTitle(e.target.value)}
                    placeholder="POEM TITLE"
                    className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none uppercase"
                  />
                  <textarea 
                    value={newPoemContent} 
                    onChange={(e) => setNewPoemContent(e.target.value)}
                    placeholder="Write lines here. Press Enter freely..."
                    rows={4}
                    className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none font-mono"
                  />
                  <button 
                    type="button"
                    onClick={addPoemToForm}
                    className="border border-current px-3 py-1 text-xs hover:bg-current hover:text-reverse cursor-pointer transition-all"
                  >
                    Append Sample Poem
                  </button>
                </div>
              </div>

              {/* Reviews subsection */}
              <div className="border border-current p-3 space-y-3">
                <span className="block text-xs uppercase font-bold tracking-wider border-b border-current pb-1">Critical Review Excerpts</span>
                
                {(bookForm.reviews || []).length === 0 ? (
                  <p className="text-xs italic opacity-70">No reviews compiled yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {(bookForm.reviews || []).map((rev, revIndex) => (
                      <div key={revIndex} className="text-xs border-b border-current border-dashed pb-1.5 last:border-b-0">
                        <div className="flex justify-between text-[11px] italic opacity-85">
                          <span>— {rev.source}</span>
                          <button 
                            type="button" 
                            onClick={() => removeReviewFromForm(revIndex)}
                            className="text-red-700 hover:underline"
                          >
                            [Remove]
                          </button>
                        </div>
                        <p className="mt-0.5 font-sans">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end pt-2 border-t border-current border-dashed">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] uppercase mb-0.5">Citation Source</label>
                    <input 
                      type="text" 
                      value={newReviewSource} 
                      onChange={(e) => setNewReviewSource(e.target.value)}
                      placeholder="e.g. Poetry Northwest"
                      className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase mb-0.5">Quote / Review excerpt</label>
                      <input 
                        type="text" 
                        value={newReviewText} 
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="e.g. A gorgeous collection of stark, heavy verses..."
                        className="w-full bg-transparent border border-current p-1 text-xs focus:outline-none"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={addReviewToForm}
                      className="border border-current px-3 py-1 text-xs cursor-pointer hover:bg-current hover:text-reverse transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-2 justify-end border-t border-current pt-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingBookId(null);
                    setBookForm({});
                  }}
                  className="border border-current px-3 py-1 cursor-pointer text-xs hover:opacity-75"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={saveBook}
                  className="bg-current text-reverse font-bold px-4 py-1 cursor-pointer text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Manuscript</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Writings / Notebook */}
      {activeTab === 'writings' && (
        <div id="cms-section-writings">
          {editingPostId === null ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold uppercase tracking-wide">Journal Archive Chronology</span>
                <button 
                  id="cms-writings-btn-new"
                  onClick={startNewPost}
                  className="border border-current px-3 py-1 cursor-pointer flex items-center gap-1.5 text-xs hover:bg-current hover:text-reverse transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish new journal entry</span>
                </button>
              </div>
              <div className="border border-current">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-current opacity-75">
                      <th className="p-2 uppercase text-xs">Date</th>
                      <th className="p-2 uppercase text-xs">Title / Type</th>
                      <th className="p-2 uppercase text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {writings.map(post => (
                      <tr key={post.id} className="border-b border-current last:border-b-0 hover:bg-neutral-100/10">
                        <td className="p-2 text-xs">{post.date}</td>
                        <td className="p-2">
                          <div className="font-bold">{post.title}</div>
                          <div className="text-xs italic bg-current text-reverse inline-block px-1 mt-0.5">{post.category}</div>
                        </td>
                        <td className="p-2延 text-right">
                          <button 
                            onClick={() => startEditPost(post)}
                            className="mr-3 hover:underline cursor-pointer"
                          >
                            [Edit]
                          </button>
                          <button 
                            onClick={() => deletePost(post.id)}
                            className="text-red-700 hover:underline cursor-pointer"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl border border-current p-4">
              <h3 className="font-bold border-b border-current pb-2 uppercase">Editing Notebook Entry: {postForm.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Entry Title</label>
                  <input 
                    type="text"
                    value={postForm.title || ''}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Category</label>
                  <select 
                    value={postForm.category || 'Essay'}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value as any})}
                    className="w-full bg-transparent border border-current p-1.5 focus:outline-none"
                  >
                    <option value="Essay" className="bg-neutral-800 text-white">Essay</option>
                    <option value="Note" className="bg-neutral-800 text-white">Note</option>
                    <option value="Poetry" className="bg-neutral-800 text-white">Poetry</option>
                    <option value="Observation" className="bg-neutral-800 text-white">Observation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Creation Date (YYYY-MM-DD)</label>
                <input 
                  type="text"
                  value={postForm.date || ''}
                  onChange={(e) => setPostForm({...postForm, date: e.target.value})}
                  className="w-48 bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Body Content (Supports natural line breaks)</label>
                <textarea 
                  value={postForm.content || ''}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows={12}
                  className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none text-xs leading-relaxed font-sans"
                />
              </div>

              {/* Action row */}
              <div className="flex gap-2 justify-end border-t border-current pt-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingPostId(null);
                    setPostForm({});
                  }}
                  className="border border-current px-3 py-1 cursor-pointer text-xs hover:opacity-75"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={savePost}
                  className="bg-current text-reverse font-bold px-4 py-1 cursor-pointer text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Writing Entry</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Tour Events */}
      {activeTab === 'events' && (
        <div id="cms-section-events">
          {editingEventId === null ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold uppercase tracking-wide">Tour & Readings schedule</span>
                <button 
                  id="cms-events-btn-new"
                  onClick={startNewEvent}
                  className="border border-current px-3 py-1 cursor-pointer flex items-center gap-1.5 text-xs hover:bg-current hover:text-reverse transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add tour / reading event</span>
                </button>
              </div>
              <div className="border border-current">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-current opacity-75">
                      <th className="p-2 uppercase text-xs">Date</th>
                      <th className="p-2 uppercase text-xs">Venue & City</th>
                      <th className="p-2 uppercase text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} className="border-b border-current last:border-b-0 hover:bg-neutral-100/10">
                        <td className="p-2 text-xs">{event.date}</td>
                        <td className="p-2">
                          <div className="font-bold">{event.venue}</div>
                          <div className="text-xs opacity-75">{event.city}</div>
                        </td>
                        <td className="p-2 text-right">
                          <button 
                            onClick={() => startEditEvent(event)}
                            className="mr-3 hover:underline cursor-pointer"
                          >
                            [Edit]
                          </button>
                          <button 
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-700 hover:underline cursor-pointer"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl border border-current p-4">
              <h3 className="font-bold border-b border-current pb-2 uppercase">Editing Event: {eventForm.venue}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Date (YYYY-MM-DD)</label>
                  <input 
                    type="text"
                    value={eventForm.date || ''}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    placeholder="e.g. 2026-08-30"
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Venue</label>
                  <input 
                    type="text"
                    value={eventForm.venue || ''}
                    onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">City & State</label>
                  <input 
                    type="text"
                    value={eventForm.city || ''}
                    onChange={(e) => setEventForm({...eventForm, city: e.target.value})}
                    className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Event Note / Description</label>
                <textarea 
                  value={eventForm.description || ''}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  rows={2}
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Tickets / Info URL (Optional)</label>
                <input 
                  type="text"
                  value={eventForm.ticketUrl || ''}
                  onChange={(e) => setEventForm({...eventForm, ticketUrl: e.target.value})}
                  placeholder="https://tix.example.com"
                  className="w-full bg-transparent border border-current p-1.5 focus:ring-1 focus:ring-current focus:outline-none text-xs"
                />
              </div>

              {/* Action row */}
              <div className="flex gap-2 justify-end border-t border-current pt-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingEventId(null);
                    setEventForm({});
                  }}
                  className="border border-current px-3 py-1 cursor-pointer text-xs hover:opacity-75"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={saveEvent}
                  className="bg-current text-reverse font-bold px-4 py-1 cursor-pointer text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Event</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Lessons Pricing */}
      {activeTab === 'lessons' && (
        <div id="cms-section-lessons" className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Lesson Fee (formatted text)</label>
              <input 
                id="cms-lesson-input-rate"
                type="text"
                value={lessonsPricing.rate} 
                onChange={(e) => handleLessonsPriceChange('rate', e.target.value)}
                className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Session Duration</label>
              <input 
                id="cms-lesson-input-duration"
                type="text"
                value={lessonsPricing.duration} 
                onChange={(e) => handleLessonsPriceChange('duration', e.target.value)}
                className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5">Lessons Description (Details & Guidelines)</label>
            <textarea 
              id="cms-lesson-input-details"
              value={lessonsPricing.details} 
              onChange={(e) => handleLessonsPriceChange('details', e.target.value)}
              rows={5}
              className="w-full bg-transparent border border-current p-2 focus:ring-1 focus:ring-current focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Inbox Inquiries */}
      {activeTab === 'inquiries' && (
        <div id="cms-section-inquiries" className="space-y-4">
          <span className="block font-bold uppercase tracking-wide">
            Submissions Inbox & Newsletter signups
          </span>

          {inquiries.length === 0 ? (
            <div className="border border-current border-dashed p-6 text-center italic opacity-70">
              No correspondence has arrived yet. The mailbox is currently empty.
            </div>
          ) : (
            <div className="space-y-3.5">
              {inquiries.map((inq) => {
                let badgeStyle = 'bg-current text-reverse';
                if (inq.type === 'lesson') badgeStyle = 'bg-blue-900 text-white';
                if (inq.type === 'professional') badgeStyle = 'bg-amber-900 text-white';
                if (inq.type === 'newsletter') badgeStyle = 'bg-emerald-900 text-white';

                return (
                  <div key={inq.id} className="border border-current p-3 space-y-1 bg-neutral-100/5 relative">
                    <button 
                      onClick={() => deleteInquiry(inq.id)}
                      className="absolute top-3 right-3 text-red-700 hover:scale-105 cursor-pointer"
                      title="Discard correspondence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{inq.name}</span>
                      <span className="opacity-75 text-xs">&lt;{inq.email}&gt;</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${badgeStyle}`}>
                        {inq.type}
                      </span>
                      <span className="text-xs opacity-50 ml-auto mr-6">{inq.date}</span>
                    </div>

                    {inq.message && (
                      <div className="mt-2 text-xs border-l-2 border-current pl-2 py-1 font-sans italic opacity-95">
                        "{inq.message}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
