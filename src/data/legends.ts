export type Skill = "Batting" | "Bowling" | "Fielding" | "Wicket-Keeping";

export interface Routine {
  name: string;
  duration: string;
  frequency: string;
  description: string;
  videoUrl: string;
}

export interface Legend {
  id: string;
  name: string;
  country: string;
  era: string;
  skills: Skill[];
  highlights: string;
  photo: string;
  routines: Record<string, Routine[]>;
}

export const legends: Legend[] = [
  { id: "a1", name: "The Classical Batsman", country: "Global", era: "Timeless", skills: ["Batting"], highlights: "Textbook technique, patient accumulator, drives through the V with precision", photo: "", routines: {
    Batting: [
      { name: "Shadow Batting Drills", duration: "30 min", frequency: "Daily", description: "Practice straight drive, cover drive, and pull shot footwork without a ball to build muscle memory", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Throwdown Sessions", duration: "45 min", frequency: "5x/week", description: "Face 200+ throwdowns focusing on playing late and keeping the ball along the ground", videoUrl: "https://www.youtube.com/watch?v=2A5KfqBHMJI" },
      { name: "Mental Visualization", duration: "15 min", frequency: "Daily", description: "Visualize innings construction — playing out the new ball, rotating strike, and accelerating in middle overs", videoUrl: "https://www.youtube.com/watch?v=d6_2ToGYLBg" },
      { name: "Back-foot Defence", duration: "30 min", frequency: "4x/week", description: "Drill defensive back-foot play against short-pitched deliveries with soft hands and balance", videoUrl: "https://www.youtube.com/watch?v=1TtiJtlYwSk" },
    ],
  }},
  { id: "a2", name: "The Power Hitter", country: "Global", era: "Modern", skills: ["Batting"], highlights: "Explosive scoring, clears boundaries at will, dominates powerplay and death overs", photo: "", routines: {
    Batting: [
      { name: "Power Hitting Drills", duration: "40 min", frequency: "5x/week", description: "Practice clearing the front leg and hitting through the line with maximum bat speed", videoUrl: "https://www.youtube.com/watch?v=g6QTr62frF0" },
      { name: "Counter-Attack Mode", duration: "40 min", frequency: "5x/week", description: "Practice attacking from the first ball — back yourself to hit boundaries when bowlers err in length", videoUrl: "https://www.youtube.com/watch?v=g6QTr62frF0" },
      { name: "Spin Domination", duration: "30 min", frequency: "4x/week", description: "Step out and hit spinners over the top — use the feet to convert good balls into scoring opportunities", videoUrl: "https://www.youtube.com/watch?v=FkliqIJMq1M" },
      { name: "Six-Hitting Practice", duration: "30 min", frequency: "3x/week", description: "Practice clearing the boundary with lofted drives, slog sweeps, and reverse hits", videoUrl: "https://www.youtube.com/watch?v=ZGPXm8yAKVg" },
    ],
  }},
  { id: "a3", name: "The Anchor", country: "Global", era: "Timeless", skills: ["Batting"], highlights: "Rock-solid defence, converts starts into big scores, backbone of any innings", photo: "", routines: {
    Batting: [
      { name: "Concentration Drills", duration: "60 min", frequency: "4x/week", description: "Extended net sessions (300+ balls) to build stamina for long innings and deep concentration", videoUrl: "https://www.youtube.com/watch?v=2A5KfqBHMJI" },
      { name: "Run Scoring Simulation", duration: "45 min", frequency: "5x/week", description: "Practice rotating strike with singles and twos, converting starts into big scores", videoUrl: "https://www.youtube.com/watch?v=d6_2ToGYLBg" },
      { name: "Footwork Against Spin", duration: "30 min", frequency: "3x/week", description: "Practice dancing down the pitch to spinners and sweeping with precision placement", videoUrl: "https://www.youtube.com/watch?v=FkliqIJMq1M" },
      { name: "Fitness Circuit", duration: "40 min", frequency: "Daily", description: "Core strength, wrist flexibility exercises, and footwork agility ladder drills", videoUrl: "https://www.youtube.com/watch?v=RraLn96THGc" },
    ],
  }},
  { id: "a4", name: "The Express Pace Bowler", country: "Global", era: "Modern", skills: ["Bowling"], highlights: "Raw speed, hostile bouncers, takes wickets through sheer pace and aggression", photo: "", routines: {
    Bowling: [
      { name: "Raw Pace Generation", duration: "35 min", frequency: "5x/week", description: "Full-effort deliveries focusing on run-up rhythm and explosive front-arm pull for maximum speed", videoUrl: "https://www.youtube.com/watch?v=EC2PWZxDBec" },
      { name: "Bouncer Warfare", duration: "30 min", frequency: "4x/week", description: "Practice hostile short-pitched bowling — target the body and force batters into uncomfortable positions", videoUrl: "https://www.youtube.com/watch?v=16Ib_EdKzvM" },
      { name: "Yorker Accuracy", duration: "30 min", frequency: "Daily", description: "Master the death-overs yorker — full and fast at the base of the stumps", videoUrl: "https://www.youtube.com/watch?v=iO2ChgTJghE" },
      { name: "Pace Bowling Fitness", duration: "45 min", frequency: "4x/week", description: "Sprints, plyometrics, and hip rotation exercises for bowling-specific conditioning", videoUrl: "https://www.youtube.com/watch?v=EC2PWZxDBec" },
    ],
  }},
  { id: "a5", name: "The Swing Bowler", country: "Global", era: "Timeless", skills: ["Bowling"], highlights: "Masters conventional and reverse swing, exploits seam movement in all conditions", photo: "", routines: {
    Bowling: [
      { name: "Seam Position Drills", duration: "30 min", frequency: "Daily", description: "Practice holding the seam upright and releasing with consistent wrist position for swing", videoUrl: "https://www.youtube.com/watch?v=UyBDQevQphc" },
      { name: "Reverse Swing Practice", duration: "30 min", frequency: "4x/week", description: "Bowl with the old ball — work on reverse swing by maintaining a rough side and smooth side", videoUrl: "https://www.youtube.com/watch?v=UyBDQevQphc" },
      { name: "Line & Length Mastery", duration: "40 min", frequency: "5x/week", description: "Bowl on a good length outside off stump relentlessly — build pressure through consistency", videoUrl: "https://www.youtube.com/watch?v=EC2PWZxDBec" },
      { name: "New Ball Bowling", duration: "30 min", frequency: "4x/week", description: "Practice bowling with the new ball to generate late movement and challenge the outside edge", videoUrl: "https://www.youtube.com/watch?v=UyBDQevQphc" },
    ],
  }},
  { id: "a6", name: "The Spin Wizard", country: "Global", era: "Timeless", skills: ["Bowling"], highlights: "Mesmerizes batters with flight, turn, and variation — a match-winner on any surface", photo: "", routines: {
    Bowling: [
      { name: "Spin Variations", duration: "45 min", frequency: "Daily", description: "Practice leg-spin, googly, flipper, and top-spinner with consistent wrist position and disguise", videoUrl: "https://www.youtube.com/watch?v=GvX6H7qHM68" },
      { name: "Flight Control", duration: "30 min", frequency: "5x/week", description: "Toss the ball up above eye-line to deceive batters in flight — vary pace and trajectory", videoUrl: "https://www.youtube.com/watch?v=GvX6H7qHM68" },
      { name: "Finger Strength", duration: "20 min", frequency: "Daily", description: "Finger and wrist strengthening exercises to generate maximum revolutions on the ball", videoUrl: "https://www.youtube.com/watch?v=GvX6H7qHM68" },
      { name: "Tactical Bowling", duration: "30 min", frequency: "3x/week", description: "Practice setting traps — bowl one line then change angle to create catching opportunities", videoUrl: "https://www.youtube.com/watch?v=GvX6H7qHM68" },
    ],
  }},
  { id: "a7", name: "The Athletic Fielder", country: "Global", era: "Modern", skills: ["Fielding"], highlights: "Lightning reflexes, spectacular catches, saves 20+ runs every match in the field", photo: "", routines: {
    Fielding: [
      { name: "Diving Catch Drills", duration: "30 min", frequency: "Daily", description: "Practice full-length diving catches at various angles — slip, gully, and boundary positions", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Ground Fielding", duration: "25 min", frequency: "5x/week", description: "Attack the ball, pick up cleanly, and hit the stumps with direct throws from any angle", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Reaction Drills", duration: "20 min", frequency: "Daily", description: "Close-catching practice with reaction balls and sidearm throws to sharpen reflexes", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Boundary Sprints", duration: "30 min", frequency: "4x/week", description: "Sprint from boundary to boundary, judge the ball in the air, and take catches on the run", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
    ],
  }},
  { id: "a8", name: "The Wicketkeeper-Batter", country: "Global", era: "Modern", skills: ["Wicket-Keeping", "Batting"], highlights: "Agile behind the stumps, explosive with the bat, changes games from number 7", photo: "", routines: {
    "Wicket-Keeping": [
      { name: "Keeping Drills", duration: "40 min", frequency: "Daily", description: "Practice taking deliveries standing up and standing back — work on footwork and soft hands", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Stumping Practice", duration: "30 min", frequency: "5x/week", description: "Quick glove work for stumpings — catch and break the stumps in one motion against spin", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
      { name: "Reaction Catching", duration: "20 min", frequency: "Daily", description: "Edge catches off pace bowlers — practice lateral movement and one-handed takes", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
    ],
    Batting: [
      { name: "Counter-Attack Batting", duration: "30 min", frequency: "4x/week", description: "Practice promoting yourself in the order and taking the game to the bowlers", videoUrl: "https://www.youtube.com/watch?v=g6QTr62frF0" },
    ],
  }},
  { id: "a9", name: "The All-Rounder", country: "Global", era: "Timeless", skills: ["Batting", "Bowling", "Fielding"] as Skill[], highlights: "Contributes with bat, ball, and in the field — the ultimate team player", photo: "", routines: {
    Batting: [
      { name: "Situation Batting", duration: "40 min", frequency: "4x/week", description: "Practice batting in different match situations — chasing, setting targets, and late acceleration", videoUrl: "https://www.youtube.com/watch?v=2A5KfqBHMJI" },
      { name: "Boundary Clearing", duration: "30 min", frequency: "3x/week", description: "Practice clearing the boundary from ball 1 when coming in at the death", videoUrl: "https://www.youtube.com/watch?v=g6QTr62frF0" },
    ],
    Bowling: [
      { name: "Partnership Breaking", duration: "30 min", frequency: "4x/week", description: "Practice bowling change spells — vary pace, angle, and length to break partnerships", videoUrl: "https://www.youtube.com/watch?v=EC2PWZxDBec" },
    ],
    Fielding: [
      { name: "Athletic Fielding", duration: "25 min", frequency: "Daily", description: "Ground fielding, relay throws, and backward catches — be the best fielder in the team", videoUrl: "https://www.youtube.com/watch?v=yeImrfgNJoM" },
    ],
  }},
  { id: "a10", name: "The Left-Arm Quick", country: "Global", era: "Modern", skills: ["Bowling"], highlights: "Natural angle into right-handers, devastating with the new ball, yorker specialist", photo: "", routines: {
    Bowling: [
      { name: "Left-Arm Angle Attack", duration: "40 min", frequency: "Daily", description: "Exploit the natural angle into right-handers — target the stumps and LBW zone consistently", videoUrl: "https://www.youtube.com/watch?v=EC2PWZxDBec" },
      { name: "Inswing Yorker", duration: "40 min", frequency: "Daily", description: "Master the devastating inswinging yorker to right-handers at high pace", videoUrl: "https://www.youtube.com/watch?v=iO2ChgTJghE" },
      { name: "Powerplay Bowling", duration: "30 min", frequency: "4x/week", description: "Practice bowling in powerplay overs — mix full, short, and wide yorkers to take early wickets", videoUrl: "https://www.youtube.com/watch?v=iO2ChgTJghE" },
    ],
  }},
];

export const skillColors: Record<Skill, { bg: string; text: string; border: string }> = {
  Batting: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Bowling: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Fielding: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Wicket-Keeping": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};
