# Wordy Waters — Game Design Document

## MVP — Daily Puzzle Mode

## 1. Overview

Wordy Waters is a single-player daily word puzzle game that blends
Battleship-style exploration with Wordle-style word deduction. Players probe
a hidden 5x5 grid using a limited move budget, and discover crossword-style
clues by finding word cells on the board.

The game resets daily at UTC midnight, with every player seeing the same
puzzle — making it shareable and community-driven from day one.

## 2. Core Game Loop

Each daily session follows this sequence:

- Player visits the daily puzzle and sees a fully hidden 5x5 grid.
- Player clicks any cell, spending 1 move.
- If the cell is part of a word: the cell becomes "discovered" and the clue
  panel opens showing all clues earned so far for that word.
- If the cell is empty: nothing happens other than the cell is marked grey
  signaling that it's empty.
- Each new cell of a word the player discovers reveals the next clue for
  that word. Clue 1 is unlocked on the first cell found, Clue 2 on the
  second, Clue 3 on the third.
- Re-clicking an already-discovered cell costs no moves — it simply reopens
  the clue panel.
- Player attempts a guess from the clue panel at any time.
- A correct guess reveals the full word on the board with a
  letter-by-letter animation.
- A wrong guess costs 2 additional moves. The discovered cells remain
  visible so the player remembers they already guessed there.
- Guess all 4 words to win. Running out of moves triggers Sudden Death
  (Section 8.3): one-at-a-time guesses on discovered words, where the first
  wrong guess — or running out of discovered words — ends the game.

## 3. Move Budget System

The move budget is the game's core tension mechanic. Every action costs
moves. The player starts with a fixed budget and must balance exploration,
clue gathering, and guessing efficiency.

### 3.1 Move Costs

| Action                                | Move Cost     | Notes                                               |
| ------------------------------------- | ------------- | --------------------------------------------------- |
| Click any hidden cell (word or empty) | 1 move        | Core exploration action                             |
| Re-click an already-discovered cell   | 0 moves       | Reopens clue panel, no cost                         |
| Guess a word — correct                | +0 additional | No penalty; move already spent clicking             |
| Guess a word — wrong                  | +2 additional | Meaningful but not punishing; cell stays discovered |

Note: There is no "Next Clue" button. Additional clues are earned by
discovering more cells of a word on the board, not by spending moves in the
clue panel.

### 3.2 Score Ratings

Final score is the number of moves used. Lower is better. The target "par"
is 10 moves — achievable with good strategy but not trivial.

| Moves Used | Rating             | Description                                                             |
| ---------- | ------------------ | ----------------------------------------------------------------------- |
| 1–6        | 🌟 Legendary       | Near-perfect run. Guessed on first clue, minimal exploration.           |
| 7–10       | ✅ Sharp           | Efficient play. A couple of exploration moves before confident guesses. |
| 11–14      | 👍 Solid           | Average. Needed 2–3 clues per word, some empty cell exploration.        |
| 15–18      | 😅 Scraped Through | Lots of exploration or a few wrong guesses.                             |
| 19+        | 😬 Barely Survived | Significant wrong guesses or heavy grid exploration.                    |

### 3.3 Design Rationale

Merging wrong-guess penalties into the same move budget (rather than a
separate counter) achieves two things: it gives the player one clean number
to track at all times, and it reframes wrong guesses as a strategic cost
rather than a harsh punishment. A player who guesses wrong doesn't feel
punished arbitrarily — they simply used more moves than planned.

## 4. Cell States

Every cell on the board is always in one of four states:

| State        | Description                                                 | Visual                                                          |
| ------------ | ----------------------------------------------------------- | --------------------------------------------------------------- |
| `hidden`     | Not yet clicked. Default state for all cells at game start. | Dark blue, no information shown                                 |
| `discovered` | Clicked and contains part of a word. Clue panel opens.      | Highlighted color — word is known to be here but not yet solved |
| `revealed`   | The word was correctly guessed. Letters shown on board.     | Bright accent color with letter visible                         |
| `empty`      | Clicked and contains no word                                | Grey — explored but empty                                       |

