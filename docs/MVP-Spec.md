# Wordy Waters — MVP Specification

_Reflects approved game design decisions._

## Project Overview

Wordy Waters is a word-guessing game inspired by Battleship and Wordle.
Players hunt for words on a grid by clicking cells and reading
crossword-style clues, then guess the words.

**MVP Scope:** Single-player daily puzzle mode (like Wordle).

## Game Mechanics

### Core Loop

1. Player visits daily puzzle.
2. Sees a 5x5 grid (cells are hidden).
3. Clicks a cell to reveal it — costs 1 move.
4. If cell contains a word, get the first crossword clue for that word.
5. If cell is empty, the cell turns grey to signal that it's empty and to
   help narrow down the grid — costs 1 move.
6. Player guesses the word, or discovers more cells to earn more clues.
7. Correct guess = word revealed on board with letter-by-letter animation.
8. Wrong guess = 2 moves are subtracted from the player's remaining budget.
9. Move budget exhausted with discovered-but-unguessed words = Sudden
   Death: guess discovered words one at a time; correct guesses are free
   and let you continue, the first wrong guess ends the game.
10. Lose when Sudden Death ends (wrong guess, or no discovered words left
    to guess) with unguessed words remaining.
11. Guess all 4 words = win (during normal play or Sudden Death).

### Board Layout

- Grid: 5x5
- Words: 4 hardcoded words (MINT, PLAN, LEAD, BARK)
- Word Placement: Fixed for MVP testing
- No Overlaps: Words don't share cells

## Win / Lose Conditions

Move Budget System — replaces an earlier wrong-guess-counter design. All
actions cost moves. Wrong guesses cost extra. One unified number for the
player to track.

### Move Costs

| Action                         | Cost     |
| ------------------------------ | -------- |
| Click any cell (word or empty) | -1 move  |
| Correct guess                  | 0 moves  |
| Wrong guess                    | -2 moves |

### Score Ratings

Final score = total moves used. Lower is better.

| Moves       | Rating          |
| ----------- | --------------- |
| 1–6 moves   | Legendary       |
| 7–10 moves  | Sharp           |
| 11–14 moves | Solid           |
| 15–18 moves | Scraped Through |
| 19+ moves   | Barely Survived |

### Win

Guess all 4 words. Display: move count + score rating + countdown to next
puzzle.

### Sudden Death

Move budget exhausted (including overshoot below zero from a wrong-guess
penalty) with at least one discovered, unguessed word → the game enters
Sudden Death instead of ending. One guess at a time on discovered words;
correct = free, continue guessing; first wrong guess = immediate loss.
Winning via Sudden Death uses the normal score rating (full budget spent,
so it rates in the bottom tier). See GDD §8.3 for full rules and rationale.

Implementation note: game status needs an explicit phase (e.g.
`'playing' | 'sudden_death' | 'won' | 'lost'`) — loss is no longer a
pure `moves_used >= budget` check.

### Lose

Sudden Death ends with at least one word unguessed — via a wrong guess, or
by running out of discovered words to guess (including entering with none).
Display: words found vs total, moves used, invite to try again tomorrow.

## Daily Puzzle Rules

- Same puzzle for everyone: UTC midnight reset
- Once per day: backend enforces via session token
- No user accounts (MVP): session token stored in localStorage
- Win streak: tracked in localStorage

## Tech Stack

### Frontend

React + TypeScript

### Backend

- Node.js + Express
- TypeScript
- PostgreSQL 18
- ESModules

### Development Tools

- `tsx` (TypeScript execution)
- `nodemon` (auto-restart on changes)
- `dotenv` (environment variables)
- `cors` (cross-origin requests)

## Database Schema

### GAMES Table

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL,        -- 'playing' | 'sudden_death' | 'won' | 'lost'
  moves_used INTEGER DEFAULT 0,       -- total moves spent this session
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

| Field                         | Purpose                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `id`                          | Unique game identifier                                         |
| `status`                      | Know if game is active or finished                             |
| `moves_used`                  | Tracks total moves spent (display stat, used for score rating) |
| `created_at` / `completed_at` | Timestamps for analytics                                       |

### BOARDS Table

```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- For MVP daily: 1 board per game (player only).
- Later (multiplayer): add an `owner` field to distinguish player vs
  opponent boards.
- For now: keep simple, no `owner` field needed.

### WORDS Table

```sql
CREATE TABLE words (
  id UUID PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id),
  word VARCHAR(50) NOT NULL,
  length INTEGER NOT NULL,
  start_row INTEGER NOT NULL,
  start_col INTEGER NOT NULL,
  direction VARCHAR(20) NOT NULL,     -- 'horizontal' | 'vertical' | 'diagonal'
  is_guessed BOOLEAN DEFAULT FALSE,
  guessed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Field                     | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `id`                      | Unique word identifier                                         |
| `board_id`                | Link to board (query all words on this board)                  |
| `word`                    | The actual word (for validation when player guesses)           |
| `length`                  | Word length (for clue display)                                 |
| `start_row` / `start_col` | Starting position (for click validation)                       |
| `direction`               | Needed to validate which cells are part of the word            |
| `is_guessed`              | Fast win condition check (`COUNT(*) WHERE is_guessed = FALSE`) |
| `guessed_at`              | When it was solved (optional, for analytics)                   |

