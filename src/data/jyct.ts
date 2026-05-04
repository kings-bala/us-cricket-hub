export interface JYCTAgeGroup {
  id: string;
  name: string;
  overs: number;
  entryFee: number;
  dates: string;
  isNew?: boolean;
  color: string;
}

export interface JYCTGround {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  state: string;
  mapUrl: string;
  facilities: string[];
  pitchType: string;
  capacity: number;
  floodlights: boolean;
  image: string;
}

export interface JYCTPost {
  id: string;
  type: "image" | "video" | "carousel";
  caption: string;
  likes: number;
  comments: number;
  date: string;
  thumbnail: string;
  gradient: string;
  icon: string;
}

export const jyctInfo = {
  name: "Jersey Youth Cricket Tournament",
  shortName: "JYCT",
  tagline: "New Jersey - Hardball Cricket - Summer Tournament",
  year: 2026,
  month: "August 2026",
  ballType: "White Ball Cricket",
  registrationCloses: "July 12, 2026",
  email: "risingstarcricketleague@gmail.com",
  phone: "+1 (540) 413-6392",
  features: ["POM Awards Per Game", "Live Streaming of Games"],
  spotsStatus: "Limited Spots Available - Almost Full",
  website: "https://cricclubs.com/JYCT",
  instagram: "@jerseyyouthcricket",
  followers: 2847,
  following: 312,
  posts: 48,
};

export const jyctAgeGroups: JYCTAgeGroup[] = [
  {
    id: "u11",
    name: "U11",
    overs: 25,
    entryFee: 1000,
    dates: "August 2026",
    color: "from-green-600 to-green-800",
  },
  {
    id: "u13",
    name: "U13",
    overs: 30,
    entryFee: 1100,
    dates: "Aug 25 – 28",
    color: "from-red-700 to-red-900",
  },
  {
    id: "u15",
    name: "U15",
    overs: 30,
    entryFee: 1100,
    dates: "Aug 18 – 21",
    color: "from-amber-600 to-amber-800",
  },
  {
    id: "u18",
    name: "U18",
    overs: 30,
    entryFee: 1200,
    dates: "Aug 25 – 28",
    color: "from-purple-700 to-purple-900",
  },
  {
    id: "girls",
    name: "Girls Tournament",
    overs: 25,
    entryFee: 1000,
    dates: "Aug 25 – 28",
    isNew: true,
    color: "from-pink-600 to-pink-800",
  },
];

export const jyctGrounds: JYCTGround[] = [
  {
    id: "g1",
    name: "Mercer County Park Cricket Ground",
    shortName: "Mercer County Park",
    address: "334 S Post Rd, West Windsor Township, NJ 08550",
    city: "West Windsor",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Mercer+County+Park+Cricket+Ground",
    facilities: ["Pavilion", "Scoreboard", "Parking", "Restrooms", "Practice Nets"],
    pitchType: "Turf Wicket",
    capacity: 500,
    floodlights: false,
    image: "",
  },
  {
    id: "g2",
    name: "Thompson Park Cricket Field",
    shortName: "Thompson Park",
    address: "805 Newman Springs Rd, Lincroft, NJ 07738",
    city: "Lincroft",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Thompson+Park+Cricket+Field+NJ",
    facilities: ["Pavilion", "Parking", "Restrooms", "Boundary Rope"],
    pitchType: "Matting Wicket",
    capacity: 300,
    floodlights: false,
    image: "",
  },
  {
    id: "g3",
    name: "Johnson Park Cricket Ground 1",
    shortName: "Johnson Park 1",
    address: "Co Rd 807, Piscataway, NJ 08854",
    city: "Piscataway",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Johnson+Park+Cricket+Ground+Piscataway",
    facilities: ["Pavilion", "Scoreboard", "Parking", "Restrooms", "Sight Screen"],
    pitchType: "Turf Wicket",
    capacity: 400,
    floodlights: false,
    image: "",
  },
  {
    id: "g4",
    name: "Johnson Park Cricket Ground 2",
    shortName: "Johnson Park 2",
    address: "Co Rd 807, Piscataway, NJ 08854",
    city: "Piscataway",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Johnson+Park+Cricket+Ground+2+Piscataway",
    facilities: ["Parking", "Restrooms", "Boundary Rope"],
    pitchType: "Matting Wicket",
    capacity: 250,
    floodlights: false,
    image: "",
  },
  {
    id: "g5",
    name: "Dudash Park Cricket Pitch",
    shortName: "Dudash Park",
    address: "Dudash Park, Old Bridge, NJ 08857",
    city: "Old Bridge",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Dudash+Park+Old+Bridge+NJ",
    facilities: ["Parking", "Restrooms", "Practice Area"],
    pitchType: "Matting Wicket",
    capacity: 200,
    floodlights: false,
    image: "",
  },
  {
    id: "g6",
    name: "Conover Cricket Ground",
    shortName: "Conover Ground",
    address: "Conover Rd, West Windsor Township, NJ 08550",
    city: "West Windsor",
    state: "NJ",
    mapUrl: "https://maps.google.com/?q=Conover+Cricket+Ground+West+Windsor",
    facilities: ["Pavilion", "Parking", "Restrooms", "Scoreboard"],
    pitchType: "Turf Wicket",
    capacity: 350,
    floodlights: false,
    image: "",
  },
];

