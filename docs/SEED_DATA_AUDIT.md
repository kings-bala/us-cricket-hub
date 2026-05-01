# CricVerse360 — Seed/Demo Data Audit

**Date:** April 30, 2026  
**Auditor:** Devin (automated)  
**Scope:** All user-visible data on cricverse360.com

## Classification Key

| Status | Definition | Action |
|--------|-----------|--------|
| REAL+CONSENTED | Real entity with written consent on file | Keep |
| REAL+UNCONSENTED | Real entity, no agreement | Remove immediately |
| FABRICATED | Made-up data | Remove or mark as demo |
| CLEAN | Already fixed or not an issue | No action needed |

---

## 1. Coach Directory (`/coaches`)

| Item | Classification | Action |
|------|---------------|--------|
| Spin Masters Academy | FABRICATED (generic) | CLEAN — already genericized in PR #132. Keep as placeholder. |
| Pace Academy Australia | FABRICATED (generic) | CLEAN |
| Batting Foundations | FABRICATED (generic) | CLEAN |
| Swing & Seam Coaching | FABRICATED (generic) | CLEAN |
| AllRound Cricket Lab | FABRICATED (generic) | CLEAN |
| Cricket Analytics NZ | FABRICATED (generic) | CLEAN |
| Caribbean Youth Cricket | FABRICATED (generic) | CLEAN |
| Keeper & Captain Academy | FABRICATED (generic) | CLEAN |
| "X coaches available now" badge | FABRICATED claim | **Fix** — add "early access" framing |

**Note:** All original celebrity coach names (Anil Kumble, Brett Lee, AB de Villiers, etc.) were removed in PR #132. Current names are generic academy names with zeroed ratings/reviews. Acceptable as placeholder content.

---

## 2. Homepage (`/`)

| Item | Classification | Action |
|------|---------------|--------|
| Stats bar: "Gemini AI-Powered, Video, < 60s, Worldwide" | CLEAN | No action — already honest product descriptors |
| Academy trust bar: "Youth Academies, Club Players, School Teams..." | CLEAN | No action — generic audience labels |
| Testimonials → "How It Helps" feature cards | CLEAN | No action — already replaced in PR #132 |
| Anonymous quote: "I wish I had this when I was training..." | FABRICATED | **Remove** — unattributed quote implies a real user |
| Coach preview cards: "Batting Coach, 120+ sessions, 4.9 rating" | FABRICATED | **Fix** — remove fabricated session counts and ratings |

---

## 3. Pro Comparison (`/analyze/compare`)

| Item | Classification | Action |
|------|---------------|--------|
| Virat Kohli (batting benchmark) | REAL+UNCONSENTED | **Remove** — right of publicity risk |
| Steve Smith (batting benchmark) | REAL+UNCONSENTED | **Remove** |
| Joe Root (batting benchmark) | REAL+UNCONSENTED | **Remove** |
| Kane Williamson (batting benchmark) | REAL+UNCONSENTED | **Remove** |
| Jasprit Bumrah (bowling benchmark) | REAL+UNCONSENTED | **Remove** |
| Pat Cummins (bowling benchmark) | REAL+UNCONSENTED | **Remove** |
| Rashid Khan (bowling benchmark) | REAL+UNCONSENTED | **Remove** |
| Shaheen Afridi (bowling benchmark) | REAL+UNCONSENTED | **Remove** |
| Ravindra Jadeja (fielding benchmark) | REAL+UNCONSENTED | **Remove** |
| Glenn Maxwell (fielding benchmark) | REAL+UNCONSENTED | **Remove** |
| Ben Stokes (fielding benchmark) | REAL+UNCONSENTED | **Remove** |

**Action:** Replace all named players with generic benchmarks: "Elite Batsman Standard", "World-Class Pace", etc. Use score ranges instead of fabricated individual scores.

---

## 4. Agent Marketplace (`/agents`)

| Item | Classification | Action |
|------|---------------|--------|
| Agent — South Asia (CricVerse360 Partner Network) | FABRICATED (generic) | CLEAN — already genericized in PR #132 |
| Agent — Oceania | FABRICATED (generic) | CLEAN |
| Agent — Middle East & Africa | FABRICATED (generic) | CLEAN |
| Agent — Americas & Caribbean | FABRICATED (generic) | CLEAN |

**Note:** Original named agents (Raj Malhotra, Sarah Mitchell, etc.) removed in PR #132. Current entries are CricVerse360-branded placeholders with zero stats.

---

## 5. Sponsor Hub (`/sponsors`)

| Item | Classification | Action |
|------|---------------|--------|
| Current Sponsors section | CLEAN | Already empty array — shows "Sponsorship Slots Open" |
| Market stats ($30B+, 2.5B+ fans, 18-34 demo) | REAL (industry data) | Keep — these are publicly reported industry statistics |
| Available Sponsorships with prices ($30K-$75K) | FABRICATED | **Remove** — implies existing infrastructure. Replace with "Contact us" |

**Note:** TechVista Global, CricGear, Willow Sports were removed in PR #132.

