# Wordy Waters

A daily word puzzle game blending Battleship-style grid exploration with
crossword-style word deduction. Players probe a hidden 5x5 grid using a limited
move budget, uncovering crossword-style clues by finding word cells on the
board.

MVP is single-player, daily puzzle mode — same puzzle for everyone, resets at
UTC midnight.

## Docs

- [Game Design Document](docs/GDD.md)
- [MVP Tech Spec](docs/MVP-Spec.md) (architecture, DB schema, API plan)

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, ESLint

**Backend (planned):** Node.js, Express, TypeScript, PostgreSQL

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start local dev server               |
| `npm run build`   | Production build                     |
| `npm run lint`    | Run ESLint                           |
| `npm run preview` | Preview the production build locally |
