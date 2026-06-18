import { Biography, Release, Book, WritingPost, MusicEvent, LessonPricing } from './types';

export const initialBiography: Biography = {
  shortBio: "Jose Del Toro is a songwriter, guitarist, and poet. His work explores memory, silence, longing, and everyday life.",
  background: "Born in the dry, flat landscapes of west Texas, Jose Del Toro spent his formative years listening to the wind and the remote humming of freight trains. After studying literature, he turned to the guitar as an extension of his notebooks. For over twenty years, he has moved between quiet towns and empty city apartments, documenting the small, unrecorded moments of human existence with an unhurried perspective.",
  creativeWork: "Jose's music is sparse, centering on open-tuned acoustic guitars, warm tube amplifiers, and a hushed, spoken-singing delivery. He avoids commercial production, preferring to record raw, direct-to-tape tracks in bedrooms and community spaces. As a written poet, his chapbooks use typewritten layouts with extensive white space, allowing words to sit in silence, mimicking the spaciousness of his physical origins.",
  teachingPhilosophy: "I believe that playing the guitar is a form of deep listening. It is not about speed or showing off; it is about finding gravity in a single note. My lessons are tailored to help each student discover their own touch, understand music theory from a tactile perspective, and form a reliable habit of daily creation."
};

export const initialReleases: Release[] = [
  {
    id: "midnight-rooms",
    title: "Midnight Rooms",
    year: "2025",
    format: "Album (12\" Vinyl / Digital)",
    description: "A collection of quiet songs written on Texas highways and recorded late at night in empty apartments. Minimal overdubs, mostly a single microphone capturing a voice and an old nylon-string guitar.",
    tracks: [
      {
        title: "Highway 90",
        duration: "4:12",
        lyrics: "the headlights sweep the bedroom wall\nyou haven't called\nand the wind is just a long, low crawl\nacross the salt flats.\n\nthere is a radio station fading out\nsomeone talking about grace\nbut I'm just counting the distance\nbetween this dark and your face."
      },
      {
        title: "Wait for the Winter",
        duration: "3:45",
        lyrics: "leave the window cracked an inch\nlet the cold air in\nwe were always better under heavy blankets\nwatching our breath spin.\n\nthe garden is dying in the frost\nthe summer was too loud\nwait for the winter, my friend\nwhen everything sleeps under the cloud."
      },
      {
        title: "Porch Song",
        duration: "5:01",
        lyrics: "crickets in the dry grass\na glass of plain water\nthe sun goes down behind the water tower\nred then grey.\n\nwe don't need to speak of tomorrow\nwe don't need to make plans\nthe evening is long enough\njust resting in these hands."
      }
    ],
    credits: "Recorded by Jose Del Toro in Alpine, Texas. Mixed and mastered by Arthur Crane. Released independently on Toro Records.",
    spotifyUrl: "https://open.spotify.com",
    bandcampUrl: "https://bandcamp.com",
    youtubeUrl: "https://youtube.com"
  },
  {
    id: "the-cold-ground",
    title: "The Cold Ground",
    year: "2022",
    format: "EP (10\" Vinyl / Cassette)",
    description: "Four tracks captured in an abandoned country church during a freezing week in northern New Mexico. The natural echo of the empty room serves as the only atmosphere.",
    tracks: [
      {
        title: "Cold Ground",
        duration: "3:10",
        lyrics: "put my hand to the wood\nit is colder than it should be\nunderneath the floorboards\nthe earth is waiting for me.\n\nnot today, not today\nbut it's good to keep it in mind\nthat we belong to the soil\nand the things we leave behind."
      },
      {
        title: "Church Bell Echoes",
        duration: "4:05",
        lyrics: "the old bell hasn't rung since fifty-four\nbut in the wind it stirs a little\na iron sigh across the floor.\n\nI sit in the front pew\nwhere the elders used to pray\nand play a simple minor chord\nuntil it fades away."
      }
    ],
    credits: "Captured on a portable four-track cassette deck by Jose Del Toro. Mastered in mono.",
    bandcampUrl: "https://bandcamp.com"
  }
];