---

## 6. Tournaments (mock data, used on `/sponsors`)

| Item | Classification | Action |
|------|---------------|--------|
| Asia Youth Showcase Series at Wankhede Stadium | FABRICATED event at REAL venue | **Remove** |
| Oceania U17 Championship at SCG | FABRICATED event at REAL venue | **Remove** |
| Caribbean Youth Premier League at Queen's Park Oval | FABRICATED event at REAL venue | **Remove** |
| ICC U19 World Cup Qualifier | FABRICATED — implies ICC partnership | **Remove** |
| All 8 tournament entries | FABRICATED | **Remove** — empty the array |

---

## 7. Leaderboard (`/leaderboard`)

| Item | Classification | Action |
|------|---------------|--------|
| LEADERBOARD_DATA | CLEAN | Already empty array — shows "No Rankings Yet" |
| ALL_TIME_DATA | CLEAN | Already empty |
| Homepage leaderboard podium | CLEAN | Already shows "Could be you" placeholders |

---

## 8. Player Profiles (mock data)

| Item | Classification | Action |
|------|---------------|--------|
| Arjun Patel (p1) — fabricated Indian U17 batsman | FABRICATED | **Remove** |
| Jake Thompson (p2) — fabricated Australian U19 bowler | FABRICATED | **Remove** |
| Rashid Mohammed (p3) — fabricated Pakistani U17 all-rounder | FABRICATED | **Remove** |
| Kieron Baptiste (p4) — fabricated WI U19 WK | FABRICATED | **Remove** |
| All 15 player entries | FABRICATED | **Remove** — empty the array |

**Note:** These are generic/common names, not celebrities, but the detailed fabricated stats (match records, achievements, fitness data) present them as real players. Used on ~12 public pages.

**Affected public pages:** `/scouting`, `/community`, `/stats`, `/rankings`, `/selector`, `/squad-builder`, `/strategy`, `/compare`, `/combine`, `/form-meter`, `/performance-feed`, `/feed`, `/agents`

---

## 9. T20 Teams (mock data)

| Item | Classification | Action |
|------|---------------|--------|
| Mumbai Indians (owner: Ambani Group) | REAL+UNCONSENTED | **Remove** |
| Sydney Sixers (owner: Cricket NSW) | REAL+UNCONSENTED | **Remove** |
| Lahore Qalandars (owner: Fawad Rana) | REAL+UNCONSENTED | **Remove** |
| Trinbago Knight Riders (owner: Shah Rukh Khan) | REAL+UNCONSENTED | **Remove** |
| All 10 teams | REAL+UNCONSENTED | **Remove** — empty the array |

**Used on:** `/scouting` (public page)

---

## 10. Legends / Idol Capture (`/idol-capture`)

| Item | Classification | Action |
|------|---------------|--------|
| Sachin Tendulkar — training routines | REAL+UNCONSENTED | **Add disclaimer** — educational reference with public YouTube links |
| All legends entries | REAL+UNCONSENTED | **Add disclaimer** — not endorsement, educational content |

**Note:** This is educational/reference content with links to public YouTube videos showing training techniques. These are not endorsements or partnerships. Similar to a textbook referencing public figures. A strong disclaimer is sufficient.

---

## 11. Scoring Page (`/scoring`)

| Item | Classification | Action |
|------|---------------|--------|
| Sample team A players (Arjun Patel, Rahul Desai, etc.) | FABRICATED (generic names) | **Fix** — replace with obviously placeholder names (Player 1, Player 2) |
| Sample team B players (Jake Thompson, Oliver Hughes, etc.) | FABRICATED (generic names) | **Fix** |

---

## 12. Homepage Coach Preview Cards

| Item | Classification | Action |
|------|---------------|--------|
| "Batting Coach, Mumbai, 120+ sessions, 4.9" | FABRICATED stats | **Fix** — remove session counts and ratings |
| "Bowling Coach, Sydney, 95+ sessions, 4.8" | FABRICATED stats | **Fix** |
| "All-Round Coach, London, 80+ sessions, 4.7" | FABRICATED stats | **Fix** |
| "Fielding Coach, Cape Town, 60+ sessions, 4.9" | FABRICATED stats | **Fix** |

---

## Summary of Actions

| Action | Count | Priority |
|--------|-------|----------|
| Remove (REAL+UNCONSENTED named people) | 11 pro cricketers + 10 teams | HIGH |
| Remove (FABRICATED data arrays) | players, tournaments, sponsorships | HIGH |
| Fix (fabricated stats/claims) | coach cards, scoring names, quote | MEDIUM |
| Add disclaimer (educational reference) | legends/idol-capture | MEDIUM |
| Already clean (no action) | 7 sections | — |

## Previously Cleaned (PR #132)

For reference, these items were already addressed:
- Celebrity coach names → generic academy names
- Named agents → regional CricVerse360 placeholders  
- Named sponsors → empty array
- Homepage testimonials → feature cards
- Homepage stats → product descriptors
- Academy logos → audience labels
- Leaderboard → empty
