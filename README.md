# λ OCaml/Weekly — NPTEL Practice Quiz

A lightweight, **zero-dependency** browser-based quiz app for practising **Functional Programming with OCaml** (NPTEL course). Pick any of the 12 weekly modules, answer at your own pace, and get instant feedback.

---

## 🚀 Getting Started

No build step, no server required.

```
Just open index.html in your browser.
```

> Works offline — everything runs locally in the browser.

---

## 📁 Project Structure

```
nptel/
├── index.html              # App shell (home grid + quiz view)
├── styles.css              # All styling — dark sidebar, card grid, animations
├── app.js                  # Quiz engine (render, navigate, score, results)
├── pasted-questions.js     # Weeks 1–7 question data (base)
├── week3-questions.js      # Overrides Week 3 with better questions
├── week7-questions.js      # Overrides Week 7 with correct questions
├── weeks8to12-questions.js # Weeks 8–12 question data
└── README.md               # This file
```

### Script loading order (in `index.html`)

```
pasted-questions.js   →  sets   window.pastedWeeks  (Weeks 1–7)
week3-questions.js    →  replaces pastedWeeks[2]     (Week 3)
week7-questions.js    →  replaces pastedWeeks[6]     (Week 7)
weeks8to12-questions  →  pushes  pastedWeeks[7–11]   (Weeks 8–12)
app.js                →  reads   window.pastedWeeks  and renders UI
```

---

## 📚 Weekly Content

| Week | Topic |
|------|-------|
| 1 | OCaml intro — types, bindings, referential transparency |
| 2 | Operators, expressions, if-then-else, shadowing |
| 3 | Functions, closures, recursion, partial application |
| 4 | Tuples, lists, records, variants, polymorphism |
| 5 | Pattern matching — guards, or-patterns, exhaustiveness |
| 6 | Higher-order functions — map, filter, fold, pipeline |
| 7 | Mutable state, exceptions, lazy evaluation, modules |
| 8 | Monads, GADTs, typed state |
| 9 | Specifications and software testing |
| 10 | Memory safety and resource management |
| 11 | OxCaml modes and safe concurrency |
| 12 | Unikernels and MirageOS |

**Total: 12 weeks × 10 questions = 120 questions**

---

## 🧠 Question Data Format

Each question is a 3-element array:

```js
[questionText, [optionA, optionB, optionC, optionD], correctAnswer]
```

- **Single-select:** `correctAnswer` is the exact text of the correct option.
- **Multi-select:** `correctAnswer` is a `", "`-separated string of all correct options.
  - The app auto-detects multi-select by counting how many options match.

### Example

```js
// Single-select
['What is the type of ref true?',
  ['bool', 'bool ref', "'a ref", 'unit'],
  'bool ref']

// Multi-select
['Select all true statements.',
  ['x == z is true', '!y = 1 is true', 'x == y is true', '!x = !z is true'],
  'x == z is true, !y = 1 is true, !x = !z is true']
```

---

## ➕ Adding a New Week / Replacing a Week

### Override an existing week

Create a new file (e.g. `week4-questions.js`):

```js
window.pastedWeeks[3] = {   // 0-indexed: Week 4 = index 3
  title: 'Week 4',
  description: 'Short description of this week.',
  questions: [
    ['Question text?', ['A', 'B', 'C', 'D'], 'B'],
    // ...
  ]
};
```

Then add a `<script>` tag in `index.html` **between** `pasted-questions.js` and `weeks8to12-questions.js`:

```html
<script src="week4-questions.js"></script>
```

### Append new weeks (13+)

```js
window.pastedWeeks.push({
  title: 'Week 13',
  description: '...',
  questions: [ /* ... */ ]
});
```

---

## ⚙️ How the Quiz Engine Works (`app.js`)

| Function | Purpose |
|---|---|
| `startWeek(index)` | Initialises per-question state, switches to quiz view |
| `renderQuestion()` | Full DOM re-render of the current question |
| `toggleAnswer(i, isMulti)` | Selects / deselects an option |
| `reviewAnswer(answers)` | Grades the current question ("Check answer") |
| `renderResults()` | Auto-grades any unreviewed answers, shows final score |
| `goToQuestion(i)` | Jumps to any question via dot / number navigator |
| `correctIndexes(options, correct)` | Maps correct answer string → option indices |

### Answer matching

`correctIndexes` uses delimiter-bounded matching (not substring search) to avoid false positives like `"2"` matching inside `"20"`:

```js
correct === option ||
correct.startsWith(option + ', ') ||
correct.endsWith(', ' + option) ||
correct.includes(', ' + option + ', ')
```

---

## 🐛 Known Limitations

- **No progress persistence** — refreshing the page resets all quiz state. `localStorage` could be added to fix this.
- **Static question count** — the header `"12 quizzes ready"` and `"120 QUESTIONS"` are hardcoded in `index.html`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS (glassmorphism, CSS variables, media queries) |
| Logic | Vanilla JavaScript (ES2020+, no frameworks) |
| Fonts | Google Fonts — Manrope + DM Mono |
| Dependencies | **None** |