### CLUES Table

```sql
CREATE TABLE clues (
  id UUID PRIMARY KEY,
  word_id UUID NOT NULL REFERENCES words(id),
  clue_text VARCHAR(255) NOT NULL,    -- e.g., 'Fresh herb (4)'
  clue_order INTEGER NOT NULL,        -- 1, 2, 3 (hardest to easiest)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Field        | Purpose                                     |
| ------------ | ------------------------------------------- |
| `id`         | Unique clue identifier                      |
| `word_id`    | Link to word (query all clues for word X)   |
| `clue_text`  | The actual crossword clue with length hint  |
| `clue_order` | Order of clues — 1 is hardest, 3 is easiest |

Separate table from WORDS because: multiple clues per word, revealed one at
a time on player request.

## Hardcoded Test Board

```
[M][ ][ ][ ][B]
[I][P][ ][ ][A]
[N][ ][L][ ][R]
[T][ ][ ][A][K]
[L][E][A][D][N]
```

### Words

1. **MINT** — [0,0] vertical (down 4)
   Clues: "In perfect condition (4)", "Place that makes coins (4)", "Fresh
   herb (4)"
2. **PLAN** — [1,1] diagonal (4)
   Clues: "Drawing or blueprint (4)", "Strategy or scheme (4)", "To arrange
   in advance (4)"
3. **LEAD** — [4,0] horizontal (right 4)
   Clues: "Heavy metal (4)", "Leash for a dog (4)", "Go first (4)"
4. **BARK** — [0,4] vertical (down 4)
   Clues: "Sailing vessel (4)", "Dog's sound (4)", "Tree's outer layer (4)"

> Note: PLAN's direction is diagonal per the current board layout (GDD
> Section 10), which resolved an earlier overlap conflict with BARK. If this
> spec and the GDD ever disagree on a word's placement, the GDD is the
> source of truth — flag the discrepancy rather than guessing which is
> current.

## API Endpoints (Planned)

### Daily Mode

```
POST /api/daily/start
→ Returns today's puzzle (4 words, empty board state, starting move count = 0)

POST /api/daily/click-cell
Request:  { row, col }
Response: { wordId, clues[], cellAlreadyClicked, alreadyRevealed, wordLength }

POST /api/daily/guess
Request:  { wordId, guessedWord }
Response: { correct, revealedCells[], gameOver, winner, movesUsed, movesRemaining }

POST /api/daily/reset
→ Start fresh today (if player wants to retry)
```

## Future Phases (Not MVP)

### Phase 2: Multiplayer

- Add `owner` field to BOARDS (distinguish player vs opponent)
- Real-time updates with WebSockets
- Invite-based game creation
- Turn-based gameplay

### Phase 3: Leaderboards & Stats

- User accounts
- Game history
- Daily leaderboards
- Win streaks across days
- Share functionality

### Phase 4: Enhancements

- Variable difficulty (more/fewer words, larger grid)
- Hint system
- Themes/customization
- Animations and polish

## Key Design Decisions

### Why Separate Tables?

- BOARDS separate from GAMES: later with multiplayer, need 2 boards per game
- WORDS separate from BOARDS: query words by board efficiently, update
  guessed status independently
- CLUES separate from WORDS: multiple clues per word, player-triggered one
  at a time

### Why Moves Instead of a Wrong-Guess Counter?

A separate wrong-guess counter creates two systems the player must track
simultaneously. Merging all costs into a single move budget gives the
player one number to watch, and reframes wrong guesses as a strategic cost
rather than a hard punishment. Empty cells are no longer dead inputs — their
move cost creates meaningful tension in exploration.

### Why Store These Fields?

- `direction` in WORDS: needed to validate if clicked cell is part of word
- `start_row`/`start_col` in WORDS: needed for click validation
- `length` in WORDS: could calculate from word string, but clearer and
  useful for clues
- `is_guessed` in WORDS: fast win condition check
  (`COUNT(*) WHERE is_guessed = FALSE`)
- `moves_used` in GAMES: needed for score rating display on game completion

### Why NOT Store?

- `owner` in BOARDS (MVP): only 1 board per daily game, unnecessary until
  multiplayer
- `grid_size` in BOARDS: hardcoded as 5x5, can add later
- `opponent_score` in GAMES: daily is single player

## Development Notes

### Backend Architecture

Routes (entry point) → Controllers (validate, orchestrate) → Services
(business logic) → Models (database queries) → PostgreSQL

### Input Validation

- Validate in controllers (HTTP layer)
- Reusable validation functions in `utils/`
- Example checks: is row between 0–4? Is `wordId` a valid UUID?

### Security

- Input validation before any database query
- Session tokens prevent accidental replays
- Environment variables for secrets (`DATABASE_URL`, `PORT`)

### Testing Strategy (Future)

- Unit tests for services (move budget logic, win condition)
- Integration tests for controllers + services
- Test with Postman before building frontend

### Deployment (Future)

- Backend: Railway or Render
- Frontend: Vercel
- Database: managed PostgreSQL (Railway, Render, or Heroku Postgres)
- Same code, different `.env` files per environment
