export type Skill = "Batting" | "Bowling" | "Fielding" | "Wicket-Keeping";

export interface Routine {
  name: string;
  duration: string;
  frequency: string;
  description: string;
}

export interface Legend {
  id: string;
  name: string;
  country: string;
  era: string;
  skills: Skill[];
  highlights: string;
  routines: Record<string, Routine[]>;
}

export const legends: Legend[] = [
  { id: "l1", name: "Sachin Tendulkar", country: "India", era: "1989–2013", skills: ["Batting"], highlights: "100 international centuries, 34,357 runs across formats", routines: {
    Batting: [
      { name: "Shadow Batting Drills", duration: "30 min", frequency: "Daily", description: "Practice straight drive, cover drive, and pull shot footwork without a ball to build muscle memory" },
      { name: "Throwdown Sessions", duration: "45 min", frequency: "5x/week", description: "Face 200+ throwdowns focusing on playing late and keeping the ball along the ground" },
      { name: "Mental Visualization", duration: "15 min", frequency: "Daily", description: "Visualize innings construction — playing out the new ball, rotating strike, and accelerating in middle overs" },
      { name: "Fitness Circuit", duration: "40 min", frequency: "Daily", description: "Core strength, wrist flexibility exercises, and footwork agility ladder drills" },
      { name: "Batting Technique Review", duration: "2 hrs", frequency: "Monthly", description: "Full video analysis session reviewing recent innings, identifying technical flaws, and setting corrective goals" },
    ],
  }},
  { id: "l2", name: "Brian Lara", country: "West Indies", era: "1990–2007", skills: ["Batting"], highlights: "400* in Tests, 501* in first-class cricket", routines: {
    Batting: [
      { name: "High Backlift Practice", duration: "30 min", frequency: "Daily", description: "Practice the signature high backlift with emphasis on timing and bat flow through the ball" },
      { name: "Concentration Drills", duration: "60 min", frequency: "4x/week", description: "Extended net sessions (300+ balls) to build stamina for long innings and deep concentration" },
      { name: "Footwork Against Spin", duration: "30 min", frequency: "3x/week", description: "Practice dancing down the pitch to spinners and sweeping with precision placement" },
      { name: "Match Simulation Day", duration: "3 hrs", frequency: "Monthly", description: "Full match simulation with scoreboard pressure, field settings, and bowling changes to test concentration" },
    ],
  }},
  { id: "l3", name: "Sir Don Bradman", country: "Australia", era: "1928–1948", skills: ["Batting"], highlights: "Test average of 99.94, greatest batsman ever", routines: {
    Batting: [
      { name: "Golf Ball & Stump Drill", duration: "20 min", frequency: "Daily", description: "Hit a golf ball against a wall with a stump to sharpen hand-eye coordination and reflexes" },
      { name: "Run Scoring Simulation", duration: "45 min", frequency: "5x/week", description: "Practice rotating strike with singles and twos, converting starts into big scores" },
      { name: "Back-foot Play", duration: "30 min", frequency: "4x/week", description: "Drill cuts, pulls, and back-foot punches against short-pitched deliveries" },
    ],
  }},
  { id: "l4", name: "Vivian Richards", country: "West Indies", era: "1974–1991", skills: ["Batting", "Fielding"], highlights: "8,540 Test runs, fastest century in ODIs (56 balls)", routines: {
    Batting: [
      { name: "Power Hitting Drills", duration: "40 min", frequency: "5x/week", description: "Practice clearing the front leg and hitting through the line with maximum bat speed" },
      { name: "Intimidation Batting", duration: "30 min", frequency: "3x/week", description: "Face bouncers and pace bowling without helmet to build mental toughness and confidence" },
    ],
    Fielding: [
      { name: "Slip Catching", duration: "20 min", frequency: "Daily", description: "High-speed slip catch practice with reaction catches from close range" },
      { name: "Ground Fielding Sprints", duration: "25 min", frequency: "4x/week", description: "Sprint to collect and throw from various angles to build arm strength and accuracy" },
    ],
  }},
  { id: "l5", name: "Shane Warne", country: "Australia", era: "1992–2007", skills: ["Bowling"], highlights: "708 Test wickets, legendary leg-spinner", routines: {
    Bowling: [
      { name: "Wrist Spin Drills", duration: "45 min", frequency: "Daily", description: "Practice leg-break, googly, flipper, and slider with focus on wrist position and revolutions" },
      { name: "Target Bowling", duration: "30 min", frequency: "5x/week", description: "Bowl at cones placed on good length and outside off stump to develop accuracy and drift" },
      { name: "Finger Strength", duration: "15 min", frequency: "Daily", description: "Squeeze tennis balls and do finger push-ups to build the grip strength needed for sharp spin" },
      { name: "Tactical Visualization", duration: "15 min", frequency: "Daily", description: "Study batsmen videos and plan field settings, over sequences, and dismissal strategies" },
      { name: "Variation Assessment", duration: "2 hrs", frequency: "Monthly", description: "Test all spin variations against quality batsmen under match conditions and measure effectiveness" },
    ],
  }},
  { id: "l6", name: "Muttiah Muralitharan", country: "Sri Lanka", era: "1992–2011", skills: ["Bowling"], highlights: "800 Test wickets, all-time leading wicket-taker", routines: {
    Bowling: [
      { name: "Off-spin Variations", duration: "45 min", frequency: "Daily", description: "Practice doosra, carrom ball, and top-spinner with maximum revolutions and flight control" },
      { name: "Endurance Bowling", duration: "60 min", frequency: "4x/week", description: "Bowl 20-over spells in nets to build stamina for long spells in match conditions" },
      { name: "Shoulder Flexibility", duration: "20 min", frequency: "Daily", description: "Stretching and rotation exercises to maintain the unique bowling action and prevent injury" },
    ],
  }},
  { id: "l7", name: "Wasim Akram", country: "Pakistan", era: "1984–2003", skills: ["Bowling"], highlights: "916 international wickets, king of reverse swing", routines: {
    Bowling: [
      { name: "Reverse Swing Mastery", duration: "40 min", frequency: "5x/week", description: "Practice wrist position for conventional and reverse swing with old and new balls" },
      { name: "Yorker Precision", duration: "30 min", frequency: "Daily", description: "Target the base of stumps consistently — aim for 8/10 yorker accuracy in death overs" },
      { name: "Pace Generation", duration: "30 min", frequency: "4x/week", description: "Run-up rhythm drills and explosive bowling action to maximize pace from a smooth run-up" },
      { name: "Swing Clinic", duration: "2 hrs", frequency: "Monthly", description: "Comprehensive review of swing bowling mechanics with video analysis and corrective drills" },
    ],
  }},
  { id: "l8", name: "Glenn McGrath", country: "Australia", era: "1993–2007", skills: ["Bowling"], highlights: "563 Test wickets, relentless line and length", routines: {
    Bowling: [
      { name: "Line & Length Drills", duration: "45 min", frequency: "Daily", description: "Bowl on a coin placed on a good length outside off stump — aim for 9/10 accuracy" },
      { name: "Seam Position Control", duration: "30 min", frequency: "5x/week", description: "Practice upright seam position for both away and in-swing movement off the pitch" },
      { name: "Mental Toughness", duration: "15 min", frequency: "Daily", description: "Visualize bowling dry spells, maintaining pressure, and executing plans under stress" },
    ],
  }},
  { id: "l9", name: "MS Dhoni", country: "India", era: "2004–2020", skills: ["Wicket-Keeping", "Batting"], highlights: "World Cup-winning captain, lightning-fast stumping", routines: {
    "Wicket-Keeping": [
      { name: "Lightning Stumping Drill", duration: "30 min", frequency: "Daily", description: "Practice collecting the ball and breaking the stumps in one motion — target sub-0.2s stumping time" },
      { name: "Standing Up to Pace", duration: "25 min", frequency: "4x/week", description: "Practice keeping up to medium pacers to improve reflexes and reduce reaction time" },
      { name: "Diving Catch Practice", duration: "20 min", frequency: "5x/week", description: "Catch tennis balls from a catching cradle while diving left and right at full stretch" },
      { name: "Keeping Fitness Test", duration: "2 hrs", frequency: "Monthly", description: "Full day wicket-keeping drill testing stamina over 90 overs with reflex and agility benchmarks" },
    ],
    Batting: [
      { name: "Helicopter Shot Drill", duration: "20 min", frequency: "3x/week", description: "Practice the wrist roll and follow-through for the signature helicopter shot against yorkers" },
      { name: "Death Overs Finishing", duration: "40 min", frequency: "5x/week", description: "Simulate match scenarios: 15 needed off 12, 8 off 6 — practice calculated hitting" },
    ],
  }},
  { id: "l10", name: "Adam Gilchrist", country: "Australia", era: "1996–2008", skills: ["Wicket-Keeping", "Batting"], highlights: "Explosive keeper-batsman, 379 dismissals", routines: {
    "Wicket-Keeping": [
      { name: "Edge Catching Drills", duration: "30 min", frequency: "Daily", description: "Face rapid deflections off bat edges from pace bowling — build reflexes for fast catches" },
      { name: "Footwork Behind Stumps", duration: "20 min", frequency: "5x/week", description: "Lateral movement drills to cover both sides of the wicket smoothly and quickly" },
    ],
    Batting: [
      { name: "Aggressive Intent Nets", duration: "40 min", frequency: "5x/week", description: "Practice attacking from ball one — lofted drives, pulls, and sweeps with positive footwork" },
      { name: "Power Clean Hitting", duration: "25 min", frequency: "4x/week", description: "Hit through the line with a straight bat, focusing on timing over brute force for clean striking" },
    ],
  }},
  { id: "l11", name: "Kumar Sangakkara", country: "Sri Lanka", era: "2000–2015", skills: ["Wicket-Keeping", "Batting"], highlights: "12,400 Test runs, elegant stroke-maker", routines: {
    "Wicket-Keeping": [
      { name: "Spin Keeping", duration: "30 min", frequency: "Daily", description: "Keep to spinners on turning pitches — practice reading turn and adjusting gloves accordingly" },
      { name: "Communication Drills", duration: "15 min", frequency: "3x/week", description: "Practice field placement calls and bowler feedback to improve captaincy from behind the stumps" },
    ],
    Batting: [
      { name: "Classical Stroke Play", duration: "45 min", frequency: "Daily", description: "Practice cover drives, flicks, and cuts with emphasis on balance, head position, and timing" },
      { name: "Innings Building", duration: "60 min", frequency: "3x/week", description: "Extended net sessions simulating match situations — build patience and shot selection discipline" },
    ],
  }},
  { id: "l12", name: "Jonty Rhodes", country: "South Africa", era: "1992–2003", skills: ["Fielding"], highlights: "Greatest fielder ever, iconic run-out of Inzamam", routines: {
    Fielding: [
      { name: "Diving Catch Drills", duration: "30 min", frequency: "Daily", description: "Full-stretch diving catches from both sides — practice landing technique to prevent injury" },
      { name: "Direct Hit Practice", duration: "25 min", frequency: "Daily", description: "Pick up and throw at a single stump from 20-30 meters while sprinting — aim for 7/10 direct hits" },
      { name: "Agility Circuit", duration: "30 min", frequency: "Daily", description: "Cone drills, ladder work, and reaction ball exercises for explosive first-step speed" },
      { name: "Boundary Sliding", duration: "20 min", frequency: "4x/week", description: "Practice sliding to save runs at the boundary and relay catches with a partner" },
      { name: "Fielding Masterclass", duration: "3 hrs", frequency: "Monthly", description: "Full-day fielding camp covering all positions with video review of technique and movement patterns" },
    ],
  }},
  { id: "l13", name: "AB de Villiers", country: "South Africa", era: "2004–2018", skills: ["Batting", "Fielding"], highlights: "360-degree batsman, 176 international catches", routines: {
    Batting: [
      { name: "360-Degree Hitting", duration: "40 min", frequency: "5x/week", description: "Practice switch hits, reverse sweeps, and scoops to develop 360-degree scoring ability" },
      { name: "Innovation Drills", duration: "30 min", frequency: "4x/week", description: "Face random deliveries and improvise shots — build the ability to manufacture runs under pressure" },
    ],
    Fielding: [
      { name: "Outfield Sprint & Throw", duration: "25 min", frequency: "5x/week", description: "Sprint from deep, collect on the move, and throw over the stumps in one fluid motion" },
      { name: "High Catch Practice", duration: "20 min", frequency: "Daily", description: "Practice taking high catches with the sun/lights in eyes — build confidence under pressure" },
    ],
  }},
  { id: "l14", name: "Jacques Kallis", country: "South Africa", era: "1995–2014", skills: ["Batting", "Bowling", "Fielding"], highlights: "13,289 Test runs + 292 wickets, ultimate all-rounder", routines: {
    Batting: [
      { name: "Defensive Technique", duration: "30 min", frequency: "Daily", description: "Practice forward and back defense with soft hands and a still head for rock-solid technique" },
      { name: "Run Accumulation", duration: "40 min", frequency: "4x/week", description: "Rotate strike with singles, convert 1s into 2s, and punish loose deliveries" },
    ],
    Bowling: [
      { name: "Medium-Pace Seam", duration: "30 min", frequency: "4x/week", description: "Practice hitting the seam consistently at 130-135 km/h with late movement" },
      { name: "Swing Bowling", duration: "25 min", frequency: "3x/week", description: "Work on out-swing and in-swing with wrist position variations" },
    ],
    Fielding: [
      { name: "Slip Catching Reflex", duration: "20 min", frequency: "Daily", description: "React to edges off pace bowling in the slip cordon with soft hands and quick reflexes" },
    ],
  }},
  { id: "l15", name: "Sir Garfield Sobers", country: "West Indies", era: "1954–1974", skills: ["Batting", "Bowling", "Fielding"], highlights: "8,032 Test runs + 235 wickets, greatest all-rounder", routines: {
    Batting: [
      { name: "Elegant Stroke Making", duration: "40 min", frequency: "Daily", description: "Practice flowing drives and wristy flicks with emphasis on balance and grace" },
    ],
    Bowling: [
      { name: "Multi-Style Bowling", duration: "40 min", frequency: "4x/week", description: "Alternate between pace, medium, and spin in the same session to develop versatility" },
    ],
    Fielding: [
      { name: "Close-In Catching", duration: "20 min", frequency: "Daily", description: "Short leg and silly point catching drills with protective gear" },
    ],
  }},
  { id: "l16", name: "Imran Khan", country: "Pakistan", era: "1971–1992", skills: ["Batting", "Bowling"], highlights: "3,807 Test runs + 362 wickets, 1992 World Cup winner", routines: {
    Batting: [
      { name: "Lower-Order Resilience", duration: "30 min", frequency: "3x/week", description: "Practice batting with the tail — protecting partners and scoring at crucial moments" },
    ],
    Bowling: [
      { name: "Pace & Bounce", duration: "40 min", frequency: "5x/week", description: "Bowl with full effort to generate pace and steep bounce from a high action point" },
      { name: "Reverse Swing Setup", duration: "30 min", frequency: "4x/week", description: "Practice maintaining the ball for reverse swing and executing late movement at pace" },
    ],
  }},
  { id: "l17", name: "Ricky Ponting", country: "Australia", era: "1995–2012", skills: ["Batting", "Fielding"], highlights: "13,378 Test runs, 196 catches, 2 World Cups as captain", routines: {
    Batting: [
      { name: "Pull Shot Mastery", duration: "30 min", frequency: "Daily", description: "Face short-pitched bowling and practice the pull and hook with precise placement" },
      { name: "Front-Foot Attack", duration: "35 min", frequency: "5x/week", description: "Drive through cover and mid-on with aggressive front-foot movement and head over the ball" },
    ],
    Fielding: [
      { name: "In-field Excellence", duration: "25 min", frequency: "Daily", description: "Ground fielding, pick-up, and direct-hit throws from mid-wicket and cover positions" },
    ],
  }},
  { id: "l18", name: "Rahul Dravid", country: "India", era: "1996–2012", skills: ["Batting"], highlights: "13,288 Test runs, The Wall, 210 catches", routines: {
    Batting: [
      { name: "Leave Drill", duration: "20 min", frequency: "Daily", description: "Practice leaving deliveries outside off — build patience and judgment of line and length" },
      { name: "Extended Net Sessions", duration: "90 min", frequency: "5x/week", description: "Face 500+ balls in a session to build concentration, endurance, and shot selection" },
      { name: "First Hour Batting", duration: "40 min", frequency: "4x/week", description: "Simulate the first hour of a Test match — play with soft hands, watchful leaves, and tight defense" },
      { name: "Technical Audit", duration: "2 hrs", frequency: "Monthly", description: "Comprehensive batting technique review with coach — analyze footage, identify patterns, set monthly targets" },
    ],
  }},
  { id: "l19", name: "Dale Steyn", country: "South Africa", era: "2004–2021", skills: ["Bowling"], highlights: "439 Test wickets, fastest to 400 Test wickets", routines: {
    Bowling: [
      { name: "Express Pace Drills", duration: "40 min", frequency: "5x/week", description: "Full-effort bowling focusing on run-up rhythm, explosive delivery stride, and pace above 145 km/h" },
      { name: "Outswing Mastery", duration: "30 min", frequency: "Daily", description: "Practice late outswing with upright seam — aim to move the ball after it passes the batsman" },
      { name: "Injury Prevention", duration: "25 min", frequency: "Daily", description: "Core stability, hamstring flexibility, and shoulder mobility exercises to stay injury-free" },
    ],
  }},
  { id: "l20", name: "Jeff Thomson", country: "Australia", era: "1972–1985", skills: ["Bowling"], highlights: "Fastest bowler in history, 200 Test wickets", routines: {
    Bowling: [
      { name: "Slingshot Action Drill", duration: "30 min", frequency: "5x/week", description: "Practice the unique slingshot bowling action for maximum pace generation" },
      { name: "Bouncer Control", duration: "25 min", frequency: "4x/week", description: "Bowl bouncers at different heights targeting the batsman's body, throat, and above head" },
      { name: "Raw Pace Intervals", duration: "20 min", frequency: "3x/week", description: "Bowl 6-ball overs at full pace with 2-minute rest intervals to simulate match intensity" },
    ],
  }},
];

export const skillColors: Record<Skill, { bg: string; text: string; border: string }> = {
  Batting: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Bowling: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Fielding: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Wicket-Keeping": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};