## 6. Clue System

Each hidden word has three crossword-style clues ordered from hardest to
easiest. Clues are unlocked by discovering cells of the word on the board —
there is no button to reveal them. This ties clue progression directly to
spatial exploration, making the Battleship and crossword elements work
together rather than independently.

### 6.1 Clue Reveal Flow

- Clicking the 1st cell of a word (any cell) reveals Clue 1 (hardest). Costs
  1 move.
- Clicking a 2nd cell of the same word reveals Clue 2. Costs 1 move.
- Clicking a 3rd cell of the same word reveals Clue 3 (easiest). Costs 1 move.
- Re-clicking an already-discovered cell costs no moves and reopens the clue
  panel.
- The clue panel always shows all clues earned so far for the active word.
- Player can attempt a guess at any time from the clue panel.

### 6.2 Clue Design Guidelines

Clues should follow a consistent difficulty curve per word. A good set moves
from abstract/tricky to concrete/obvious:

| Clue Order | Style                    | Example (MINT)               |
| ---------- | ------------------------ | ---------------------------- |
| Clue 1     | Cryptic or abstract      | "In perfect condition (4)"   |
| Clue 2     | Domain-specific          | "Place that makes coins (4)" |
| Clue 3     | Common / straightforward | "Fresh herb (4)"             |

### 6.3 The Core Decision

The tension in the clue system is: "I think I know this word after finding
one cell — do I guess now and risk a 2-move penalty, or explore more cells
of the word to earn safer clues?" Each additional cell discovered costs a
move but unlocks another clue. This creates genuine spatial risk/reward: the
player must decide whether to guess with limited information or spend moves
searching the grid.

## 7. Letter Scaffolding (Correct Guess Animation)

When a player correctly guesses a word, the letters are revealed on the
board one by one in sequence, with a brief delay between each.

### 7.1 Behavior

- Letters animate onto the grid in order (first letter to last), taking
  approximately 600–800ms total.
- Each letter cell lights up as it appears, using the word's highlight
  color.
- A short sound cue (optional, future phase) punctuates the final letter
  landing.
- The clue panel closes automatically after the animation completes.

### 7.2 Design Rationale

In game design, the principle of "juicy feedback" holds that satisfying
micro-animations reinforce player actions and make them feel consequential.
A correct guess is the most positive event in the game — it deserves more
than a silent state change. Letter scaffolding gives the player a moment of
celebration without slowing the game down.

## 8. Win / Loss Conditions

### 8.1 Win

The player wins by guessing all 4 words before their move budget is
exhausted. On win, the screen displays:

- Final move count
- Score rating (Legendary / Sharp / Solid / etc.)
- Shareable emoji grid of the session (see Section 9)
- Countdown to next daily puzzle

### 8.2 Loss

Exhausting the move budget no longer loses immediately — it triggers Sudden
Death (Section 8.3). The player loses when:

- They guess wrong during Sudden Death, or
- Sudden Death begins (or runs out of guessable words) with at least one
  word unguessed and no discovered, unguessed words left to attempt.

On loss, the board is fully revealed and the player sees which words they
missed. The screen displays:

- Words found vs. total (e.g. "2 of 4 words found")
- Moves used
- Invite to try again tomorrow

### 8.3 Sudden Death

When moves remaining reaches zero (or overshoots below zero via a
wrong-guess penalty — overshooting does not skip Sudden Death) and at least
one discovered word remains unguessed, the game enters Sudden Death instead
of ending:

- The player may guess any discovered-but-unguessed word, one at a time.
- A correct guess costs nothing — the player continues and may guess the
  next discovered word.
- The first wrong guess ends the game immediately as a loss.
- If no discovered, unguessed words remain and not all words are guessed,
  the game ends as a loss.
- Guessing all remaining words in Sudden Death is a win. It uses the normal
  score rating — by definition the full budget was spent, so these wins
  naturally rate at the bottom tier.