export const initialBooks: Book[] = [
  {
    id: "dust-and-silence",
    title: "Dust & Silence",
    year: "2024",
    description: "A paperback collection of forty-five typewriter poems exploring physical decay, quiet mornings, and the desert landscape.",
    synopsis: "Dust & Silence compiles works written over a five-year period of solitary living in West Texas. Hand-typed on a 1968 Smith Corona typewriter, the poems embrace the natural imperfections, ink smudges, and vast physical space of the paper, mirroring the quiet solitude of their subjects.",
    coverStyle: {
      borderStyle: "border",
      align: "center"
    },
    samplePoems: [
      {
        title: "LATE AUGUST",
        content: "the dry grass\ncounts the hours\nbefore the rain.\n\na single crow\non the wire\ndecides to stay.\n\nwe wait for\nthe air to cool\nas if cool air\ncould wash away\nthe things we\ndid not say."
      },
      {
        title: "HOUSE ON THE CORNER",
        content: "no one lives there now\nbut the screen door\nstill swings in the wind\n\na rhythmic sigh\ncreak and slap\n\nlike a heart that forgets\nthe body is gone."
      }
    ],
    reviews: [
      {
        source: "The Lone Star Review",
        text: "Del Toro writes with a sparse razor. He wastes nothing. A quiet masterpiece of modern minimalism."
      },
      {
        source: "Aperture Journal",
        text: "Rooms made of ink and silence. These poems breathe like old floorboards."
      }
    ],
    purchaseUrl: "https://bookshop.org"
  },
  {
    id: "notebook-margins",
    title: "Notebook Margins",
    year: "2020",
    description: "A small-press chapbook filled with short prose, fragment observations, and late-night thoughts on guitar practice.",
    synopsis: "A collection of raw, unedited entries pulled directly from Jose Del Toro's private journals between 2017 and 2020. This chapbook contains short reflections on the art of listening, teaching children how to strum, and watching the seasons change from an urban windowsill.",
    coverStyle: {
      borderStyle: "border-dashed",
      align: "left"
    },
    samplePoems: [
      {
        title: "FRAGMENT 12",
        content: "the thumb on the low E string\nis a anchor.\nit must feel the beat\neven when the rest of the hands\nare floating in high harmonic clouds.\n\nnever let the base shake."
      }
    ],
    reviews: [
      {
        source: "Small Press Collective",
        text: "Feels like finding a lost pocketbook on a train. Intimate, unhurried, and beautiful."
      }
    ],
    purchaseUrl: "https://bookshop.org"
  }
];

export const initialWriting: WritingPost[] = [
  {
    id: "on-playing-slowly",
    date: "2026-05-12",
    title: "On Playing Slowly",
    category: "Essay",
    content: "We live in an age of velocity. Every interface urges us to scroll quicker, to speak louder, to compress our thoughts into brief flashes of attention. When we transfer this speed to the fingerboard of a guitar, we lose the gravity of sound.\n\nWhen you play a note, you must allow it to live its entire life. It is born from the strike of a fingernail or plectrum; it grows into a full, resonant shape; it swells and reveals its woodiness; and then, slowly, it decays back into the quiet of the room.\n\nIf you play the next note too quickly, you assassinate the first note while it is still breathing.\n\nTo play slowly is to respect the sound's right to die a natural death. It takes courage to sit with a fading tone and not rush to fill the silence. But it is in that decay, that thin thread of vibrating brass, where the music truly lives."
  },
  {
    id: "rain-in-lisbon",
    date: "2026-03-04",
    title: "Rain in Lisbon",
    category: "Note",
    content: "Sitting in a small tea shop on a steep cobblestone alleyway. The rain has turned the stones into dark mirrors. I have no guitar with me, only this blue ruled notebook.\n\nA man carries an old wooden drawer on his head, covered in dry burlap. He walks with perfect balance, ignoring the downpour. There is a song in his heavy, steady posture. I must remember to play with that same solid, unassuming weight."
  },
  {
    id: "october-evening",
    date: "2025-10-15",
    title: "October Evening",
    category: "Poetry",
    content: "the smoke from the neighbor's chimney\nsmells of mesquite.\nit drifts across the fence line\nand dissolves in the grey sky.\n\nI hold the guitar to my chest\ntry to match the frequency of the kettle.\n\neverything is preparing\nto turn inward."
  },
  {
    id: "sound-of-cedar",
    date: "2025-08-01",
    title: "The Sound of Cedar",
    category: "Observation",
    content: "Spruce is bright, immediate, projecting. But cedar is warm, secretive, private. A cedar-top guitar does not try to impress the listener in the back row. It whispers directly into the ribs of the player. It is a instrument made for solitary confessions."
  }
];

// Current time in context is June 17, 2026.
export const initialEvents: MusicEvent[] = [
  {
    id: "event-1",
    date: "2026-08-15",
    venue: "The Parlour Room",
    city: "Austin, TX",
    description: "An intimate solo acoustic show in the back room. Limited seating, about forty chairs. Entry is by donation at the door.",
    ticketUrl: ""
  },
  {
    id: "event-2",
    date: "2026-09-12",
    venue: "Desert Hearth Reading Series",
    city: "Marfa, TX",
    description: "A joint poetry reading with Arthur Crane. Jose will read selections from 'Dust & Silence' accompanied by sparse semi-hollow guitar loops.",
    ticketUrl: "https://deserthearth.org"
  },
  {
    id: "event-3",
    date: "2026-10-05",
    venue: "The Living Lantern",
    city: "Santa Fe, NM",
    description: "An evening of songs and stories about winter travels. Warm tea served. All ages welcome.",
    ticketUrl: ""
  },
  {
    id: "event-past-1",
    date: "2026-04-18",
    venue: "Cactus Cafe",
    city: "Austin, TX",
    description: "Solo acoustic album release show for 'Midnight Rooms'. Opened by Clara Vance.",
  },
  {
    id: "event-past-2",
    date: "2025-11-22",
    venue: "Lonesome Pines Chapel",
    city: "Alpine, TX",
    description: "A special quiet concert inside the wooden chapel under the mountains. Recorded for archive files.",
  }
];

export const initialLessonsPricing: LessonPricing = {
  rate: "$75",
  duration: "60 Minutes",
  details: "Private guitar lessons. Available online globally via high-quality video or in-person for local Austin residents. All skill levels from raw beginners to experienced writers wanting to strip down their technique are welcome."
};
