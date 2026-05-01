# CricVerse360 — Data & Content Policy

**Effective:** April 30, 2026  
**Scope:** All content displayed on cricverse360.com and in the us-cricket-hub repository

---

## Rule 1: No Real Named Persons Without Written Consent

No real person's name, likeness, photograph, statistics, or quotes may appear on the production site unless:

1. **Written consent is on file** in `/docs/legal/consents/` (signed agreement, email confirmation, or equivalent)
2. **The usage is clearly educational/reference** (e.g., linking to public YouTube videos for training guidance, citing publicly available cricket statistics in an educational context)

### What Requires Consent
- Using a person's name as a product endorsement or testimonial
- Displaying a person's name in a leaderboard, coach directory, agent listing, or player profile
- Using a person's name or likeness in marketing materials, screenshots, or advertisements
- Presenting fabricated data (scores, statistics, quotes) attributed to a real person

### What Does NOT Require Consent (Fair Use / Educational Reference)
- Linking to publicly available YouTube videos of training techniques
- Referencing publicly known facts about cricketers in an educational context
- Displaying real team/league names where the use is purely informational (e.g., a dropdown to select "IPL" as a league)

**When in doubt, remove first and seek consent later.**

---

## Rule 2: No Fabricated Statistics Presented as Real

All statistics, metrics, and data points displayed on the site must be either:

1. **Real and verifiable** — derived from actual platform usage data with documented methodology
2. **Clearly labeled as examples** — using obvious placeholder labels (e.g., "Example Score", "Sample Data")
3. **Omitted** — replaced with an empty state ("No data yet", "Coming soon") until real data exists

### Prohibited
- "500+ Videos Analyzed" when the actual count is different
- "23% Average Improvement" without a documented calculation methodology
- Star ratings or review counts that don't correspond to real reviews
- Session counts, player counts, or coach counts that don't match the database

---

## Rule 3: No Fabricated Partnerships or Endorsements

The site must not imply partnerships, sponsorships, or endorsements that don't exist:

- No fake sponsor logos or names
- No fabricated academy partnerships (e.g., "Trusted by MRF Pace Foundation")
- No implied affiliations with cricket boards (BCCI, ICC, ECB, etc.) unless a real agreement exists
- No fabricated agent or agency listings

---

## Rule 4: Empty States Must Look Intentional

When a section has no real data, it must display a well-designed empty state, not a blank page. Empty states should:

- Explain what will appear there (e.g., "Player rankings will appear here as users upload videos")
- Include a call-to-action (e.g., "Be the first — Upload Your Video")
- Not use language that implies the feature is broken

---

## Rule 5: Consent Record Keeping

All consent records should be stored in `/docs/legal/consents/` with:

- Entity/person name
- Date of consent
- Scope of consent (what they agreed to)
- Contact who obtained consent
- Copy of the agreement or email confirmation

---

## Audit Trail

| Date | Action | Reference |
|------|--------|-----------|
| 2026-04-30 | Initial audit and cleanup | `docs/SEED_DATA_AUDIT.md` |
| 2026-04-30 | Removed all fabricated player data | PR (this commit) |
| 2026-04-30 | Removed real T20 team names without consent | PR (this commit) |
| 2026-04-30 | Replaced named pro cricketers with generic benchmarks | PR (this commit) |
| 2026-04-30 | Added educational disclaimer to Idol Capture (legends) | PR (this commit) |