export const jyctPosts: JYCTPost[] = [
  {
    id: "post1",
    type: "image",
    caption: "Registration is NOW OPEN for JYCT Summer 2026! White ball cricket across 5 age groups. Limited spots - register early!",
    likes: 234,
    comments: 45,
    date: "2026-05-01",
    thumbnail: "/jyct-poster.jpg",
    gradient: "from-blue-900 to-indigo-900",
    icon: "📋",
  },
  {
    id: "post2",
    type: "image",
    caption: "NEW for 2026 - Girls Tournament! All ages welcome. 25 overs, Aug 25-28. Let's grow women's cricket in NJ!",
    likes: 312,
    comments: 67,
    date: "2026-04-28",
    thumbnail: "",
    gradient: "from-pink-800 to-rose-900",
    icon: "🌟",
  },
  {
    id: "post3",
    type: "video",
    caption: "Highlights from last year's U15 finals! What a match. Can't wait for August 2026.",
    likes: 567,
    comments: 89,
    date: "2026-04-20",
    thumbnail: "",
    gradient: "from-emerald-800 to-teal-900",
    icon: "🎬",
  },
  {
    id: "post4",
    type: "image",
    caption: "Meet our umpires panel for JYCT 2026. Professional officiating for every match.",
    likes: 189,
    comments: 23,
    date: "2026-04-15",
    thumbnail: "",
    gradient: "from-amber-800 to-yellow-900",
    icon: "👨‍⚖️",
  },
  {
    id: "post5",
    type: "carousel",
    caption: "Ground tour: Mercer County Park is ready for summer cricket! Freshly prepared pitches.",
    likes: 421,
    comments: 56,
    date: "2026-04-10",
    thumbnail: "",
    gradient: "from-green-800 to-lime-900",
    icon: "🏟️",
  },
  {
    id: "post6",
    type: "image",
    caption: "U11 coaching clinic this weekend! Free for registered teams. Build skills before the big tournament.",
    likes: 278,
    comments: 34,
    date: "2026-04-05",
    thumbnail: "",
    gradient: "from-cyan-800 to-blue-900",
    icon: "🏏",
  },
  {
    id: "post7",
    type: "image",
    caption: "POM Awards at every game! Best performers get recognized. Trophies + certificates.",
    likes: 345,
    comments: 41,
    date: "2026-03-28",
    thumbnail: "",
    gradient: "from-yellow-700 to-orange-900",
    icon: "🏆",
  },
  {
    id: "post8",
    type: "video",
    caption: "Live streaming coming to all JYCT 2026 matches! Watch your kids play from anywhere.",
    likes: 498,
    comments: 72,
    date: "2026-03-20",
    thumbnail: "",
    gradient: "from-red-800 to-rose-900",
    icon: "📺",
  },
  {
    id: "post9",
    type: "image",
    caption: "Throwback to JYCT 2025 U13 champions! Will they defend their title this year?",
    likes: 612,
    comments: 95,
    date: "2026-03-15",
    thumbnail: "",
    gradient: "from-violet-800 to-purple-900",
    icon: "🏅",
  },
  {
    id: "post10",
    type: "carousel",
    caption: "Entry fees announced: U11 $1,000 | U13 $1,100 | U15 $1,100 | U18 $1,200 | Girls $1,000. Register now!",
    likes: 156,
    comments: 28,
    date: "2026-03-10",
    thumbnail: "",
    gradient: "from-slate-700 to-zinc-900",
    icon: "💰",
  },
  {
    id: "post11",
    type: "image",
    caption: "Jersey cricket is growing! 50+ teams expected for JYCT 2026. Be part of the movement.",
    likes: 389,
    comments: 52,
    date: "2026-03-05",
    thumbnail: "",
    gradient: "from-indigo-800 to-blue-900",
    icon: "📈",
  },
  {
    id: "post12",
    type: "image",
    caption: "Coaching staff applications open for JYCT 2026. DM us or email for details.",
    likes: 145,
    comments: 19,
    date: "2026-02-28",
    thumbnail: "",
    gradient: "from-teal-800 to-emerald-900",
    icon: "📝",
  },
];
