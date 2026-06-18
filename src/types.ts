export interface Biography {
  shortBio: string;
  background: string;
  creativeWork: string;
  teachingPhilosophy: string;
}

export interface Track {
  title: string;
  duration?: string;
  lyrics?: string;
}

export interface Release {
  id: string;
  title: string;
  year: string;
  format: string;
  description: string;
  tracks: Track[];
  credits?: string;
  spotifyUrl?: string;
  bandcampUrl?: string;
  youtubeUrl?: string;
}

export interface SamplePoem {
  title: string;
  content: string;
}

export interface Review {
  source: string;
  text: string;
}

export interface Book {
  id: string;
  title: string;
  year: string;
  description: string;
  synopsis: string;
  coverStyle?: {
    borderStyle: string; // e.g., 'border', 'border-double', 'border-dashed'
    align: string; // 'left' | 'center'
  };
  samplePoems: SamplePoem[];
  reviews: Review[];
  purchaseUrl?: string;
}

export interface WritingPost {
  id: string;
  date: string;
  title: string;
  category: 'Essay' | 'Note' | 'Poetry' | 'Observation';
  content: string;
}

export interface MusicEvent {
  id: string;
  date: string; // YYYY-MM-DD for sorting / past archiving
  venue: string;
  city: string;
  description: string;
  ticketUrl?: string;
}

export interface LessonPricing {
  rate: string;
  duration: string;
  details: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  type: 'general' | 'lesson' | 'professional' | 'newsletter';
  message?: string;
  date: string;
}

export type SiteTheme = 'theme1' | 'theme2' | 'theme3';
