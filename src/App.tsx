import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Music, BookOpen, FileText, Calendar, Info, Mail, Award, 
  ChevronRight, ArrowLeft, Send, CheckCircle, ExternalLink, ShieldAlert
} from 'lucide-react';
import { SiteTheme, Biography, Release, Book, WritingPost, MusicEvent, LessonPricing, Inquiry } from './types';
import { 
  initialBiography, initialReleases, initialBooks, 
  initialWriting, initialEvents, initialLessonsPricing 
} from './initialData';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'music' | 'lessons' | 'books' | 'writing' | 'events' | 'contact'>('home');
  
  // Selected detail view items
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Active track lyric view
  const [activeLyricIndex, setActiveLyricIndex] = useState<number | null>(null);

  // Theme selection
  const [theme, setTheme] = useState<SiteTheme>('theme1');

  // CMS/Local Storage state
  const [biography, setBiography] = useState<Biography>(initialBiography);
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [writings, setWritings] = useState<WritingPost[]>(initialWriting);
  const [events, setEvents] = useState<MusicEvent[]>(initialEvents);
  const [lessonsPricing, setLessonsPricing] = useState<LessonPricing>(initialLessonsPricing);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Adminpanel toggler
  const [showAdmin, setShowAdmin] = useState<boolean>(false);

  // Submit notifications
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [lessonSubmitted, setLessonSubmitted] = useState<boolean>(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', type: 'general' as any });
  const [lessonForm, setLessonForm] = useState({ name: '', email: '', level: 'Beginner', goals: '' });

  // Cursor blink logic
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  // Load and Save local states
  useEffect(() => {
    // Biography
    const savedBio = localStorage.getItem('jdt_biography');
    if (savedBio) setBiography(JSON.parse(savedBio));

    // Releases
    const savedReleases = localStorage.getItem('jdt_releases');
    if (savedReleases) setReleases(JSON.parse(savedReleases));

    // Books
    const savedBooks = localStorage.getItem('jdt_books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));

    // Writings
    const savedWritings = localStorage.getItem('jdt_writings');
    if (savedWritings) setWritings(JSON.parse(savedWritings));

    // Events
    const savedEvents = localStorage.getItem('jdt_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    // Lessons pricing
    const savedPricing = localStorage.getItem('jdt_pricing');
    if (savedPricing) setLessonsPricing(JSON.parse(savedPricing));

    // Inquiries
    const savedInquiries = localStorage.getItem('jdt_inquiries');
    if (savedInquiries) setInquiries(JSON.parse(savedInquiries));

    // Theme
    const savedTheme = localStorage.getItem('jdt_theme');
    if (savedTheme) setTheme(savedTheme as SiteTheme);
  }, []);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('jdt_biography', JSON.stringify(biography));
  }, [biography]);

  useEffect(() => {
    localStorage.setItem('jdt_releases', JSON.stringify(releases));
  }, [releases]);

  useEffect(() => {
    localStorage.setItem('jdt_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('jdt_writings', JSON.stringify(writings));
  }, [writings]);

  useEffect(() => {
    localStorage.setItem('jdt_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('jdt_pricing', JSON.stringify(lessonsPricing));
  }, [lessonsPricing]);

  useEffect(() => {
    localStorage.setItem('jdt_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('jdt_theme', theme);
    // Sync the body bg tag directly to avoid flashes matching the workspace background
    let bg = '#FFFFFF';
    if (theme === 'theme2') bg = '#000000';
    if (theme === 'theme3') bg = '#F2E9DC';
    document.body.style.backgroundColor = bg;
  }, [theme]);

  // Cursor blink interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Dynamic document titles for SEO/Accessibility compliance
  useEffect(() => {
    let titleStr = "Jose Del Toro | Songwriter, Guitarist, Poet";
    if (currentView !== 'home') {
      const formatted = currentView.charAt(0).toUpperCase() + currentView.slice(1);
      titleStr = `${formatted} — Jose Del Toro`;
    }
    if (selectedReleaseId) {
      const rel = releases.find(r => r.id === selectedReleaseId);
      if (rel) titleStr = `Recordings: ${rel.title} — Jose Del Toro`;
    }
    if (selectedBookId) {
      const bk = books.find(b => b.id === selectedBookId);
      if (bk) titleStr = `Monographs: ${bk.title} — Jose Del Toro`;
    }
    if (selectedPostId) {
      const pst = writings.find(w => w.id === selectedPostId);
      if (pst) titleStr = `Writings: ${pst.title} — Jose Del Toro`;
    }
    document.title = titleStr;
  }, [currentView, selectedReleaseId, selectedBookId, selectedPostId, releases, books, writings]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return; // ignore while writing input fields
      }
      
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        // map keys 1-8 to views
        const views: Array<'home' | 'about' | 'music' | 'lessons' | 'books' | 'writing' | 'events' | 'contact'> = [
          'home', 'about', 'music', 'lessons', 'books', 'writing', 'events', 'contact'
        ];
        const target = views[num - 1];
        if (target) {
          e.preventDefault();
          navigateToView(target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Safe router reset
  const navigateToView = (view: typeof currentView) => {
    setCurrentView(view);
    setSelectedReleaseId(null);
    setSelectedBookId(null);
    setSelectedPostId(null);
    setActiveLyricIndex(null);
    setContactSubmitted(false);
    setLessonSubmitted(false);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Reset all local edits to factory original archives
  const handleResetAllArchives = () => {
    setBiography(initialBiography);
    setReleases(initialReleases);
    setBooks(initialBooks);
    setWritings(initialWriting);
    setEvents(initialEvents);
    setLessonsPricing(initialLessonsPricing);
    setInquiries([]);
    setTheme('theme1');
    localStorage.clear();
  };

  // Forms submission
  const submitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: contactForm.name,
      email: contactForm.email,
      type: contactForm.type,
      message: contactForm.message,
      date: new Date().toISOString().split('T')[0]
    };

    setInquiries([newInquiry, ...inquiries]);
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '', type: 'general' });
  };

  const submitLessonForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.name.trim() || !lessonForm.email.trim()) return;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: lessonForm.name,
      email: lessonForm.email,
      type: 'lesson',
      message: `Guitar lessons application. Skill Level: ${lessonForm.level}. Aspirations: ${lessonForm.goals}`,
      date: new Date().toISOString().split('T')[0]
    };

    setInquiries([newInquiry, ...inquiries]);
    setLessonSubmitted(true);
    setLessonForm({ name: '', email: '', level: 'Beginner', goals: '' });
  };

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: 'Newsletter Subscriber',
      email: newsletterEmail,
      type: 'newsletter',
      date: new Date().toISOString().split('T')[0]
    };

    setInquiries([newInquiry, ...inquiries]);
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setNewsletterSubscribed(false);
    }, 4000);
  };

  // Theme styling definitions
  const themeStyles = {
    theme1: {
      bg: 'bg-[#FFFFFF]',
      text: 'text-[#000000]',
      border: 'border-neutral-900',
      activeTab: 'bg-neutral-900 text-white',
      accent: 'text-neutral-500',
      card: 'bg-neutral-50 border border-neutral-900',
      input: 'border-neutral-900 focus:bg-neutral-50',
      btn: 'bg-neutral-900 text-white hover:bg-neutral-800'
    },
    theme2: {
      bg: 'bg-[#000000]',
      text: 'text-[#F5F5F5]',
      border: 'border-neutral-800',
      activeTab: 'bg-neutral-100 text-black',
      accent: 'text-neutral-400',
      card: 'bg-neutral-900 border border-neutral-800',
      input: 'border-neutral-800 focus:bg-neutral-950',
      btn: 'bg-neutral-100 text-black hover:bg-neutral-200'
    },
    theme3: {
      bg: 'bg-[#F2E9DC]',
      text: 'text-[#2B2B2B]',
      border: 'border-[#dfd3c3]',
      activeTab: 'bg-[#2B2B2B] text-[#F2E9DC]',
      accent: 'text-[#6e6353]',
      card: 'bg-[#ebdcd1] border border-[#d6c7b3]',
      input: 'border-[#6e6353] focus:bg-[#faf4ec]',
      btn: 'bg-[#2B2B2B] text-[#F2E9DC] hover:opacity-90'
    }
  };

  const currentTheme = themeStyles[theme];

  // Helper date sorters
  const todayStr = "2026-06-17"; // Given core context date
  const upcomingEvents = events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
  const pastEvents = events.filter(e => e.date < todayStr).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-200 flex flex-col justify-between p-4 sm:p-8 md:p-12 lg:p-16 antialiased selection:bg-current selection:text-reverse`}>
      
      {/* Absolute Header Navigation */}
      <header className="max-w-3xl w-full mx-auto mb-12 sm:mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          
          {/* Brand/Logo Title */}
          <div>
            <h1 
              id="artist-brand-title"
              onClick={() => navigateToView('home')} 
              className="text-xl font-bold tracking-widest cursor-pointer inline-flex items-center"
            >
              <span>JOSE DEL TORO</span>
              <span className={`w-2.5 h-4 ml-1 bg-current transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
            </h1>
            <div id="artist-brand-disciplines" className="text-xs opacity-65 mt-1 font-mono tracking-wide">
              <span>Music / Guitar Lessons / Poetry Books / Writings</span>
            </div>
          </div>

          {/* Theme Switcher Widget & Keyboard guides */}
          <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto font-mono text-[11px]">
            <div className="flex items-center gap-3">
              <span className="opacity-60 text-[10px] uppercase tracking-wider">Themes:</span>
              <div id="theme-selector-group" className="flex items-center gap-2">
                <button 
                  id="theme-btn-1"
                  onClick={() => setTheme('theme1')} 
                  className={`px-1.5 py-0.5 border cursor-pointer ${theme === 'theme1' ? 'border-current font-bold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  title="Theme 01: White/Black"
                >
                  01
                </button>
                <button 
                  id="theme-btn-2"
                  onClick={() => setTheme('theme2')} 
                  className={`px-1.5 py-0.5 border cursor-pointer ${theme === 'theme2' ? 'border-current font-bold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  title="Theme 02: Midnight Black/Grey"
                >
                  02
                </button>
                <button 
                  id="theme-btn-3"
                  onClick={() => setTheme('theme3')} 
                  className={`px-1.5 py-0.5 border cursor-pointer ${theme === 'theme3' ? 'border-current font-bold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  title="Theme 03: Vintage Parchment"
                >
                  03
                </button>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] opacity-45">
              <span>[ Press keys 1-8 to navigate ]</span>
            </div>
          </div>

        </div>

        {/* Dense Text Border Divider */}
        <hr className={`my-4 border-t ${currentTheme.border} opacity-50`} />

        {/* Primary Typewriter Menu Nav */}
        <nav id="primary-navigation" aria-label="Main menu" className="font-mono text-xs flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mt-2">
          {[
            { id: 'about', label: '1.About', view: 'about' },
            { id: 'music', label: '2.Music', view: 'music' },
            { id: 'lessons', label: '3.lessons', view: 'lessons' },
            { id: 'books', label: '4.books', view: 'books' },
            { id: 'writing', label: '5.writing', view: 'writing' },
            { id: 'events', label: '6.events', view: 'events' },
            { id: 'contact', label: '7.contact', view: 'contact' },
          ].map((navItem) => {
            const isActive = currentView === navItem.view;
            return (
              <button
                id={`nav-btn-${navItem.id}`}
                key={navItem.id}
                onClick={() => navigateToView(navItem.view as any)}
                className={`py-0.5 px-1.5 cursor-pointer hover:underline transition-all ${
                  isActive ? `underline font-bold bg-neutral-550 ${currentTheme.activeTab}` : 'opacity-80'
                }`}
              >
                {navItem.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Single-Column Body View Switcher */}
      <main className="flex-grow max-w-2xl w-full mx-auto flex flex-col justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedReleaseId || '') + (selectedBookId || '') + (selectedPostId || '')}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="w-full"
          >
            
            {/* ======================================= */}
            {/* VIEW: HOME                              */}
            {/* ======================================= */}
            {currentView === 'home' && (
              <div id="view-home" className="space-y-10 py-4">
                
                {/* Visual Title Header */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-light uppercase tracking-wider font-mono">
                    JOSE DEL TORO
                  </h2>
                  <p className="text-sm italic opacity-75 font-serif max-w-md ml-0.5">
                    "I write songs, teach guitar, and publish poetry."
                  </p>
                </div>

                {/* Quiet statement */}
                <div className="text-sm font-sans leading-relaxed space-y-4 font-light opacity-90 max-w-lg border-l-2 pl-3 py-1 border-current">
                  <p>
                    This is my digital manuscript box. Here you will find tracknotes, lyrics, sample chapbook poems, current lesson structures, concert dates, and copies of typewriter journals.
                  </p>
                  <p>
                    Everything is recorded, edited, and maintained by hand from my room. Take your time.
                  </p>
                </div>

                {/* Minimal Table of Contents Menu / Directory */}
                <div className="space-y-3 pt-6">
                  <span className="block text-[10px] uppercase tracking-wider opacity-60 font-mono">Directory Index:</span>
                  <ul className="font-mono text-sm divide-y divide-current/20 max-w-md">
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('about')}>
                      <span className="hover:underline flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>The Biography & Approach</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">01</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('music')}>
                      <span className="hover:underline flex items-center gap-2">
                        <Music className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Releases & Lyrics Sheets</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">02</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('lessons')}>
                      <span className="hover:underline flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Guitar Lessons Enrollment</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">03</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('books')}>
                      <span className="hover:underline flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Typewritten Poetry Books</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">04</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('writing')}>
                      <span className="hover:underline flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Journal Essays & Reflections</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">05</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('events')}>
                      <span className="hover:underline flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Tour Concerts & Readings</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">06</span>
                    </li>
                    <li className="py-2.5 flex justify-between items-center group cursor-pointer" onClick={() => navigateToView('contact')}>
                      <span className="hover:underline flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>Quiet Correspondence Desk</span>
                      </span>
                      <span className="text-xs opacity-50 group-hover:translate-x-1 transition-transform">07</span>
                    </li>
                  </ul>
                </div>

                {/* Smallest Subtle Blurb / Note */}
                <div className="pt-8 text-[11px] opacity-55 space-y-1 font-mono">
                  <div>* Solitary digital notebook no. 42</div>
                  <div>* Handcrafted in Alpine, Texas. No scripts, trackers, or cookies loaded.</div>
                </div>

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: ABOUT                             */}
            {/* ======================================= */}
            {currentView === 'about' && (
              <div id="view-about" className="space-y-8 py-2">
                
                {/* Page Title */}
                <div className="border-b border-current/25 pb-3 mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ About & Philosophy ]</h2>
                </div>

                <p className="text-lg italic font-sans leading-relaxed max-w-xl">
                  "{biography.shortBio}"
                </p>

                {/* Background & Bio section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider border-b border-current/10 pb-1 opacity-70">
                    Background
                  </h3>
                  <p className="font-serif text-sm leading-loose opacity-90 text-justify">
                    {biography.background}
                  </p>
                </div>

                {/* Creative Work Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider border-b border-current/10 pb-1 opacity-70">
                    Creative Work
                  </h3>
                  <p className="font-serif text-sm leading-loose opacity-90 text-justify">
                    {biography.creativeWork}
                  </p>
                </div>

                {/* Teaching Philosophy Section */}
                <div className="space-y-4 pb-8">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider border-b border-current/10 pb-1 opacity-70">
                    Teaching Philosophy
                  </h3>
                  <p className="font-serif text-sm leading-loose opacity-90 text-justify">
                    {biography.teachingPhilosophy}
                  </p>
                </div>

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: MUSIC (Catalog & Booklet lyrics)  */}
            {/* ======================================= */}
            {currentView === 'music' && (
              <div id="view-music" className="space-y-10 py-2">
                
                {!selectedReleaseId ? (
                  // List Releases
                  <div className="space-y-6">
                    <div className="border-b border-current/25 pb-3">
                      <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ Recording Catalog ]</h2>
                    </div>

                    <p className="text-xs italic opacity-75 max-w-md font-mono">
                      Click any handbook record sleeve below to read full recording credits, tracks indexing, and typewriter song lyric booklets.
                    </p>

                    <div className="space-y-8 pt-4">
                      {releases.map((release) => (
                        <div 
                          id={`release-block-${release.id}`}
                          key={release.id} 
                          onClick={() => {
                            setSelectedReleaseId(release.id);
                            setActiveLyricIndex(null);
                          }}
                          className={`group cursor-pointer border-l-2 pl-4 py-1.5 transition-all hover:bg-neutral-100/5 ${currentTheme.border}`}
                        >
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="text-lg font-bold group-hover:underline">{release.title}</h3>
                            <span className="text-xs opacity-60 font-mono">({release.year})</span>
                            <span className="text-xs text-reverse bg-current px-1 py-0.2 select-none text-[10px] uppercase font-mono">{release.format}</span>
                          </div>
                          
                          <p className="text-sm font-sans mt-2 leading-relaxed opacity-85">
                            {release.description}
                          </p>

                          <div className="text-xs font-mono opacity-60 mt-3 flex items-center gap-1.5 group-hover:underline">
                            <span>Open publication lyrics & credits</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Selected Single Release Booklet View
                  (() => {
                    const release = releases.find(r => r.id === selectedReleaseId);
                    if (!release) return <p className="font-mono text-xs text-red-500">Record not found.</p>;
                    return (
                      <div className="space-y-8">
                        
                        {/* Go Back button */}
                        <button 
                          id="btn-back-catalog"
                          onClick={() => setSelectedReleaseId(null)}
                          className="flex items-center gap-1.5 font-mono text-xs opacity-75 hover:opacity-100 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Return to music archives</span>
                        </button>

                        {/* Title details */}
                        <div className="space-y-3 border-b border-current/25 pb-4">
                          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Record booklet catalog no. {release.id.slice(0, 5)}</span>
                          <h2 className="text-3xl font-light uppercase tracking-wider font-mono">{release.title}</h2>
                          <div className="flex flex-wrap gap-2 text-xs font-mono opacity-80">
                            <span>Released: {release.year}</span>
                            <span>•</span>
                            <span>Format: {release.format}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm font-serif leading-loose opacity-90 max-w-xl text-justify">
                          {release.description}
                        </p>

                        {/* Track List Index & Interactive Lyrics */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                            Tracks list Index
                          </h3>
                          <p className="text-xs italic opacity-60 font-mono">Click a track title to read full typewritten lyrics.</p>
                          
                          <div className="divide-y divide-current/10 font-mono">
                            {release.tracks.map((tr, index) => {
                              const isOpen = activeLyricIndex === index;
                              return (
                                <div key={index} className="py-3">
                                  <div 
                                    onClick={() => setActiveLyricIndex(isOpen ? null : index)}
                                    className="flex justify-between items-center cursor-pointer group"
                                  >
                                    <span className={`text-sm group-hover:underline ${isOpen ? 'font-bold' : ''}`}>
                                      {index + 1}. {tr.title}
                                    </span>
                                    <span className="text-xs opacity-60">{tr.duration || ''}</span>
                                  </div>

                                  {/* Lyric sheet display if open */}
                                  {isOpen && (
                                    <div className="mt-4 pl-4 pt-4 border-l-2 border-dashed border-current/30 max-w-md bg-neutral-100/5">
                                      <span className="text-[10px] uppercase block opacity-40 mb-3 tracking-widest">[ lyric manuscript transcript ]</span>
                                      {tr.lyrics ? (
                                        <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap italic font-light">
                                          {tr.lyrics}
                                        </pre>
                                      ) : (
                                        <p className="text-xs opacity-55 italic">This is an instrumental composition.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Embed or Link Outlets */}
                        <div className="space-y-4 pt-4">
                          <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                            Streaming networks & Distribution channels
                          </h3>
                          <div className="flex flex-wrap gap-4 text-xs font-mono">
                            {release.bandcampUrl && (
                              <a href={release.bandcampUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-75 flex items-center gap-1">
                                <span>Bandcamp / Toro Recs</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {release.spotifyUrl && (
                              <a href={release.spotifyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-75 flex items-center gap-1">
                                <span>Spotify Player</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {release.youtubeUrl && (
                              <a href={release.youtubeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-75 flex items-center gap-1">
                                <span>YouTube channel</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Liner notes / Credits */}
                        {release.credits && (
                          <div className="border border-current/30 border-dashed p-3 font-mono text-xs mt-6">
                            <span className="block font-bold uppercase tracking-wider text-[10px] mb-1 opacity-70">Technical Liner Details:</span>
                            <span className="opacity-80">{release.credits}</span>
                          </div>
                        )}

                      </div>
                    );
                  })()
                )}

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: GUITAR LESSONS / INQUIRY FORM     */}
            {/* ======================================= */}
            {currentView === 'lessons' && (
              <div id="view-lessons" className="space-y-10 py-2">
                
                {/* Page Title */}
                <div className="border-b border-current/25 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ Private Guitar Instruction ]</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-lg italic font-sans max-w-xl">
                    "Learning guitar is not about velocity. It is about touch, gravity, and the spaces between notes."
                  </p>
                  <p className="font-serif text-sm leading-loose opacity-90">
                    I offer dedicated custom session enrollments for acoustic and electric musicians interested in open tunings, fingerstyle playing, song arrangements, and pure sonic authenticity. I teach from my silent studio space in Texas and globally via high-resolution video streams.
                  </p>
                </div>

                {/* Grid columns of guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
                  <div className="space-y-3">
                    <span className="font-bold block uppercase border-b border-current pb-1">Creative Disciplines</span>
                    <ul className="space-y-1.5 list-disc pl-4 opacity-85">
                      <li>Acoustic & Nylon-String Strumming</li>
                      <li>Electric low-watt tube arrangements</li>
                      <li>Songwriting & Lyrics pacing</li>
                      <li>Open & Modal Tunings (DADGAD, Open C, Open D)</li>
                      <li>Ear training, tactile intervals, and drone work</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="font-bold block uppercase border-b border-current pb-1">Instruction Suitability</span>
                    <ul className="space-y-1.5 list-disc pl-4 opacity-85">
                      <li>Complete Beginners afraid of speed exercises</li>
                      <li>Intermediate folk musicians feeling stuck</li>
                      <li>Songwriters seeking textured, raw arrangements</li>
                      <li>Musicians returning after deep silent years</li>
                    </ul>
                  </div>
                </div>

                {/* Pricing module */}
                <div className="border border-current p-4 space-y-4 bg-neutral-100/5">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <h3 className="text-sm font-bold uppercase font-mono tracking-wider">[ Private Master Sessions ]</h3>
                    <div id="lessons-price-tag" className="font-mono text-lg font-bold">{lessonsPricing.rate} <span className="text-xs opacity-65">/ {lessonsPricing.duration}</span></div>
                  </div>
                  <p className="font-serif text-xs leading-relaxed opacity-85">
                    {lessonsPricing.details}
                  </p>
                </div>

                {/* Lesson inquiry form */}
                <div className="space-y-4 pt-4 border-t border-current/20">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70">
                    Inquire for Student Openings
                  </h3>
                  
                  {lessonSubmitted ? (
                    <div id="lesson-success-message" className="border border-current p-4 space-y-2 text-center text-xs font-mono">
                      <CheckCircle className="w-6 h-6 mx-auto stroke-current" />
                      <p className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Request entered successfully.</p>
                      <p className="opacity-75 font-serif">"I have placed your request in my active student book. I will look over this on my next quiet day and reply to your email address personally."</p>
                    </div>
                  ) : (
                    <form id="lesson-request-form" onSubmit={submitLessonForm} className="space-y-4 text-xs font-mono">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold">Your Name</label>
                          <input 
                            required
                            type="text" 
                            value={lessonForm.name}
                            onChange={(e) => setLessonForm({...lessonForm, name: e.target.value})}
                            placeholder="e.g. Samuel Finch"
                            className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current ${currentTheme.input}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold">Your Email Address</label>
                          <input 
                            required
                            type="email" 
                            value={lessonForm.email}
                            onChange={(e) => setLessonForm({...lessonForm, email: e.target.value})}
                            placeholder="e.g. sam@example.com"
                            className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current ${currentTheme.input}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold">Current Guitar Comfort / Experience Level</label>
                        <select 
                          value={lessonForm.level}
                          onChange={(e) => setLessonForm({...lessonForm, level: e.target.value})}
                          className={`w-full bg-transparent border p-2 focus:outline-none border-current ${theme === 'theme2' ? 'bg-[#111] text-white' : (theme === 'theme3' ? 'bg-[#e5d9c7]' : 'bg-white text-black')}`}
                        >
                          <option value="Beginner">A absolute beginner (never owned or touched a guitar)</option>
                          <option value="Advanced Beginner">Absolute basics down (can play basic open shapes)</option>
                          <option value="Intermediate">Intermediate comfortable (fingerpicking, simple bar shapes)</option>
                          <option value="Songwriter">A writer looking to strip down my custom chord voicing</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold">Your Creative Aspirations / Influences / Goals</label>
                        <textarea 
                          required
                          value={lessonForm.goals}
                          onChange={(e) => setLessonForm({...lessonForm, goals: e.target.value})}
                          rows={4}
                          placeholder="What music makes you quiet? What songs do you want to play to yourself in an empty house?"
                          className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current font-serif text-sm ${currentTheme.input}`}
                        />
                      </div>

                      <button 
                        id="btn-submit-lesson"
                        type="submit"
                        className={`w-full py-2.5 px-4 font-bold uppercase tracking-wider cursor-pointer font-mono text-center flex items-center justify-center gap-1.5 transition-all text-xs ${currentTheme.btn}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Request a Lesson registration</span>
                      </button>

                    </form>
                  )}
                </div>

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: BOOKS (Poetry & Sample poems)     */}
            {/* ======================================= */}
            {currentView === 'books' && (
              <div id="view-books" className="space-y-10 py-2">
                
                {!selectedBookId ? (
                  // List Books
                  <div className="space-y-6">
                    <div className="border-b border-current/25 pb-3">
                      <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ Poetry Monograph Chapbooks ]</h2>
                    </div>

                    <p className="text-xs italic opacity-75 max-w-sm font-mono">
                      Click any publication entry below to step inside the manuscript workspace & read printed poems and reviews.
                    </p>

                    <div className="space-y-12 pt-4">
                      {books.map((book) => (
                        <div 
                          id={`book-block-${book.id}`}
                          key={book.id} 
                          onClick={() => setSelectedBookId(book.id)}
                          className="group cursor-pointer flex flex-col md:flex-row items-start justify-between gap-6 hover:bg-neutral-100/5 py-4 transition-all"
                        >
                          {/* Aesthetic typewriter styled cover placeholder */}
                          <div className="shrink-0 w-44 font-mono select-none">
                            <div className={`${book.coverStyle?.borderStyle || 'border'} border-current p-4 min-h-[190px] flex flex-col justify-between ${book.coverStyle?.align === 'left' ? 'text-left' : 'text-center'}`}>
                              <span className="text-[10px] opacity-40">[chapbook]</span>
                              <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest break-words leading-tight">{book.title}</h4>
                                <span className="text-[10px] italic block opacity-70 mt-1">Jose Del Toro</span>
                              </div>
                              <span className="text-[9px] opacity-60 tracking-wider">({book.year})</span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-grow space-y-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <h3 className="text-lg font-bold group-hover:underline">{book.title}</h3>
                              <span className="text-xs font-mono opacity-60">• Published {book.year}</span>
                            </div>
                            <p className="text-sm font-sans opacity-95 leading-relaxed">
                              {book.description}
                            </p>
                            <span className="text-xs font-mono opacity-50 block mt-2">
                              Contains {(book.samplePoems || []).length} sample exhibits
                            </span>

                            <div className="text-xs font-mono opacity-60 mt-4 flex items-center gap-1 group-hover:underline">
                              <span>Open chapbook manuscript</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Selected Single Book Details View
                  (() => {
                    const book = books.find(b => b.id === selectedBookId);
                    if (!book) return <p className="font-mono text-xs text-red-500">Book manuscript not found.</p>;
                    return (
                      <div className="space-y-10">
                        
                        {/* Go Back button */}
                        <button 
                          id="btn-back-books"
                          onClick={() => setSelectedBookId(null)}
                          className="flex items-center gap-1.5 font-mono text-xs opacity-75 hover:opacity-100 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Return to poetry monograph catalogs</span>
                        </button>

                        {/* Title details */}
                        <div className="space-y-3 border-b border-current/25 pb-4">
                          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Monograph code {book.id.toUpperCase().slice(0, 5)}</span>
                          <h2 className="text-3xl font-light uppercase tracking-wider font-mono">{book.title}</h2>
                          <div className="flex flex-wrap gap-2 text-xs font-mono opacity-80">
                            <span>First Printing: {book.year}</span>
                            <span>•</span>
                            <span>Typewriter Sheet Release</span>
                          </div>
                        </div>

                        {/* Synopsis */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                            Book Synopsis & Sheet Description
                          </h3>
                          <p className="text-sm font-serif leading-loose opacity-90 text-justify">
                            {book.synopsis}
                          </p>
                        </div>

                        {/* Sample Poem Exhibits (with massive vertical whitespace for chapbook feel) */}
                        {book.samplePoems && book.samplePoems.length > 0 && (
                          <div className="space-y-8 pt-4">
                            <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                              Manuscript Poem Exhibits
                            </h3>

                            <div className="space-y-20">
                              {book.samplePoems.map((p, index) => (
                                <div key={index} className="pl-4 sm:pl-12 py-4 relative border-l border-current/10 max-w-lg">
                                  <span className="text-[9px] uppercase tracking-widest font-mono opacity-40 block mb-3">Exhibit {index + 1}: "{p.title}"</span>
                                  <h4 className="text-xs font-bold font-mono tracking-widest mb-6 opacity-85 uppercase">{p.title}</h4>
                                  <pre className="font-mono text-xs sm:text-sm leading-loose whitespace-pre tracking-wide italic opacity-95">
                                    {p.content}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reviews */}
                        {book.reviews && book.reviews.length > 0 && (
                          <div className="space-y-4 pt-8">
                            <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                              Critical Reception Cites
                            </h3>
                            <div className="space-y-4 max-w-xl">
                              {book.reviews.map((rev, index) => (
                                <blockquote key={index} className="space-y-1 font-serif text-xs leading-relaxed opacity-85 hover:opacity-100 transition-opacity">
                                  <p className="italic">"{rev.text}"</p>
                                  <cite className="block text-[10px] font-mono opacity-65 text-right">— {rev.source}</cite>
                                </blockquote>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Purchasing Details */}
                        {book.purchaseUrl && (
                          <div className="pt-6 border-t border-current/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="font-mono text-xs opacity-75">
                              <span>Published independently. Available direct from independent bookstores.</span>
                            </div>
                            <a 
                              href={book.purchaseUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`px-4 py-2 font-mono text-center font-bold uppercase tracking-wider text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${currentTheme.btn}`}
                            >
                              <span>Purchase copy</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                      </div>
                    );
                  })()
                )}

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: WRITING (Archive & Reading room)  */}
            {/* ======================================= */}
            {currentView === 'writing' && (
              <div id="view-writing" className="space-y-10 py-2">
                
                {!selectedPostId ? (
                  // Archive Chronology list
                  <div className="space-y-6">
                    <div className="border-b border-current/25 pb-3">
                      <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ The Writing Chest ]</h2>
                    </div>

                    <p className="text-xs italic opacity-75 max-w-md font-mono">
                      A list of typed essays, quiet notes, prose fragments, and observations. Click a leaf to enter the reading workspace.
                    </p>

                    <div className="space-y-4 pt-4">
                      {writings.length === 0 ? (
                        <p className="italic font-mono text-xs opacity-60">The inkpot is dry. No letters logged.</p>
                      ) : (
                        writings.map((post) => (
                          <article 
                            id={`writing-row-${post.id}`}
                            key={post.id} 
                            onClick={() => setSelectedPostId(post.id)}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline py-3 border-b border-current/10 hover:bg-neutral-100/5 cursor-pointer group gap-1.5 transition-all"
                          >
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold group-hover:underline flex items-center gap-2">
                                <span>{post.title}</span>
                                <span className="text-[9px] font-mono font-light uppercase border border-current px-1 py-0.2 scale-90 rotate-[-1deg]">
                                  {post.category}
                                </span>
                              </h3>
                              <p className="text-xs font-serif opacity-75 max-w-lg line-clamp-1 ml-0.5 mt-0.5 font-light">
                                {post.content}
                              </p>
                            </div>
                            <time className="font-mono text-xs opacity-50 shrink-0 font-light">{post.date}</time>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // Single journal read viewport (distraction-free, centered, literary)
                  (() => {
                    const post = writings.find(w => w.id === selectedPostId);
                    if (!post) return <p className="font-mono text-xs text-red-500">Post not found.</p>;
                    return (
                      <article className="space-y-8 max-w-xl mx-auto py-2">
                        
                        {/* Go Back */}
                        <button 
                          id="btn-back-writing"
                          onClick={() => setSelectedPostId(null)}
                          className="flex items-center gap-1.5 font-mono text-xs opacity-75 hover:opacity-100 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Return to the writing chest</span>
                        </button>

                        {/* Title details */}
                        <div className="space-y-3 pb-4 border-b border-current/15">
                          <div className="flex items-center gap-2 font-mono text-xs opacity-60">
                            <span className="uppercase text-[10px] bg-current text-reverse px-1">{post.category}</span>
                            <span>•</span>
                            <span>Published {post.date}</span>
                          </div>
                          <h2 className="text-2xl font-serif tracking-tight leading-tight uppercase font-mono">{post.title}</h2>
                        </div>

                        {/* Distraction free reading body */}
                        <div id="writing-article-content" className="font-serif text-[15px] leading-loose text-justify whitespace-pre-wrap space-y-6 opacity-95 text-[#2B2B2B] dark:text-[#E2E2E2] tracking-normal font-light">
                          {post.content}
                        </div>

                        {/* Sign-off symbol */}
                        <div className="pt-8 text-center text-xs opacity-50 pointer-events-none font-mono">
                          <span>◇ ◇ ◇</span>
                        </div>

                      </article>
                    );
                  })()
                )}

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: EVENTS (Schedule Upcoming/Past)   */}
            {/* ======================================= */}
            {currentView === 'events' && (
              <div id="view-events" className="space-y-10 py-2">
                
                {/* Page Title */}
                <div className="border-b border-current/25 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ Tour Dates, Readings, & Workshops ]</h2>
                </div>

                <p className="text-xs italic opacity-75 max-w-sm font-mono">
                  Performances and poetry chapbook exhibits are kept deliberately small, unrecorded, and intimate.
                </p>

                {/* Upcoming */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                    Upcoming Gatherings
                  </h3>

                  {upcomingEvents.length === 0 ? (
                    <p className="font-mono text-xs italic opacity-60">All is currently quiet in the hills. No dates scheduled.</p>
                  ) : (
                    <div className="space-y-6">
                      {upcomingEvents.map((ev) => (
                        <div id={`event-upcoming-${ev.id}`} key={ev.id} className="border-l-2 pl-4 py-1 border-current">
                          <div className="flex flex-wrap justify-between items-baseline gap-2">
                            <h4 className="font-mono text-sm font-bold">{ev.venue} • {ev.city}</h4>
                            <time className="font-mono text-xs bg-current text-reverse font-bold px-1.5 py-0.2">{ev.date}</time>
                          </div>
                          <p className="font-serif text-xs leading-relaxed opacity-85 mt-2">
                            {ev.description}
                          </p>
                          {ev.ticketUrl && (
                            <a 
                              href={ev.ticketUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-xs underline font-mono mt-2 cursor-pointer"
                            >
                              <span>Event details & tickets page</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past archives */}
                <div className="space-y-4 pt-6">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider opacity-70 border-b border-current/10 pb-1">
                    Historic Concerts & Readings Archive
                  </h3>

                  {pastEvents.length === 0 ? (
                    <p className="font-mono text-xs italic opacity-50">No past archives transcribed into the chest.</p>
                  ) : (
                    <div className="space-y-4 font-mono text-xs divide-y divide-current/10">
                      {pastEvents.map((evItem) => (
                        <div id={`event-past-${evItem.id}`} key={evItem.id} className="pt-3 first:pt-0 flex flex-wrap justify-between items-baseline gap-2 opacity-65">
                          <div>
                            <span className="font-bold">{evItem.venue}</span>
                            <span className="opacity-75"> ({evItem.city})</span>
                          </div>
                          <time className="opacity-75 font-light">{evItem.date}</time>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ======================================= */}
            {/* VIEW: CONTACT / CORRESPONDENCE DESK     */}
            {/* ======================================= */}
            {currentView === 'contact' && (
              <div id="view-contact" className="space-y-8 py-2">
                
                {/* Page Title */}
                <div className="border-b border-current/25 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono">[ The Correspondence Desk ]</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-lg italic font-sans max-w-xl">
                    "A typed letter takes days, a simple note takes seconds. I prefer writing that has a little weight."
                  </p>
                  <p className="font-serif text-sm leading-loose opacity-90">
                    If you have professional queries regarding performances, wish to discuss guitar enrollment, or are simply writing a warm letter of correspondence regarding the songs or poetry chapbooks, you may pen a message here. This form writes directly to my workspace lockbox and is private.
                  </p>
                </div>

                {/* Success response */}
                {contactSubmitted ? (
                  <div id="contact-success-message" className="border border-current p-6 space-y-3 text-center text-xs font-mono">
                    <CheckCircle className="w-8 h-8 mx-auto stroke-current" />
                    <h3 className="font-bold uppercase tracking-widest text-[#15803d]">Your correspondence has been postmarked.</h3>
                    <p className="opacity-80 font-serif max-w-md mx-auto leading-relaxed">
                      "Thank you for taking the time to send an intentional note. I read all letters on Sunday evenings and will return an answer to your electronic post address should the gravity of the message require it."
                    </p>
                    <button 
                      onClick={() => setContactSubmitted(false)}
                      className="underline text-[10px] uppercase opacity-70 hover:opacity-100"
                    >
                      [ Write another letter ]
                    </button>
                  </div>
                ) : (
                  <form id="contact-actual-form" onSubmit={submitContactForm} className="space-y-4 text-xs font-mono">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold">Your Name</label>
                        <input 
                          required
                          type="text" 
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          placeholder="e.g. Catherine Crane"
                          className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current ${currentTheme.input}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold">Your Email Address</label>
                        <input 
                          required
                          type="email" 
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          placeholder="e.g. cath@example.com"
                          className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current ${currentTheme.input}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold">Nature of Correspondence</label>
                      <select 
                        value={contactForm.type}
                        onChange={(e) => setContactForm({...contactForm, type: e.target.value as any})}
                        className={`w-full bg-transparent border p-2 focus:outline-none border-current ${theme === 'theme2' ? 'bg-[#111] text-white' : (theme === 'theme3' ? 'bg-[#e5d9c7]' : 'bg-white text-black')}`}
                      >
                        <option value="general">General correspondence (thoughts on songs/writing)</option>
                        <option value="professional">Professional inquiries (performances, readings, recordings)</option>
                        <option value="lesson">Guitar lesson query (rates, duration questions)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold">Your Message Letter</label>
                      <textarea 
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={6}
                        placeholder="Type your message with breathing room..."
                        className={`w-full bg-transparent border p-2 focus:outline-none focus:ring-1 focus:ring-current font-serif text-sm ${currentTheme.input}`}
                      />
                    </div>

                    <button 
                      id="btn-submit-contact"
                      type="submit"
                      className={`w-full py-2.5 px-4 font-bold uppercase tracking-wider cursor-pointer font-mono text-center flex items-center justify-center gap-1.5 transition-all text-xs ${currentTheme.btn}`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Letter to lockbox</span>
                    </button>

                  </form>
                )}

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Footer with email and newsletter */}
      <footer className="max-w-3xl w-full mx-auto mt-20 font-mono text-xs text-justify pt-12 border-t border-dotted border-current/20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-4">
          
          {/* Newsletter subscription desk */}
          <div className="space-y-3">
            <span className="block font-bold text-[10px] uppercase tracking-wider opacity-70">[ Newsletter / Dispatch registration ]</span>
            <p className="text-[11px] leading-relaxed opacity-70 font-sans">
              I send rare typewritten chronicles, unreleased demos, and new book announcements about three times a year directly to your electronic post. No noise, advertisement, or tracking codes.
            </p>
            {newsletterSubscribed ? (
              <div id="newsletter-success-span" className="text-xs bg-current text-reverse px-2.5 py-1 inline-block animate-pulse">
                電子ポスト registered. Thank you.
              </div>
            ) : (
              <form id="newsletter-foot-form" onSubmit={submitNewsletter} className="flex gap-2">
                <input 
                  required
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="electronic-post@domain.com"
                  className={`bg-transparent border text-[11px] p-1.5 flex-grow focus:outline-none focus:ring-1 focus:ring-current ${currentTheme.input}`}
                />
                <button 
                  id="newsletter-btn-submit"
                  type="submit"
                  className={`text-[11px] px-3 font-bold uppercase cursor-pointer border border-current hover:bg-current hover:text-reverse transition-colors ${currentTheme.btn}`}
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Social references/analog links */}
          <div className="space-y-3 font-mono text-xs">
            <span className="block font-bold text-[10px] uppercase tracking-wider opacity-70">[ Social channels & contact coordinates ]</span>
            <ul className="space-y-1.5">
              <li className="flex justify-between">
                <span className="opacity-60">Personal post:</span>
                <a href="mailto:josedeltoromusic@gmail.com" className="underline hover:opacity-70">josedeltoromusic@gmail.com</a>
              </li>
              <li className="flex justify-between">
                <span className="opacity-60">Instagram:</span>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">@josedeltoro</a>
              </li>
              <li className="flex justify-between">
                <span className="opacity-60">Bandcamp audio:</span>
                <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">josedeltoro.bandcamp.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-current/15 pt-4 gap-4">
          <div className="opacity-55 text-[10px]">
            <span>© {new Date().getFullYear()} Jose Del Toro. All manuscripts reserved to Alpine, Texas archives.</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Button to toggle CMS Admin Workspace */}
            <button 
              id="btn-toggle-workspace"
              onClick={() => {
                setShowAdmin(!showAdmin);
                // auto-focus scroll to workshop when opened
                if (!showAdmin) {
                  setTimeout(() => {
                    const workspaceEl = document.getElementById('cms-dashboard-container');
                    if (workspaceEl) workspaceEl.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="text-[10px] uppercase border border-current border-solid px-2 py-0.5 hover:bg-current hover:text-reverse transition-all cursor-pointer inline-flex items-center gap-1 font-bold"
            >
              <span>{showAdmin ? '[ Hide Workspace ]' : '[ Open workspace / cms ]'}</span>
            </button>
            
            {showAdmin && (
              <span className="text-[9px] text-[#22c55e] border border-[#22c55e] px-1 animate-pulse uppercase font-mono font-bold select-none">[ Live Mode ]</span>
            )}
          </div>
        </div>

        {/* ======================================= */}
        {/* INJECTED COMPONENT: LIGHTWEIGHT CMS     */}
        {/* ======================================= */}
        {showAdmin && (
          <div className="mt-8">
            <AdminPanel 
              biography={biography}
              setBiography={setBiography}
              releases={releases}
              setReleases={setReleases}
              books={books}
              setBooks={setBooks}
              writings={writings}
              setWritings={setWritings}
              events={events}
              setEvents={setEvents}
              lessonsPricing={lessonsPricing}
              setLessonsPricing={setLessonsPricing}
              inquiries={inquiries}
              setInquiries={setInquiries}
              onResetAll={handleResetAllArchives}
              onClose={() => setShowAdmin(false)}
            />
          </div>
        )}

      </footer>

    </div>
  );
}
