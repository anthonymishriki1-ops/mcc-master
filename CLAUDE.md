# CLAUDE.md — Project Instructions for Claude Code

## Project Overview
MCC Master is an MCCQE Part I practice app. Frontend is a single-page app (`docs/index.html`) served via GitHub Pages. Backend is Google Apps Script (`gas_app/`) using Google Sheets as the database.

## Deployment Pipeline

### GitHub Pages (Frontend) — Fully Automatic
1. Push changes to a `claude/` branch — that's it
2. `auto-pr.yml` automatically creates a PR from the branch to `master`
3. `auto-merge.yml` automatically merges the PR within seconds
4. `static.yml` deploys to GitHub Pages on push to `master`
5. **The entire pipeline is automatic** — just push to a `claude/` branch and the site updates within ~1 minute
6. **Do NOT tell the user to merge, create PRs, or do anything** — it's all automated

### Google Apps Script (Backend)
- Backend code lives in `gas_app/` and is synced via `clasp`
- Spreadsheet ID: `1dqlfIfqzRA4pgLa1NocrlT2iyiJuQBN9Tauy1xLVsvo`
- Script ID: `1L5WA_r47VcdVoYTWbGqVyTMO5y-K97-da0Ix6RFDzjxJhuOr5tVIrMsJ`
- `clasp` may not be authenticated — if `clasp push` fails with "No credentials found", tell the user to run `clasp login` first
- **Prefer client-side patches in `docs/index.html`** (via `patchApiResult_()`) over backend changes to avoid requiring Apps Script redeployment

## Architecture

### Frontend (`docs/index.html`)
- Single HTML file with embedded CSS and JS (no build step)
- `serverCall(funcName, ...args)` makes GET requests to the GAS API
- `patchApiResult_(fn, result)` intercepts API responses for client-side content fixes
- Login uses `sessionStorage` (clears on tab close) — login screen doubles as a preloading gate
- `localStorage` stores persistent data: saved name (`mcc_last_name`, `mcc_last_display`), settings, flashcard progress
- Dev mode enabled for users in `DEV_USERS` array (currently: `['tony']`)

### Backend (`gas_app/Code.gs`)
- `doGet(e)` handles API calls — allowed functions are whitelisted
- `profile` from the frontend payload is auto-injected as `guestId` for functions that need it
- Data sheets: `MCQ`, `Flashcards`, `Bullet_Notes`, `Dont_Miss`, `Medical_Glossary`, `UserData`, etc.
- User data (quiz results, progress, flags) stored in `UserData` sheet via `ensureUserDataSheet_()`

### Key Features
- **Flashcards**: 10K+ cards, progress saves per-profile, shareable card links (`?fc=N&spec=X`)
- **Practice Quiz**: MCQ with 5 options, client-side stub filter rejects questions < 150 chars
- **PatientBot**: AI clinical simulator with consequence engine, vitals monitor, OSCE scoring
- **Flag system**: Users can flag content issues on flashcards/quiz/notes/PatientBot — saved as `content_flag` in UserData sheet
- **Late-night nudge**: AI-powered witty popups at 3h/4h/6h between 11pm-4am
- **Desktop clock**: Top-right widget with alarm (hidden on mobile)

## Content Data
- Quiz questions, flashcards, and notes live in Google Sheets, NOT in code
- For content fixes, prefer client-side patches in `patchApiResult_()` to avoid redeployment
- The `content_flag` system lets users report issues — flags are in the UserData sheet

## Branch Naming
- Always use `claude/` prefix for branches (required for auto-merge)
- Format: `claude/<descriptive-name>-<sessionId>`