**Design rationale:** clues the player earned through exploration stay
usable — the game never ends while the player holds paid-for information
they were forbidden to act on ("every action returns meaningful
information"). It also creates a clutch, shareable endgame beat. The
hoarding strategy (explore everything, guess nothing until Sudden Death) is
self-limited: confident guesses are already free mid-game, Sudden Death is
a no-miss gauntlet, and score = moves used, so hoarded wins always rate
"Barely Survived."

**Playtest watch item:** if streak-focused players make
"hoard exploration, quiz at the end" the dominant strategy, the fallback
nerf is capping Sudden Death at one guess total (player picks the word).

## 10. Board Specification (MVP)

The MVP uses a single hardcoded puzzle for testing. All production puzzles
will follow this layout structure.

Note: The board was redesigned to resolve a cell conflict in the original
spec. PLAN runs diagonally to eliminate the overlap with BARK at cell
`[1,4]`.

### 10.1 Grid

|       | Col 0 | Col 1 | Col 2 | Col 3 | Col 4 |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Row 0 | M     | —     | —     | —     | B     |
| Row 1 | I     | P     | —     | —     | A     |
| Row 2 | N     | —     | L     | —     | R     |
| Row 3 | T     | —     | —     | A     | K     |
| Row 4 | L     | E     | A     | D     | N     |

### 10.2 Words & Clues

| Word | Start | Direction  | Clue 1                   | Clue 2                     | Clue 3                    |
| ---- | ----- | ---------- | ------------------------ | -------------------------- | ------------------------- |
| MINT | [0,0] | Vertical   | In perfect condition (4) | Place that makes coins (4) | Fresh herb (4)            |
| PLAN | [1,1] | Diagonal   | Drawing or blueprint (4) | Strategy or scheme (4)     | To arrange in advance (4) |
| LEAD | [4,0] | Horizontal | Heavy metal (4)          | Leash for a dog (4)        | Go first (4)              |
| BARK | [0,4] | Vertical   | Sailing vessel (4)       | Dog's sound (4)            | Tree's outer layer (4)    |

## 11. Frontend State Design

This section documents the agreed TypeScript state shape for the frontend
implementation.

### 11.1 Cell & Word State Types

- `CellState` — four possible values: `hidden | discovered | revealed | empty`
- `WordState` — tracks only what cannot be derived: `{ isGuessedCorrectly: boolean }`
- Clues revealed per word is derived (not stored) by counting how many of
  that word's cells are in `discovered` state.

### 11.2 GameState Shape

- `cellStates: CellState[][]` — 5x5 nested array, access by `cellStates[row][col]`
- `wordStates: Record<string, WordState>` — dictionary keyed by word name
  (e.g. `'MINT'`)
- `movesUsed: number` — single source of truth for move budget
- `activeWord: string | null` — which word's clue panel is currently open

### 11.3 Derived Values (not stored)

- Words remaining → count `isGuessedCorrectly: false` entries in `wordStates`
- Clues revealed for a word → count how many of that word's cells are `discovered`
- Win condition → all words have `isGuessedCorrectly: true`
- Sudden Death entry → `movesUsed >= budget` with ≥1 discovered, unguessed
  word (a game-phase value in state, e.g. `playing | suddenDeath | won |
  lost` — not derivable from the budget check alone)
- Loss condition → wrong guess during Sudden Death, or `movesUsed >= budget`
  with no discovered, unguessed words left and words still unguessed
- Score rating → calculated from `movesUsed` at game end

### 11.4 Board Data (static, separate from game state)

A static `WORDS` constant holds the definition of each word. The reducer
references this to answer "which word does this cell belong to?"

Each word entry contains: `word` (string), `startRow`, `startCol`,
`direction` (`'horizontal' | 'vertical' | 'diagonal'`), `length`, and
`clues` array.

Cell membership is calculated algorithmically from `startRow`, `startCol`,
`direction`, and `length` — no need to hardcode individual cell positions.

## 12. Out of Scope for MVP

The following features are explicitly deferred to later phases:

- Multiplayer / opponent boards
- User accounts or persistent login
- Weekly themes
- Win streak bonuses or modifiers
- Sound effects
- Variable grid sizes or word counts
- Leaderboards
