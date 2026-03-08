import type { PlayerProfile } from "@/types";

export const playerProfiles: PlayerProfile[] = [
  {
    slug: "arjun-patel",
    playerId: "p1",
    bio: "Dynamic right-hand batsman from Gujarat with a proven track record in youth cricket. Known for aggressive stroke play and exceptional temperament under pressure. Selected for India U17 camp after a stellar 2025 season.",
    dateOfBirth: "2009-03-15",
    height: "5'10\"",
    weight: "68 kg",
    nationality: "Indian",
    languages: ["English", "Hindi", "Gujarati"],
        contactEmail: "player-arjun@cricverse360.app",
        phone: "+91 00000 00000",
    location: "Ahmedabad, Gujarat, India",
    education: [
      { institution: "Gujarat Cricket Academy", degree: "Elite Cricketer Program", year: "2023-Present" },
      { institution: "Ahmedabad International School", degree: "Higher Secondary", year: "2024-Present" },
    ],
    experience: [
      { team: "Gujarat U17", role: "Opening Batsman", period: "2024-Present", description: "Regular opener, scored 3 centuries and 12 fifties in 45 matches" },
      { team: "India U17 Camp", role: "Batsman", period: "2025", description: "Selected for national camp based on domestic performance" },
      { team: "BCCI Youth Trophy", role: "Batsman", period: "2025", description: "Top scorer of the tournament with 387 runs in 6 matches" },
    ],
    previousClubs: ["Ahmedabad Cricket Club", "Gujarat Lions Academy", "BCCI Youth Development"],
    references: [
            { name: "Rajesh Chauhan", title: "Head Coach, Gujarat Cricket Academy", contact: "Available on request" },
            { name: "Vikram Singh", title: "Former India U19 Manager", contact: "Available on request" },
    ],
    testimonials: [
      { quote: "Arjun has the temperament and technique to play at the highest level. His hunger for runs is remarkable for his age.", author: "Rajesh Chauhan", role: "Head Coach, Gujarat CA" },
      { quote: "One of the most promising young batsmen I have coached. Excellent work ethic and match awareness.", author: "Vikram Singh", role: "Former India U19 Manager" },
    ],
    socialLinks: { twitter: "https://twitter.com/arjunpatel", instagram: "https://instagram.com/arjunpatel_cricket" },
  },
  {
    slug: "jake-thompson",
    playerId: "p2",
    bio: "Left-arm fast bowler from Sydney with genuine pace and swing. Clocked 145 km/h at the U19 level, making him one of the fastest young bowlers in Australian cricket. Key member of the NSW U19 squad.",
    dateOfBirth: "2007-06-22",
    height: "6'2\"",
    weight: "82 kg",
    nationality: "Australian",
    languages: ["English"],
        contactEmail: "player-jake@cricverse360.app",
        phone: "+61 000 000 000",
    location: "Sydney, NSW, Australia",
    education: [
      { institution: "Cricket NSW Academy", degree: "High Performance Pathway", year: "2022-Present" },
      { institution: "Sydney Grammar School", degree: "Year 12", year: "2025" },
    ],
    experience: [
      { team: "NSW U19", role: "Strike Bowler", period: "2024-Present", description: "Leading wicket-taker with 78 wickets in 52 matches" },
      { team: "Australia U19 Squad", role: "Fast Bowler", period: "2025", description: "Selected for U19 World Cup Qualifier campaign" },
      { team: "Sheffield Shield Colts", role: "Opening Bowler", period: "2025", description: "5-wicket haul vs Victoria in semi-final" },
    ],
    previousClubs: ["Sydney Thunder Academy", "Gordon Cricket Club", "Cricket NSW"],
    references: [
            { name: "Brett Williams", title: "Head of Fast Bowling, Cricket NSW", contact: "Available on request" },
            { name: "Mark Taylor", title: "Youth Development Manager, CA", contact: "Available on request" },
    ],
    testimonials: [
      { quote: "Jake has raw pace and the ability to swing the ball both ways. He is a genuine talent with a bright future.", author: "Brett Williams", role: "Head of Fast Bowling, Cricket NSW" },
      { quote: "The fastest young bowler I have seen in Australian cricket in years. His control at pace is exceptional.", author: "Mark Taylor", role: "Youth Development, CA" },
    ],
    socialLinks: { twitter: "https://twitter.com/jakethompson", instagram: "https://instagram.com/jake_pace" },
  },
  {
    slug: "rahul-desai",
    playerId: "p8",
    bio: "Top-order batsman representing USA cricket with exceptional talent and consistency. Highest run-scorer in US U19 cricket with 4 centuries in 2025. A key figure in the growth of American cricket.",
    dateOfBirth: "2007-09-10",
    height: "5'11\"",
    weight: "72 kg",
    nationality: "American",
    languages: ["English", "Hindi", "Marathi"],
        contactEmail: "player-rahul@cricverse360.app",
        phone: "+1 000 000 0000",
    location: "Chicago, IL, USA",
    education: [
      { institution: "MLC Cricket Academy", degree: "Elite Development Program", year: "2024-Present" },
      { institution: "Lane Tech College Prep", degree: "High School Diploma", year: "2025" },
    ],
    experience: [
      { team: "USA U19 Training Squad", role: "Top-Order Batsman", period: "2025-Present", description: "Leading run-scorer with 1820 runs at an average of 45.5" },
      { team: "MLC Development League", role: "Batsman", period: "2025", description: "Scored unbeaten 142 vs Michigan XI - highest individual score of the tournament" },
      { team: "Chicago Cricket Club", role: "Captain", period: "2024-Present", description: "Led team to Midwest Regional Championship" },
    ],
    previousClubs: ["Chicago Cricket Club", "Illinois Youth Cricket", "MLC Development"],
    references: [
            { name: "David Chen", title: "Head Coach, MLC Academy", contact: "Available on request" },
            { name: "Saurabh Netravalkar", title: "USA Cricket Senior Player Mentor", contact: "Available on request" },
    ],
    testimonials: [
      { quote: "Rahul is the future of American cricket. His technique is world-class and his consistency is remarkable.", author: "David Chen", role: "Head Coach, MLC Academy" },
      { quote: "An incredible talent who has the potential to represent USA at the highest level.", author: "Saurabh Netravalkar", role: "USA Cricket Mentor" },
    ],
    socialLinks: { twitter: "https://twitter.com/rahuldesai", instagram: "https://instagram.com/rahul_cricket_usa", youtube: "https://youtube.com/@rahuldesai" },
  },
];

export function getProfileBySlug(slug: string): PlayerProfile | undefined {
  return playerProfiles.find(p => p.slug === slug);
}

export function getProfileByPlayerId(playerId: string): PlayerProfile | undefined {
  return playerProfiles.find(p => p.playerId === playerId);
}
