# MCC Master — Complete Project Document

## Overview
MCC Master is a Google Apps Script web app for 5 friends (Tony, Roxanna, Soroosh, Amin, Noha) studying for the MCCQE Part I exam. Built as a Duolingo-style study platform with AI-powered patient simulations.

---

## Access & Credentials

| Item | Value |
|------|-------|
| **App URL** | `https://script.google.com/macros/s/AKfycbwiWFvnhP4nEHzHnNXIJoap33tEs_RAJLWYn3RJwRcKGzQJG5kI3eBWk139V0sfhHT6/exec` |
| **Deployment ID** | `AKfycbwiWFvnhP4nEHzHnNXIJoap33tEs_RAJLWYn3RJwRcKGzQJG5kI3eBWk139V0sfhHT6` |
| **Google Sheets ID** | `1dqlfIfqzRA4pgLa1NocrlT2iyiJuQBN9Tauy1xLVsvo` |
| **Drive Images Folder** | `1l96pRrZhTWc8duzvxCyHptkDXBEM7a73` |
| **GitHub Repo** | `https://github.com/anthonymishriki1-ops/mcc-master` (private) |
| **Local Code Path** | `C:\Users\antho\Desktop\MCC\gas_app\` |
| **Anthropic API Key** | Stored in GAS Script Properties as `ANTHROPIC_API_KEY` |
| **Current Version** | v108 |

---

## Architecture

### Tech Stack
- **Backend:** Google Apps Script (Code.gs) — ~2000+ lines
- **Frontend:** SPA in HTML/JS/CSS (App.html, Index.html, Styles.html)
- **Database:** Google Sheets (SpreadsheetApp)
- **AI:** Anthropic Claude API via UrlFetchApp
  - Haiku (claude-haiku-4-5-20251001) — PatientBot conversations
  - Sonnet (claude-sonnet-4-20250514) — scoring, glossary, condensing
- **Caching:** CacheService (2hr TTL for PatientBot cases)
- **Client Storage:** localStorage for progress, preferences, page state
- **Deployment:** clasp CLI for push/deploy

### File Structure
```
gas_app/
├── Code.gs          — All server-side logic (~2000+ lines)
├── App.html         — All client-side JavaScript (~2900+ lines)
├── Index.html       — HTML shell, sidebar, bottom nav (~250 lines)
├── Styles.html      — All CSS (~1400+ lines)
├── appsscript.json  — GAS manifest (ANYONE_ANONYMOUS access)
└── .clasp.json      — clasp project config
```

### Google Sheets Tabs
- **Flashcards** — ~10K cards (Specialty, Topic, Front, Back, HY_Flag)
- **MCQ** — ~354 multiple choice questions
- **Bullet_Notes** — study notes by specialty/topic
- **Dont_Miss** — 7K "don't miss" items (needs condensing)
- **Key_Topics_Condensed** — condensed version (may be empty, needs running)
- **UserData** — all user activity tracking
- **Medical_Glossary** — 373 terms with definitions + Persian translations (may need running)
- **Diagrams** — image metadata

---

## Features (Completed)

### Core Study Features
1. **Flashcards** — 10K cards with seeded shuffle (consistent order across users), Got It/Wrong rating, progress saves to localStorage, daily goal meter (100/day), back button, specialty filter, High Yield filter
2. **Practice Quiz** — MCQ with specialty/version filter, wrong answer review in history, data quality filter (skips broken questions), keyboard shortcuts
3. **Daily Challenge** — 3-phase flow (20 flashcards → 10 MCQs → 2 PatientBot cases), seeded daily (same content for all users), streak tracking
4. **Key Topics** — grouped by specialty, collapsible sections, priority filters (Must Know/Should Know/Good to Know), quiz mode
5. **Bullet Notes** — organized by specialty/topic, collapsible, searchable
6. **Diagrams** — image gallery from Drive folder

### AI Features
7. **PatientBot** — AI patient simulator with:
   - 115 MCC Clinical Presentations as case source
   - Customizable patient (sex, gender/identity, age, historian quality, cooperativeness, aggression via sliders)
   - Action quick-picks (Exam, Labs, Imaging, Meds, Procedures, Cardiac, Resus, Position, Scopes, Manage)
   - Clinical engine evaluates actions, returns test results
   - OSCE-style scorecard at end of case
   - Partial credit diagnosis scoring
   - Patient can die from dangerous actions
   - Cheat mode (shows diagnosis in banner)
   - Multiple difficulty levels (Easy, Medium/MCCQE-style, Hard, Expert)
   - Case library (review past cases)
8. **Dr. Data** — AI-powered medical Q&A
9. **Search** — searches across all content

### Gamification
10. **Skill Map Dashboard** — mastery % per specialty, visual skill tree
11. **XP/Leveling** — Medical Student(0) → Intern(500) → Resident(2000) → Fellow(5000) → Attending(10000) → Chief(25000)
12. **Streaks** — daily study streaks tracked
13. **Achievements** — ~19 milestones (Card Shark, Quiz Pro, House MD, etc.)
14. **Leaderboard** — compare with friends

### UX
15. **Profile System** — 5 preset users (Tony, Roxanna, Soroosh, Amin, Noha) + 4-digit PIN
16. **Guest Mode** — anyone can access without login
17. **Tutorial** — skippable first-time walkthrough
18. **Version Banner** — shows what's new on each update
19. **Dark Mode** — full dark theme support
20. **Bottom Nav** — mobile tab bar (Home, Study, Practice, PatientBot, More)
21. **Grouped Sidebar** — Study, Practice, Tools, You sections
22. **Page Persistence** — remembers last page on refresh
23. **Quiz Progress Save** — survives page refreshes (localStorage)
24. **Medical Glossary** — 373 terms with definitions, Persian translations, categories
25. **Language Selector** — Arabic/Persian translation support in sidebar
26. **Dev Panel** — admin view showing all users, activity stats

### Points System
| Action | XP |
|--------|-----|
| Flashcard Right | 3 |
| Flashcard Wrong | 1 |
| Quiz MCQ Correct | 10 |
| Quiz Perfect Bonus | 25 |
| PatientBot Correct Diagnosis | 20 |
| PatientBot First-Try Bonus | 10 |
| Daily Challenge Complete | 50 |

---

## Pending Work / Known Bugs

### Critical
1. **PatientBot contradictions** — patient identity in vitals bar sometimes doesn't match dialogue. Ground truth (name, age, sex, diagnosis) needs stronger injection into system prompt
2. **Patient interprets own results** — patient shouldn't say "looks like my WBC is high." Results should be delivered as system messages only
3. **Diagnosis reveal on wrong attempt** — currently shows what's missing then gives another try. Should either end case OR give vague "keep investigating" without revealing answer
4. **Action blocking too aggressive** — remove "inappropriate action" walls. Let students do anything, judge via OSCE scorecard at end
5. **"results" role API error** — test results pushed with role:'results' into chat history, Claude API only accepts 'user'/'assistant'

### Important
6. **OSCE scorecard not scrollable** — CSS overflow fix needed
7. **Diagnosis synonym matching** — "heart attack" should match "MI" / "myocardial infarction"
8. **Second attempt scoring broken** — code fix needed
9. **Patient answers every question with a question** — too excessive, needs prompt fix
10. **Names not diverse enough** — expanded name pool but AI still defaults to same favorites

### Data
11. **Dont_Miss sheet may be empty** — condensing function (condenseDontMiss) exists in Code.gs but may not have run successfully
12. **buildGlossary** — exists in Code.gs, needs to be triggered from GAS Script Editor
13. **Sheets API not enabled** on Google Cloud project 1072944905499 — blocks external scripts from reading/writing sheets
14. **MCQ data quality** — some questions have missing stems, N/A options, wrong answer keys

### Features to Build
15. **Timer + pre-reading phase** — exam realism for PatientBot
16. **CDM practice mode** — MCCQE Part I Section 2 format (case vignette → sequential questions)
17. **Toronto Notes ebook viewer** — PDF at C:\Users\antho\Desktop\MCC\Toronto Notes 2025.pdf (423MB), needs upload to Drive + in-app reader
18. **Glossary browsable page** — 373 terms generated, needs dedicated UI page with search/filter
19. **Online challenge mode** — challenge a friend to quick 5-question quiz
20. **"Who's online" indicator** — show active users
21. **Desktop font scaling** — mobile and desktop share same font size
22. **Proper dark mode refinement** — some elements still have hardcoded colors

---

## MCCQE Part I Exam Format

### Exam Day
- Fully computer-based at Prometric test center
- One day, ~9 hours total
- **Section 1: MCQs** — ~210 questions, 4 hours
- **Section 2: CDM (Clinical Decision Making)** — ~36 short cases with ~6-8 questions each, 4 hours
- Score: 300-600 scale, pass ~439

### Content Weights
- Internal Medicine ~25%
- Surgery ~15%
- Pediatrics ~12%
- OB/GYN ~10%
- Psychiatry ~10%
- Family Medicine/Preventive ~10%
- Remaining specialties ~18%

### 115 MCC Clinical Presentations
The exam tests based on clinical presentations (symptoms), not diagnoses. PatientBot is built around these presentations.

---

## Commands Reference

### Deploy
```bash
cd C:\Users\antho\Desktop\MCC\gas_app
clasp push --force
clasp deploy --deploymentId AKfycbwiWFvnhP4nEHzHnNXIJoap33tEs_RAJLWYn3RJwRcKGzQJG5kI3eBWk139V0sfhHT6 --description "vXX: description"
```

### Git
```bash
cd C:\Users\antho\Desktop\MCC
git add gas_app/
git commit -m "description"
git push origin master
```

### Run GAS Functions (from Script Editor)
- Open https://script.google.com → find MCC project
- Run `buildGlossary()` — generates medical glossary
- Run `condenseDontMiss()` — condenses 7K items to ~300 concept cards

---

## User Profiles
| Name | Role |
|------|------|
| Tony (anthony.mishriki1@gmail.com) | Dev/Admin |
| Roxanna | Student |
| Soroosh | Student |
| Amin | Student |
| Noha | Student |

All users are Persian — app includes Arabic/Persian language selector and medical term translations.

---

## Cost Tracking
- **Anthropic API:** PatientBot uses Haiku (~$0.001/message), scoring uses Sonnet (~$0.01/score)
- **Glossary generation:** ~$1-2 (one-time)
- **Key Topics condensing:** ~$1-2 (one-time)
- **Data quality audit:** ~$5-8 with Sonnet (recommended)
- **Monthly estimate:** ~$5-10 for 5 active users

---

## Session History Summary
This project was built over multiple extended sessions. Key milestones:
1. Initial pipeline: PDF → OCR → Google Sheets (flashcards, MCQs, notes, key topics)
2. GAS web app with SPA architecture
3. PatientBot with Claude AI integration
4. Gamification (XP, levels, streaks, achievements, leaderboard)
5. UI overhaul (Duolingo-style, skill map, bottom nav, dark mode)
6. Profile system with PIN auth
7. Medical glossary with Persian translations
8. OSCE-style scorecard for PatientBot
9. Action quick-picks and clinical engine
10. Data quality improvements and bug fixes
