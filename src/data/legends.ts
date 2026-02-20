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
  { id: "l1", name: "Sachin Tendulkar", country: "India", era: "1989–2013", skills: ["Batting"], highlights: "100 international centuries, 34,357 runs across formats", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/The_cricket_legend_Sachin_Tendulkar_at_the_Oval_Maidan_in_Mumbai_During_the_Duke_and_Duchess_of_Cambridge_Visit%2826271019082%29.jpg/200px-The_cricket_legend_Sachin_Tendulkar_at_the_Oval_Maidan_in_Mumbai_During_the_Duke_and_Duchess_of_Cambridge_Visit%2826271019082%29.jpg", routines: {
    Batting: [
      { name: "Shadow Batting Drills", duration: "30 min", frequency: "Daily", description: "Practice straight drive, cover drive, and pull shot footwork without a ball to build muscle memory", videoUrl: "https://www.youtube.com/results?search_query=cricket+shadow+batting+drills+tutorial" },
      { name: "Throwdown Sessions", duration: "45 min", frequency: "5x/week", description: "Face 200+ throwdowns focusing on playing late and keeping the ball along the ground", videoUrl: "https://www.youtube.com/results?search_query=cricket+throwdown+batting+practice" },
      { name: "Mental Visualization", duration: "15 min", frequency: "Daily", description: "Visualize innings construction — playing out the new ball, rotating strike, and accelerating in middle overs", videoUrl: "https://www.youtube.com/results?search_query=cricket+mental+visualization+batting" },
      { name: "Fitness Circuit", duration: "40 min", frequency: "Daily", description: "Core strength, wrist flexibility exercises, and footwork agility ladder drills", videoUrl: "https://www.youtube.com/results?search_query=cricket+fitness+training+agility+drills" },
      { name: "Batting Technique Review", duration: "2 hrs", frequency: "Monthly", description: "Full video analysis session reviewing recent innings, identifying technical flaws, and setting corrective goals", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+technique+video+analysis" },
    ],
  }},
  { id: "l2", name: "Brian Lara", country: "West Indies", era: "1990–2007", skills: ["Batting"], highlights: "400* in Tests, 501* in first-class cricket", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Brian_Lara_at_2012_Mumbai_Marathon_pre_bash.jpg/200px-Brian_Lara_at_2012_Mumbai_Marathon_pre_bash.jpg", routines: {
    Batting: [
      { name: "High Backlift Practice", duration: "30 min", frequency: "Daily", description: "Practice the signature high backlift with emphasis on timing and bat flow through the ball", videoUrl: "https://www.youtube.com/results?search_query=cricket+high+backlift+batting+technique" },
      { name: "Concentration Drills", duration: "60 min", frequency: "4x/week", description: "Extended net sessions (300+ balls) to build stamina for long innings and deep concentration", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+concentration+long+innings" },
      { name: "Footwork Against Spin", duration: "30 min", frequency: "3x/week", description: "Practice dancing down the pitch to spinners and sweeping with precision placement", videoUrl: "https://www.youtube.com/results?search_query=cricket+footwork+against+spin+bowling" },
      { name: "Match Simulation Day", duration: "3 hrs", frequency: "Monthly", description: "Full match simulation with scoreboard pressure, field settings, and bowling changes to test concentration", videoUrl: "https://www.youtube.com/results?search_query=cricket+match+simulation+practice" },
    ],
  }},
  { id: "l3", name: "Sir Don Bradman", country: "Australia", era: "1928–1948", skills: ["Batting"], highlights: "Test average of 99.94, greatest batsman ever", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Don_Bradman_1930.jpg/200px-Don_Bradman_1930.jpg", routines: {
    Batting: [
      { name: "Golf Ball & Stump Drill", duration: "20 min", frequency: "Daily", description: "Hit a golf ball against a wall with a stump to sharpen hand-eye coordination and reflexes", videoUrl: "https://www.youtube.com/results?search_query=bradman+golf+ball+stump+drill+cricket" },
      { name: "Run Scoring Simulation", duration: "45 min", frequency: "5x/week", description: "Practice rotating strike with singles and twos, converting starts into big scores", videoUrl: "https://www.youtube.com/results?search_query=cricket+run+scoring+rotation+strike" },
      { name: "Back-foot Play", duration: "30 min", frequency: "4x/week", description: "Drill cuts, pulls, and back-foot punches against short-pitched deliveries", videoUrl: "https://www.youtube.com/results?search_query=cricket+back+foot+batting+drills" },
    ],
  }},
  { id: "l4", name: "Vivian Richards", country: "West Indies", era: "1974–1991", skills: ["Batting", "Fielding"], highlights: "8,540 Test runs, fastest century in ODIs (56 balls)", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Sir_Vivian_Richards_2022.jpg/200px-Sir_Vivian_Richards_2022.jpg", routines: {
    Batting: [
      { name: "Power Hitting Drills", duration: "40 min", frequency: "5x/week", description: "Practice clearing the front leg and hitting through the line with maximum bat speed", videoUrl: "https://www.youtube.com/results?search_query=cricket+power+hitting+drills+t20" },
      { name: "Intimidation Batting", duration: "30 min", frequency: "3x/week", description: "Face bouncers and pace bowling without helmet to build mental toughness and confidence", videoUrl: "https://www.youtube.com/results?search_query=cricket+facing+fast+bowling+bouncer" },
    ],
    Fielding: [
      { name: "Slip Catching", duration: "20 min", frequency: "Daily", description: "High-speed slip catch practice with reaction catches from close range", videoUrl: "https://www.youtube.com/results?search_query=cricket+slip+catching+drills" },
      { name: "Ground Fielding Sprints", duration: "25 min", frequency: "4x/week", description: "Sprint to collect and throw from various angles to build arm strength and accuracy", videoUrl: "https://www.youtube.com/results?search_query=cricket+ground+fielding+drills" },
    ],
  }},
  { id: "l5", name: "Shane Warne", country: "Australia", era: "1992–2007", skills: ["Bowling"], highlights: "708 Test wickets, legendary leg-spinner", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Shane_Warne_February_2015.jpg/200px-Shane_Warne_February_2015.jpg", routines: {
    Bowling: [
      { name: "Wrist Spin Drills", duration: "45 min", frequency: "Daily", description: "Practice leg-break, googly, flipper, and slider with focus on wrist position and revolutions", videoUrl: "https://www.youtube.com/results?search_query=cricket+leg+spin+wrist+spin+bowling+drills" },
      { name: "Target Bowling", duration: "30 min", frequency: "5x/week", description: "Bowl at cones placed on good length and outside off stump to develop accuracy and drift", videoUrl: "https://www.youtube.com/results?search_query=cricket+target+bowling+accuracy+drills" },
      { name: "Finger Strength", duration: "15 min", frequency: "Daily", description: "Squeeze tennis balls and do finger push-ups to build the grip strength needed for sharp spin", videoUrl: "https://www.youtube.com/results?search_query=cricket+bowler+finger+strength+exercises" },
      { name: "Tactical Visualization", duration: "15 min", frequency: "Daily", description: "Study batsmen videos and plan field settings, over sequences, and dismissal strategies", videoUrl: "https://www.youtube.com/results?search_query=cricket+bowling+tactics+strategy" },
      { name: "Variation Assessment", duration: "2 hrs", frequency: "Monthly", description: "Test all spin variations against quality batsmen under match conditions and measure effectiveness", videoUrl: "https://www.youtube.com/results?search_query=cricket+spin+bowling+variations+practice" },
    ],
  }},
  { id: "l6", name: "Muttiah Muralitharan", country: "Sri Lanka", era: "1992–2011", skills: ["Bowling"], highlights: "800 Test wickets, all-time leading wicket-taker", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Photograph_of_Muttiah_Muralitharan.jpg/200px-Photograph_of_Muttiah_Muralitharan.jpg", routines: {
    Bowling: [
      { name: "Off-spin Variations", duration: "45 min", frequency: "Daily", description: "Practice doosra, carrom ball, and top-spinner with maximum revolutions and flight control", videoUrl: "https://www.youtube.com/results?search_query=cricket+off+spin+doosra+carrom+ball" },
      { name: "Endurance Bowling", duration: "60 min", frequency: "4x/week", description: "Bowl 20-over spells in nets to build stamina for long spells in match conditions", videoUrl: "https://www.youtube.com/results?search_query=cricket+bowling+endurance+long+spells" },
      { name: "Shoulder Flexibility", duration: "20 min", frequency: "Daily", description: "Stretching and rotation exercises to maintain the unique bowling action and prevent injury", videoUrl: "https://www.youtube.com/results?search_query=cricket+bowling+shoulder+flexibility+exercises" },
    ],
  }},
  { id: "l7", name: "Wasim Akram", country: "Pakistan", era: "1984–2003", skills: ["Bowling"], highlights: "916 international wickets, king of reverse swing", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Wasim-akram-gesf-2018-7878.jpg/200px-Wasim-akram-gesf-2018-7878.jpg", routines: {
    Bowling: [
      { name: "Reverse Swing Mastery", duration: "40 min", frequency: "5x/week", description: "Practice wrist position for conventional and reverse swing with old and new balls", videoUrl: "https://www.youtube.com/results?search_query=cricket+reverse+swing+bowling+tutorial" },
      { name: "Yorker Precision", duration: "30 min", frequency: "Daily", description: "Target the base of stumps consistently — aim for 8/10 yorker accuracy in death overs", videoUrl: "https://www.youtube.com/results?search_query=cricket+yorker+bowling+practice+death+overs" },
      { name: "Pace Generation", duration: "30 min", frequency: "4x/week", description: "Run-up rhythm drills and explosive bowling action to maximize pace from a smooth run-up", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+pace+generation" },
      { name: "Swing Clinic", duration: "2 hrs", frequency: "Monthly", description: "Comprehensive review of swing bowling mechanics with video analysis and corrective drills", videoUrl: "https://www.youtube.com/results?search_query=cricket+swing+bowling+technique+masterclass" },
    ],
  }},
  { id: "l8", name: "Glenn McGrath", country: "Australia", era: "1993–2007", skills: ["Bowling"], highlights: "563 Test wickets, relentless line and length", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Glenn_McGrath_Portrait%2C_2011%2C_jjron.jpg/200px-Glenn_McGrath_Portrait%2C_2011%2C_jjron.jpg", routines: {
    Bowling: [
      { name: "Line & Length Drills", duration: "45 min", frequency: "Daily", description: "Bowl on a coin placed on a good length outside off stump — aim for 9/10 accuracy", videoUrl: "https://www.youtube.com/results?search_query=cricket+line+and+length+bowling+drills" },
      { name: "Seam Position Control", duration: "30 min", frequency: "5x/week", description: "Practice upright seam position for both away and in-swing movement off the pitch", videoUrl: "https://www.youtube.com/results?search_query=cricket+seam+position+bowling+technique" },
      { name: "Mental Toughness", duration: "15 min", frequency: "Daily", description: "Visualize bowling dry spells, maintaining pressure, and executing plans under stress", videoUrl: "https://www.youtube.com/results?search_query=cricket+bowling+mental+toughness+training" },
    ],
  }},
  { id: "l9", name: "MS Dhoni", country: "India", era: "2004–2020", skills: ["Wicket-Keeping", "Batting"], highlights: "World Cup-winning captain, lightning-fast stumping", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg/200px-MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg", routines: {
    "Wicket-Keeping": [
      { name: "Lightning Stumping Drill", duration: "30 min", frequency: "Daily", description: "Practice collecting the ball and breaking the stumps in one motion — target sub-0.2s stumping time", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeping+stumping+drills" },
      { name: "Standing Up to Pace", duration: "25 min", frequency: "4x/week", description: "Practice keeping up to medium pacers to improve reflexes and reduce reaction time", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeping+standing+up+pace" },
      { name: "Diving Catch Practice", duration: "20 min", frequency: "5x/week", description: "Catch tennis balls from a catching cradle while diving left and right at full stretch", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeper+diving+catch+drills" },
      { name: "Keeping Fitness Test", duration: "2 hrs", frequency: "Monthly", description: "Full day wicket-keeping drill testing stamina over 90 overs with reflex and agility benchmarks", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeper+fitness+training" },
    ],
    Batting: [
      { name: "Helicopter Shot Drill", duration: "20 min", frequency: "3x/week", description: "Practice the wrist roll and follow-through for the signature helicopter shot against yorkers", videoUrl: "https://www.youtube.com/results?search_query=ms+dhoni+helicopter+shot+tutorial" },
      { name: "Death Overs Finishing", duration: "40 min", frequency: "5x/week", description: "Simulate match scenarios: 15 needed off 12, 8 off 6 — practice calculated hitting", videoUrl: "https://www.youtube.com/results?search_query=cricket+death+overs+finishing+batting" },
    ],
  }},
  { id: "l10", name: "Adam Gilchrist", country: "Australia", era: "1996–2008", skills: ["Wicket-Keeping", "Batting"], highlights: "Explosive keeper-batsman, 379 dismissals", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Adam_Gilchrist_of_Australia_%28cropped%29.jpg/200px-Adam_Gilchrist_of_Australia_%28cropped%29.jpg", routines: {
    "Wicket-Keeping": [
      { name: "Edge Catching Drills", duration: "30 min", frequency: "Daily", description: "Face rapid deflections off bat edges from pace bowling — build reflexes for fast catches", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeper+edge+catching+drills" },
      { name: "Footwork Behind Stumps", duration: "20 min", frequency: "5x/week", description: "Lateral movement drills to cover both sides of the wicket smoothly and quickly", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeper+footwork+drills" },
    ],
    Batting: [
      { name: "Aggressive Intent Nets", duration: "40 min", frequency: "5x/week", description: "Practice attacking from ball one — lofted drives, pulls, and sweeps with positive footwork", videoUrl: "https://www.youtube.com/results?search_query=cricket+aggressive+batting+net+practice" },
      { name: "Power Clean Hitting", duration: "25 min", frequency: "4x/week", description: "Hit through the line with a straight bat, focusing on timing over brute force for clean striking", videoUrl: "https://www.youtube.com/results?search_query=cricket+clean+hitting+batting+technique" },
    ],
  }},
  { id: "l11", name: "Kumar Sangakkara", country: "Sri Lanka", era: "2000–2015", skills: ["Wicket-Keeping", "Batting"], highlights: "12,400 Test runs, elegant stroke-maker", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Kumar_Sangakkara_bat_in_hand.JPG/200px-Kumar_Sangakkara_bat_in_hand.JPG", routines: {
    "Wicket-Keeping": [
      { name: "Spin Keeping", duration: "30 min", frequency: "Daily", description: "Keep to spinners on turning pitches — practice reading turn and adjusting gloves accordingly", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeping+to+spin+bowling" },
      { name: "Communication Drills", duration: "15 min", frequency: "3x/week", description: "Practice field placement calls and bowler feedback to improve captaincy from behind the stumps", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeper+communication+field" },
    ],
    Batting: [
      { name: "Classical Stroke Play", duration: "45 min", frequency: "Daily", description: "Practice cover drives, flicks, and cuts with emphasis on balance, head position, and timing", videoUrl: "https://www.youtube.com/results?search_query=cricket+classical+batting+strokes+tutorial" },
      { name: "Innings Building", duration: "60 min", frequency: "3x/week", description: "Extended net sessions simulating match situations — build patience and shot selection discipline", videoUrl: "https://www.youtube.com/results?search_query=cricket+innings+building+batting+practice" },
    ],
  }},
  { id: "l12", name: "Jonty Rhodes", country: "South Africa", era: "1992–2003", skills: ["Fielding"], highlights: "Greatest fielder ever, iconic run-out of Inzamam", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/JONTY_RHODES.jpg/200px-JONTY_RHODES.jpg", routines: {
    Fielding: [
      { name: "Diving Catch Drills", duration: "30 min", frequency: "Daily", description: "Full-stretch diving catches from both sides — practice landing technique to prevent injury", videoUrl: "https://www.youtube.com/results?search_query=cricket+diving+catch+fielding+drills" },
      { name: "Direct Hit Practice", duration: "25 min", frequency: "Daily", description: "Pick up and throw at a single stump from 20-30 meters while sprinting — aim for 7/10 direct hits", videoUrl: "https://www.youtube.com/results?search_query=cricket+direct+hit+fielding+practice" },
      { name: "Agility Circuit", duration: "30 min", frequency: "Daily", description: "Cone drills, ladder work, and reaction ball exercises for explosive first-step speed", videoUrl: "https://www.youtube.com/results?search_query=cricket+fielding+agility+cone+drills" },
      { name: "Boundary Sliding", duration: "20 min", frequency: "4x/week", description: "Practice sliding to save runs at the boundary and relay catches with a partner", videoUrl: "https://www.youtube.com/results?search_query=cricket+boundary+fielding+sliding+technique" },
      { name: "Fielding Masterclass", duration: "3 hrs", frequency: "Monthly", description: "Full-day fielding camp covering all positions with video review of technique and movement patterns", videoUrl: "https://www.youtube.com/results?search_query=cricket+fielding+masterclass+training" },
    ],
  }},
  { id: "l13", name: "AB de Villiers", country: "South Africa", era: "2004–2018", skills: ["Batting", "Fielding"], highlights: "360-degree batsman, 176 international catches", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/AB_de_villiers_%28cropped%29.jpg/200px-AB_de_villiers_%28cropped%29.jpg", routines: {
    Batting: [
      { name: "360-Degree Hitting", duration: "40 min", frequency: "5x/week", description: "Practice switch hits, reverse sweeps, and scoops to develop 360-degree scoring ability", videoUrl: "https://www.youtube.com/results?search_query=ab+de+villiers+360+degree+batting+drills" },
      { name: "Innovation Drills", duration: "30 min", frequency: "4x/week", description: "Face random deliveries and improvise shots — build the ability to manufacture runs under pressure", videoUrl: "https://www.youtube.com/results?search_query=cricket+innovative+shots+switch+hit+scoop" },
    ],
    Fielding: [
      { name: "Outfield Sprint & Throw", duration: "25 min", frequency: "5x/week", description: "Sprint from deep, collect on the move, and throw over the stumps in one fluid motion", videoUrl: "https://www.youtube.com/results?search_query=cricket+outfield+throwing+fielding+drills" },
      { name: "High Catch Practice", duration: "20 min", frequency: "Daily", description: "Practice taking high catches with the sun/lights in eyes — build confidence under pressure", videoUrl: "https://www.youtube.com/results?search_query=cricket+high+catch+fielding+practice" },
    ],
  }},
  { id: "l14", name: "Jacques Kallis", country: "South Africa", era: "1995–2014", skills: ["Batting", "Bowling", "Fielding"], highlights: "13,289 Test runs + 292 wickets, ultimate all-rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Jacques_Kallis_6.jpg/200px-Jacques_Kallis_6.jpg", routines: {
    Batting: [
      { name: "Defensive Technique", duration: "30 min", frequency: "Daily", description: "Practice forward and back defense with soft hands and a still head for rock-solid technique", videoUrl: "https://www.youtube.com/results?search_query=cricket+defensive+batting+technique+drills" },
      { name: "Run Accumulation", duration: "40 min", frequency: "4x/week", description: "Rotate strike with singles, convert 1s into 2s, and punish loose deliveries", videoUrl: "https://www.youtube.com/results?search_query=cricket+run+accumulation+rotating+strike" },
    ],
    Bowling: [
      { name: "Medium-Pace Seam", duration: "30 min", frequency: "4x/week", description: "Practice hitting the seam consistently at 130-135 km/h with late movement", videoUrl: "https://www.youtube.com/results?search_query=cricket+medium+pace+seam+bowling+technique" },
      { name: "Swing Bowling", duration: "25 min", frequency: "3x/week", description: "Work on out-swing and in-swing with wrist position variations", videoUrl: "https://www.youtube.com/results?search_query=cricket+swing+bowling+in+out+tutorial" },
    ],
    Fielding: [
      { name: "Slip Catching Reflex", duration: "20 min", frequency: "Daily", description: "React to edges off pace bowling in the slip cordon with soft hands and quick reflexes", videoUrl: "https://www.youtube.com/results?search_query=cricket+slip+catching+reflex+drills" },
    ],
  }},
  { id: "l15", name: "Sir Garfield Sobers", country: "West Indies", era: "1954–1974", skills: ["Batting", "Bowling", "Fielding"], highlights: "8,032 Test runs + 235 wickets, greatest all-rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Sir_Garry_Sobers_2012.jpg/200px-Sir_Garry_Sobers_2012.jpg", routines: {
    Batting: [
      { name: "Elegant Stroke Making", duration: "40 min", frequency: "Daily", description: "Practice flowing drives and wristy flicks with emphasis on balance and grace", videoUrl: "https://www.youtube.com/results?search_query=cricket+elegant+stroke+making+drives" },
    ],
    Bowling: [
      { name: "Multi-Style Bowling", duration: "40 min", frequency: "4x/week", description: "Alternate between pace, medium, and spin in the same session to develop versatility", videoUrl: "https://www.youtube.com/results?search_query=cricket+all+rounder+bowling+pace+spin" },
    ],
    Fielding: [
      { name: "Close-In Catching", duration: "20 min", frequency: "Daily", description: "Short leg and silly point catching drills with protective gear", videoUrl: "https://www.youtube.com/results?search_query=cricket+close+in+catching+short+leg" },
    ],
  }},
  { id: "l16", name: "Imran Khan", country: "Pakistan", era: "1971–1992", skills: ["Batting", "Bowling"], highlights: "3,807 Test runs + 362 wickets, 1992 World Cup winner", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Minister_Imran_Khan_Adresses_the_Forum_01.jpg/200px-Prime_Minister_Imran_Khan_Adresses_the_Forum_01.jpg", routines: {
    Batting: [
      { name: "Lower-Order Resilience", duration: "30 min", frequency: "3x/week", description: "Practice batting with the tail — protecting partners and scoring at crucial moments", videoUrl: "https://www.youtube.com/results?search_query=cricket+lower+order+batting+tail+ender" },
    ],
    Bowling: [
      { name: "Pace & Bounce", duration: "40 min", frequency: "5x/week", description: "Bowl with full effort to generate pace and steep bounce from a high action point", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+pace+bounce+technique" },
      { name: "Reverse Swing Setup", duration: "30 min", frequency: "4x/week", description: "Practice maintaining the ball for reverse swing and executing late movement at pace", videoUrl: "https://www.youtube.com/results?search_query=cricket+reverse+swing+ball+maintenance" },
    ],
  }},
  { id: "l17", name: "Ricky Ponting", country: "Australia", era: "1995–2012", skills: ["Batting", "Fielding"], highlights: "13,378 Test runs, 196 catches, 2 World Cups as captain", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Ricky_Ponting_2015.jpg/200px-Ricky_Ponting_2015.jpg", routines: {
    Batting: [
      { name: "Pull Shot Mastery", duration: "30 min", frequency: "Daily", description: "Face short-pitched bowling and practice the pull and hook with precise placement", videoUrl: "https://www.youtube.com/results?search_query=cricket+pull+shot+hook+shot+technique" },
      { name: "Front-Foot Attack", duration: "35 min", frequency: "5x/week", description: "Drive through cover and mid-on with aggressive front-foot movement and head over the ball", videoUrl: "https://www.youtube.com/results?search_query=cricket+front+foot+drive+batting+technique" },
    ],
    Fielding: [
      { name: "In-field Excellence", duration: "25 min", frequency: "Daily", description: "Ground fielding, pick-up, and direct-hit throws from mid-wicket and cover positions", videoUrl: "https://www.youtube.com/results?search_query=cricket+infield+fielding+direct+hit+drills" },
    ],
  }},
  { id: "l18", name: "Rahul Dravid", country: "India", era: "1996–2012", skills: ["Batting"], highlights: "13,288 Test runs, The Wall, 210 catches", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Rahul_Dravid_in_2024.jpg/200px-Rahul_Dravid_in_2024.jpg", routines: {
    Batting: [
      { name: "Leave Drill", duration: "20 min", frequency: "Daily", description: "Practice leaving deliveries outside off — build patience and judgment of line and length", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+leave+drill+off+stump" },
      { name: "Extended Net Sessions", duration: "90 min", frequency: "5x/week", description: "Face 500+ balls in a session to build concentration, endurance, and shot selection", videoUrl: "https://www.youtube.com/results?search_query=cricket+net+session+batting+practice" },
      { name: "First Hour Batting", duration: "40 min", frequency: "4x/week", description: "Simulate the first hour of a Test match — play with soft hands, watchful leaves, and tight defense", videoUrl: "https://www.youtube.com/results?search_query=cricket+test+match+first+hour+batting" },
      { name: "Technical Audit", duration: "2 hrs", frequency: "Monthly", description: "Comprehensive batting technique review with coach — analyze footage, identify patterns, set monthly targets", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+technique+video+analysis+review" },
    ],
  }},
  { id: "l19", name: "Dale Steyn", country: "South Africa", era: "2004–2021", skills: ["Bowling"], highlights: "439 Test wickets, fastest to 400 Test wickets", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Dale_Steyn_YM.jpg/200px-Dale_Steyn_YM.jpg", routines: {
    Bowling: [
      { name: "Express Pace Drills", duration: "40 min", frequency: "5x/week", description: "Full-effort bowling focusing on run-up rhythm, explosive delivery stride, and pace above 145 km/h", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+express+pace+drills" },
      { name: "Outswing Mastery", duration: "30 min", frequency: "Daily", description: "Practice late outswing with upright seam — aim to move the ball after it passes the batsman", videoUrl: "https://www.youtube.com/results?search_query=cricket+outswing+bowling+technique+tutorial" },
      { name: "Injury Prevention", duration: "25 min", frequency: "Daily", description: "Core stability, hamstring flexibility, and shoulder mobility exercises to stay injury-free", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowler+injury+prevention+exercises" },
    ],
  }},
  { id: "l20", name: "Jeff Thomson", country: "Australia", era: "1972–1985", skills: ["Bowling"], highlights: "Fastest bowler in history, 200 Test wickets", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LILLEE_AND_THOMSON_%282877049442%29.jpg/200px-LILLEE_AND_THOMSON_%282877049442%29.jpg", routines: {
    Bowling: [
      { name: "Slingshot Action Drill", duration: "30 min", frequency: "5x/week", description: "Practice the unique slingshot bowling action for maximum pace generation", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+slingshot+action" },
      { name: "Bouncer Control", duration: "25 min", frequency: "4x/week", description: "Bowl bouncers at different heights targeting the batsman's body, throat, and above head", videoUrl: "https://www.youtube.com/results?search_query=cricket+bouncer+bowling+short+ball+technique" },
      { name: "Raw Pace Intervals", duration: "20 min", frequency: "3x/week", description: "Bowl 6-ball overs at full pace with 2-minute rest intervals to simulate match intensity", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+interval+training" },
    ],
  }},
  { id: "l21", name: "Virat Kohli", country: "India", era: "2008–present", skills: ["Batting"], highlights: "80+ international centuries, chasing master, modern-era run machine", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_the_Narendra_Modi_Stadium_on_09_March_2023.jpg/200px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_the_Narendra_Modi_Stadium_on_09_March_2023.jpg", routines: {
    Batting: [
      { name: "Chase Simulation", duration: "45 min", frequency: "5x/week", description: "Simulate run-chase scenarios — 120 off 20 overs, 50 off 30 balls — build pressure-handling skills", videoUrl: "https://www.youtube.com/results?search_query=virat+kohli+batting+chase+drills" },
      { name: "Cover Drive Perfection", duration: "30 min", frequency: "Daily", description: "Repetitive cover drives with emphasis on head position, weight transfer, and full follow-through", videoUrl: "https://www.youtube.com/results?search_query=virat+kohli+cover+drive+technique" },
      { name: "Fitness & Conditioning", duration: "60 min", frequency: "Daily", description: "High-intensity interval training, core work, and agility drills — elite fitness is non-negotiable", videoUrl: "https://www.youtube.com/results?search_query=virat+kohli+fitness+training+routine" },
      { name: "Fast Bowling Nets", duration: "40 min", frequency: "5x/week", description: "Face 150+ km/h throwdowns to sharpen reflexes and timing against express pace", videoUrl: "https://www.youtube.com/results?search_query=cricket+facing+fast+bowling+net+practice" },
    ],
  }},
  { id: "l22", name: "Rohit Sharma", country: "India", era: "2007–present", skills: ["Batting"], highlights: "3 ODI double centuries, Hitman, T20 World Cup-winning captain", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rohit_Sharma_India_cricket_captain.jpg/200px-Rohit_Sharma_India_cricket_captain.jpg", routines: {
    Batting: [
      { name: "Pull Shot Clinic", duration: "30 min", frequency: "Daily", description: "Practice the signature pull and hook shots — roll the wrists, place between fielders", videoUrl: "https://www.youtube.com/results?search_query=rohit+sharma+pull+shot+technique+tutorial" },
      { name: "Timing Over Power", duration: "40 min", frequency: "5x/week", description: "Practice lofted drives and flicks using pure timing — minimal effort, maximum distance", videoUrl: "https://www.youtube.com/results?search_query=rohit+sharma+effortless+batting+timing" },
      { name: "Powerplay Domination", duration: "30 min", frequency: "4x/week", description: "Simulate opening in powerplay overs — target boundaries through gaps with field restrictions", videoUrl: "https://www.youtube.com/results?search_query=cricket+powerplay+batting+opening+drills" },
    ],
  }},
  { id: "l23", name: "Jasprit Bumrah", country: "India", era: "2016–present", skills: ["Bowling"], highlights: "Unorthodox action, death-overs specialist, #1 ICC Test bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jasprit_Bumrah_at_Wankhede_Stadium%2C_Nov_2024.jpg/200px-Jasprit_Bumrah_at_Wankhede_Stadium%2C_Nov_2024.jpg", routines: {
    Bowling: [
      { name: "Yorker Factory", duration: "40 min", frequency: "Daily", description: "Bowl 50+ yorkers targeting the base of stumps and blockhole — aim for 80% accuracy", videoUrl: "https://www.youtube.com/results?search_query=jasprit+bumrah+yorker+bowling+drills" },
      { name: "Short Run-Up Pace", duration: "30 min", frequency: "5x/week", description: "Generate 140+ km/h from a short run-up — focus on explosive delivery stride and hip drive", videoUrl: "https://www.youtube.com/results?search_query=bumrah+bowling+action+short+run+up" },
      { name: "Variation Mastery", duration: "35 min", frequency: "4x/week", description: "Practice slower balls, knuckle balls, wide yorkers, and bouncers with the same action", videoUrl: "https://www.youtube.com/results?search_query=cricket+death+bowling+variations+slower+ball" },
      { name: "Core & Lower Back", duration: "25 min", frequency: "Daily", description: "Strengthen core and lower back to support the unique hyperextended bowling action", videoUrl: "https://www.youtube.com/results?search_query=fast+bowler+core+lower+back+exercises" },
    ],
  }},
  { id: "l24", name: "Pat Cummins", country: "Australia", era: "2011–present", skills: ["Bowling"], highlights: "World Cup-winning captain, 200+ Test wickets, relentless fast bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/2018.01.06.17.38.18-Pat_Cummins_%2839488673691%29_%28cropped%29.jpg/200px-2018.01.06.17.38.18-Pat_Cummins_%2839488673691%29_%28cropped%29.jpg", routines: {
    Bowling: [
      { name: "Channel Bowling", duration: "40 min", frequency: "Daily", description: "Hit the 4th-5th stump channel relentlessly — build the consistency to bowl 6 good balls an over", videoUrl: "https://www.youtube.com/results?search_query=pat+cummins+bowling+line+length+channel" },
      { name: "Bouncer Setup", duration: "30 min", frequency: "4x/week", description: "Use the bouncer as a setup ball — follow with a full ball targeting the stumps", videoUrl: "https://www.youtube.com/results?search_query=cricket+bouncer+setup+bowling+plan" },
      { name: "Workload Management", duration: "30 min", frequency: "Daily", description: "Recovery drills, ice baths, and mobility work to sustain pace across a 5-day Test match", videoUrl: "https://www.youtube.com/results?search_query=fast+bowler+recovery+workload+management" },
    ],
  }},
  { id: "l25", name: "Babar Azam", country: "Pakistan", era: "2015–present", skills: ["Batting"], highlights: "Fab Four member, #1 across all formats, elegant stroke-maker", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Babar_azam_2023.jpg/200px-Babar_azam_2023.jpg", routines: {
    Batting: [
      { name: "On-Drive Mastery", duration: "30 min", frequency: "Daily", description: "Practice the wristy on-drive and flick through mid-wicket with perfect balance and timing", videoUrl: "https://www.youtube.com/results?search_query=babar+azam+on+drive+batting+technique" },
      { name: "All-Format Adaptability", duration: "45 min", frequency: "5x/week", description: "Switch between Test match defense, ODI anchoring, and T20 aggression in the same session", videoUrl: "https://www.youtube.com/results?search_query=babar+azam+batting+all+formats+versatile" },
      { name: "Pace & Spin Nets", duration: "40 min", frequency: "4x/week", description: "Alternate between pace and spin bowlers to build adaptability against different bowling types", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+against+pace+and+spin" },
    ],
  }},
  { id: "l26", name: "Joe Root", country: "England", era: "2012–present", skills: ["Batting"], highlights: "12,000+ Test runs, 30+ centuries, reverse sweep specialist", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Joe_Root_2015.jpg/200px-Joe_Root_2015.jpg", routines: {
    Batting: [
      { name: "Reverse Sweep Drill", duration: "25 min", frequency: "4x/week", description: "Practice reverse sweeps and switch hits against spin — use it as both scoring and pressure-release shot", videoUrl: "https://www.youtube.com/results?search_query=joe+root+reverse+sweep+batting+technique" },
      { name: "Scoring in All Conditions", duration: "45 min", frequency: "5x/week", description: "Practice on different surfaces — fast, slow, turning — to build adaptability for away tours", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+different+conditions+pitches" },
      { name: "Conversion Rate", duration: "40 min", frequency: "3x/week", description: "Simulate innings from 50* onwards — practice converting fifties into hundreds with disciplined shot selection", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+converting+50+to+100" },
    ],
  }},
  { id: "l27", name: "Ben Stokes", country: "England", era: "2011–present", skills: ["Batting", "Bowling"], highlights: "Headingley 135*, World Cup 2019 hero, fearless match-winner", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ben_Stokes_in_2019_%28cropped%29.jpg/200px-Ben_Stokes_in_2019_%28cropped%29.jpg", routines: {
    Batting: [
      { name: "Pressure Hitting", duration: "40 min", frequency: "5x/week", description: "Simulate match-winning scenarios — 30 off 20, 15 off 6 — practice calculated aggression under pressure", videoUrl: "https://www.youtube.com/results?search_query=ben+stokes+batting+pressure+match+winning" },
      { name: "Six-Hitting Drills", duration: "30 min", frequency: "4x/week", description: "Practice clearing the boundary against pace and spin — target specific zones", videoUrl: "https://www.youtube.com/results?search_query=cricket+six+hitting+power+hitting+drills" },
    ],
    Bowling: [
      { name: "Wicket-Taking Spells", duration: "30 min", frequency: "4x/week", description: "Practice bowling aggressive short spells of 4-5 overs at high intensity to break partnerships", videoUrl: "https://www.youtube.com/results?search_query=cricket+medium+fast+bowling+wicket+taking" },
      { name: "Reverse Swing at Pace", duration: "25 min", frequency: "3x/week", description: "Bowl with the old ball and generate reverse swing at 130-140 km/h", videoUrl: "https://www.youtube.com/results?search_query=cricket+reverse+swing+medium+fast+bowling" },
    ],
  }},
  { id: "l28", name: "Rashid Khan", country: "Afghanistan", era: "2015–present", skills: ["Bowling"], highlights: "Youngest Test captain, 500+ T20 wickets, leg-spin wizard", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Rashid_Khan_2021.jpg/200px-Rashid_Khan_2021.jpg", routines: {
    Bowling: [
      { name: "Rapid Leg-Spin", duration: "40 min", frequency: "Daily", description: "Bowl leg-breaks, googlies, and flippers at speed — minimize flight time to rush batsmen", videoUrl: "https://www.youtube.com/results?search_query=rashid+khan+leg+spin+bowling+technique" },
      { name: "Googly Disguise", duration: "30 min", frequency: "5x/week", description: "Practice bowling the googly with identical action to the leg-break — focus on wrist position", videoUrl: "https://www.youtube.com/results?search_query=cricket+googly+bowling+wrist+position+tutorial" },
      { name: "T20 Death Bowling", duration: "30 min", frequency: "4x/week", description: "Bowl in the death overs of T20s — practice wider lines, slower balls, and yorkers as a spinner", videoUrl: "https://www.youtube.com/results?search_query=cricket+spin+bowling+death+overs+t20" },
    ],
  }},
  { id: "l29", name: "Suryakumar Yadav", country: "India", era: "2021–present", skills: ["Batting"], highlights: "T20I #1 batter, 360-degree modern striker, 4 T20I centuries", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Suryakumar_Yadav_2023.jpg/200px-Suryakumar_Yadav_2023.jpg", routines: {
    Batting: [
      { name: "360° Shot Practice", duration: "40 min", frequency: "Daily", description: "Practice laps, scoops, reverse pulls, and switch hits — score in every zone of the ground", videoUrl: "https://www.youtube.com/results?search_query=suryakumar+yadav+360+batting+shots+tutorial" },
      { name: "Intent From Ball One", duration: "30 min", frequency: "5x/week", description: "Practice attacking the first ball of the innings — build the fearless T20 mentality", videoUrl: "https://www.youtube.com/results?search_query=t20+batting+aggressive+intent+powerplay" },
      { name: "Upper-Cut & Ramp", duration: "25 min", frequency: "4x/week", description: "Master the upper-cut over third man and ramp over the keeper against pace", videoUrl: "https://www.youtube.com/results?search_query=cricket+upper+cut+ramp+shot+technique" },
    ],
  }},
  { id: "l30", name: "Kagiso Rabada", country: "South Africa", era: "2014–present", skills: ["Bowling"], highlights: "300+ international wickets, aggressive fast bowler, ICC #1 ranked", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Kagiso_Rabada_2018_%28cropped%29.jpg/200px-Kagiso_Rabada_2018_%28cropped%29.jpg", routines: {
    Bowling: [
      { name: "Aggressive Pace Spells", duration: "40 min", frequency: "5x/week", description: "Bowl hostile 5-over spells at 145+ km/h — practice maintaining pace late in the day", videoUrl: "https://www.youtube.com/results?search_query=kagiso+rabada+fast+bowling+aggressive+spells" },
      { name: "Nip-Backer Delivery", duration: "30 min", frequency: "Daily", description: "Practice the ball that nips back into right-handers off the seam at pace — LBW weapon", videoUrl: "https://www.youtube.com/results?search_query=cricket+seam+bowling+nip+back+inswing" },
      { name: "Death Overs Execution", duration: "30 min", frequency: "4x/week", description: "Bowl yorkers and slower bouncers in the last 5 overs under scoreboard pressure", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+death+overs+t20" },
    ],
  }},
  { id: "l31", name: "Rishabh Pant", country: "India", era: "2017–present", skills: ["Wicket-Keeping", "Batting"], highlights: "Fearless keeper-batter, match-winning centuries in Aus & Eng, T20 destroyer", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Rishabh_Pant_%282%29.jpg/200px-Rishabh_Pant_%282%29.jpg", routines: {
    "Wicket-Keeping": [
      { name: "Standing Up to Pace", duration: "30 min", frequency: "Daily", description: "Practice keeping up to medium-fast bowlers — improve reflexes and quick stumping ability", videoUrl: "https://www.youtube.com/results?search_query=rishabh+pant+wicket+keeping+standing+up" },
      { name: "Athletic Keeping", duration: "25 min", frequency: "5x/week", description: "Diving catches, one-handed takes, and acrobatic dismissals to build spectacular keeping skills", videoUrl: "https://www.youtube.com/results?search_query=cricket+wicket+keeping+diving+athletic+drills" },
    ],
    Batting: [
      { name: "Fearless Counter-Attack", duration: "40 min", frequency: "5x/week", description: "Practice attacking in tough situations — score against the new ball, reverse sweep spinners in Tests", videoUrl: "https://www.youtube.com/results?search_query=rishabh+pant+counter+attacking+batting" },
      { name: "Reverse Sweep Mastery", duration: "25 min", frequency: "4x/week", description: "Practice reverse sweeps and switch hits against both pace and spin from a left-hand stance", videoUrl: "https://www.youtube.com/results?search_query=rishabh+pant+reverse+sweep+left+hand" },
    ],
  }},
  { id: "l32", name: "Steve Smith", country: "Australia", era: "2010–present", skills: ["Batting"], highlights: "9,000+ Test runs, 32 centuries, unorthodox genius with 60+ average", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Steve_Smith_%28cricketer%29_2.jpg/200px-Steve_Smith_%28cricketer%29_2.jpg", routines: {
    Batting: [
      { name: "Shuffling Trigger Move", duration: "30 min", frequency: "Daily", description: "Practice the signature shuffle across the stumps to get into position for leg-side scoring", videoUrl: "https://www.youtube.com/results?search_query=steve+smith+batting+trigger+movement+shuffle" },
      { name: "Leave & Defend", duration: "40 min", frequency: "5x/week", description: "Practice disciplined leaving outside off and solid defense to build marathon innings", videoUrl: "https://www.youtube.com/results?search_query=steve+smith+batting+defence+leave+technique" },
      { name: "Wristy Flicks", duration: "25 min", frequency: "4x/week", description: "Work the ball off the pads through mid-wicket and fine leg with wristy placement", videoUrl: "https://www.youtube.com/results?search_query=steve+smith+flick+leg+side+batting" },
    ],
  }},
  { id: "l33", name: "Shaheen Shah Afridi", country: "Pakistan", era: "2018–present", skills: ["Bowling"], highlights: "Left-arm fast, 100+ Test wickets, deadly with the new ball", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shaheen_Shah_Afridi_2022.jpg/200px-Shaheen_Shah_Afridi_2022.jpg", routines: {
    Bowling: [
      { name: "Left-Arm Angle Attack", duration: "40 min", frequency: "Daily", description: "Exploit the natural angle into right-handers — target the stumps and LBW zone consistently", videoUrl: "https://www.youtube.com/results?search_query=shaheen+afridi+left+arm+fast+bowling" },
      { name: "New Ball Swing", duration: "30 min", frequency: "5x/week", description: "Bowl with the new ball and generate late inswing to right-handers at 145+ km/h", videoUrl: "https://www.youtube.com/results?search_query=cricket+left+arm+fast+inswing+new+ball" },
      { name: "Powerplay Wickets", duration: "30 min", frequency: "4x/week", description: "Practice bowling in powerplay overs — mix full, short, and wide yorkers to take early wickets", videoUrl: "https://www.youtube.com/results?search_query=cricket+fast+bowling+powerplay+wickets" },
    ],
  }},
  { id: "l34", name: "Mitchell Starc", country: "Australia", era: "2010–present", skills: ["Bowling"], highlights: "Left-arm thunderbolt, World Cup specialist, 300+ Test wickets", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mitchell_Starc_bowling%2C_2021.jpg/200px-Mitchell_Starc_bowling%2C_2021.jpg", routines: {
    Bowling: [
      { name: "Inswing Yorker", duration: "40 min", frequency: "Daily", description: "Master the devastating inswinging yorker to right-handers — the signature World Cup delivery", videoUrl: "https://www.youtube.com/results?search_query=mitchell+starc+inswing+yorker+bowling" },
      { name: "Raw Pace Generation", duration: "35 min", frequency: "5x/week", description: "Full-effort deliveries at 150+ km/h — focus on run-up rhythm and explosive front-arm pull", videoUrl: "https://www.youtube.com/results?search_query=mitchell+starc+fast+bowling+pace+generation" },
      { name: "White Ball Mastery", duration: "30 min", frequency: "4x/week", description: "Practice bowling with the white ball — exploit swing in the first 10 and last 10 overs", videoUrl: "https://www.youtube.com/results?search_query=cricket+white+ball+swing+bowling+technique" },
    ],
  }},
  { id: "l35", name: "Travis Head", country: "Australia", era: "2018–present", skills: ["Batting"], highlights: "Ashes hero, World Cup final century, aggressive left-hand batter", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Travis_Head_2023.jpg/200px-Travis_Head_2023.jpg", routines: {
    Batting: [
      { name: "Counter-Attack Mode", duration: "40 min", frequency: "5x/week", description: "Practice attacking from the first ball — back yourself to hit boundaries when bowlers err in length", videoUrl: "https://www.youtube.com/results?search_query=travis+head+aggressive+batting+counter+attack" },
      { name: "Spin Domination", duration: "30 min", frequency: "4x/week", description: "Step out and hit spinners over the top — use the feet to convert good balls into scoring opportunities", videoUrl: "https://www.youtube.com/results?search_query=cricket+batting+against+spin+stepping+out" },
      { name: "Left-Hand Advantage", duration: "30 min", frequency: "Daily", description: "Exploit the left-hander's angle — cut, pull, and drive through the off-side gaps", videoUrl: "https://www.youtube.com/results?search_query=left+hand+batting+technique+cricket+drills" },
    ],
  }},
];

export const skillColors: Record<Skill, { bg: string; text: string; border: string }> = {
  Batting: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Bowling: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Fielding: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Wicket-Keeping": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};
