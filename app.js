const weeks = window.pastedWeeks;

const grid = document.querySelector('#weekGrid');
const homeView = document.querySelector('#homeView');
const quizView = document.querySelector('#quizView');
const cardTemplate = document.querySelector('#weekCardTemplate');
const topbarMissedBtn = document.querySelector('#topbarMissedBtn');
const brandLink = document.querySelector('#brandLink');
const practiceMissedBtn = document.querySelector('#practiceMissedBtn');
const startPracticeMissedBtn = document.querySelector('#startPracticeMissedBtn');

let activeWeek = 0;
let questionIndex = 0;
let questionStates = [];
let isPracticeMode = false;
let practiceQuestions = [];

// ── Populate Week Cards ──────────────────────────────────────────────────────
weeks.forEach((week, index) => {
  const card = cardTemplate.content.cloneNode(true);
  const button = card.querySelector('button');
  card.querySelector('.week-label').textContent = `WEEK ${String(index + 1).padStart(2, '0')}`;
  card.querySelector('h2').textContent = week.title;
  card.querySelector('p').textContent = week.description;
  card.querySelector('.question-total').textContent = `${week.questions.length} QUESTIONS`;
  button.addEventListener('click', () => startWeek(index));
  grid.appendChild(card);
});

// ── Quiz Navigation ──────────────────────────────────────────────────────────
function startWeek(index) {
  isPracticeMode = false;
  activeWeek = index;
  questionIndex = 0;
  questionStates = weeks[index].questions.map(() => ({ selected: new Set(), reviewed: false, correct: false }));

  // Switch view cleanly: home hidden, quiz visible
  homeView.classList.add('hidden');
  quizView.classList.remove('hidden');
  renderQuestion();
  window.scrollTo(0, 0);
}

// ── Practice Missed Quiz Mode ────────────────────────────────────────────────
function startMissedPracticeQuiz() {
  const list = loadMissed();
  if (list.length === 0) return;

  isPracticeMode = true;
  practiceQuestions = list.map(item => ({ ...item }));
  questionIndex = 0;
  questionStates = practiceQuestions.map(() => ({ selected: new Set(), reviewed: false, correct: false }));

  homeView.classList.add('hidden');
  quizView.classList.remove('hidden');
  renderQuestion();
  window.scrollTo(0, 0);
}

function correctIndexes(options, correct) {
  return options.reduce((indexes, option, index) => {
    if (
      correct === option ||
      correct.startsWith(option + ', ') ||
      correct.endsWith(', ' + option) ||
      correct.includes(', ' + option + ', ')
    ) indexes.push(index);
    return indexes;
  }, []);
}

function goToQuestion(index) {
  const total = isPracticeMode ? practiceQuestions.length : weeks[activeWeek].questions.length;
  if (index < 0 || index >= total) return;
  questionIndex = index;
  renderQuestion();
  document.querySelector('#questionPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Question Text & Code Parsing ─────────────────────────────────────────────
function isCodeText(str) {
  if (!str) return false;
  const s = str.trim();
  if (/^(which of the following|what is the|select all|consider|recall|given|a colleague)/i.test(s)) return false;
  if (/^(let |type |val |match |fun |function |module |open |\| |char \*|\{ [a-z] :|Div \(|same_float|List\.)/m.test(s)) return true;
  if (/( = | -> | := |;;|\(\*|\*\))/.test(s) && !/\?$/.test(s) && !/apply\.\)$/i.test(s)) return true;
  return false;
}

function parseQuestion(raw) {
  if (!raw) return { prose: '', code: '' };
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. Explicit double newline
  const doubleNl = text.indexOf('\n\n');
  if (doubleNl !== -1) {
    const firstPart = text.slice(0, doubleNl).trim();
    const rest = text.slice(doubleNl + 2).trim();

    // Check if rest contains trailing instructions
    const secondNl = rest.indexOf('\n\n');
    if (secondNl !== -1) {
      const candidateCode = rest.slice(0, secondNl).trim();
      const candidateTrailing = rest.slice(secondNl + 2).trim();
      if (isCodeText(candidateCode)) {
        return {
          prose: `${firstPart} ${candidateTrailing}`,
          code: candidateCode
        };
      }
    }

    if (isCodeText(rest)) {
      return {
        prose: firstPart,
        code: rest
      };
    } else {
      return {
        prose: `${firstPart} ${rest}`,
        code: ''
      };
    }
  }

  // 2. Single newline followed by code keyword
  const nlCodeMatch = text.match(/\n(?=(?:let |type |val |match |fun |function |module |open |\| |char \*|\{ h :))/);
  if (nlCodeMatch) {
    return {
      prose: text.slice(0, nlCodeMatch.index).trim(),
      code: text.slice(nlCodeMatch.index + 1).trim()
    };
  }

  // 3. Question ending with ? or . followed by let / type / val
  const inlineMatch = text.match(/^([\s\S]+?[?.])\s+((?:let|type|val|match)\s+[\s\S]+)$/);
  if (inlineMatch) {
    return {
      prose: inlineMatch[1].trim(),
      code: inlineMatch[2].trim()
    };
  }

  return { prose: text, code: '' };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProseHtml(prose) {
  const escaped = escapeHtml(prose);
  return escaped.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}

// ── Render Question (Normal Quiz or Practice Mode) ───────────────────────────
function renderQuestion() {
  let title, description, eyebrow, weekNum, qData, totalQuestions;

  if (isPracticeMode) {
    title = 'Missed Questions';
    description = 'Re-attempt the questions you previously missed. Answer correctly to clear them from your review deck.';
    eyebrow = 'PRACTICE DECK';
    weekNum = '★';
    totalQuestions = practiceQuestions.length;
    const entry = practiceQuestions[questionIndex];
    qData = [entry.text, entry.options, entry.correct];
  } else {
    const week = weeks[activeWeek];
    title = week.title;
    description = week.description;
    eyebrow = `WEEK ${activeWeek + 1}`;
    weekNum = String(activeWeek + 1).padStart(2, '0');
    totalQuestions = week.questions.length;
    qData = week.questions[questionIndex];
  }

  const [text, options, correct] = qData;
  const answers = correctIndexes(options, correct);
  const isMultiSelect = answers.length > 1;
  const state = questionStates[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  document.querySelector('#quizWeekNumber').textContent = weekNum;
  document.querySelector('#quizEyebrow').textContent = eyebrow;
  document.querySelector('#quizTitle').textContent = title;
  document.querySelector('#quizDescription').textContent = description;
  document.querySelector('#progressText').textContent = `${questionIndex + 1} / ${totalQuestions}`;
  document.querySelector('#progressBar').style.width = `${((questionIndex + 1) / totalQuestions) * 100}%`;
  document.querySelector('#questionDots').innerHTML = Array.from({ length: totalQuestions }, (_, i) =>
    `<button class="question-dot ${questionStates[i].reviewed ? 'done' : ''} ${i === questionIndex ? 'active' : ''}" data-question="${i}" aria-label="Question ${i + 1}"></button>`
  ).join('');

  const { prose, code } = parseQuestion(text);
  const proseHtml = renderProseHtml(prose);
  const codeBoxHtml = code ? `
    <div class="question-code-box">
      <div class="code-box-header">
        <div class="code-box-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="code-box-lang">OCaml</span>
        <button class="copy-code-btn" type="button" title="Copy code snippet">Copy</button>
      </div>
      <pre class="question-code"><code>${escapeHtml(code)}</code></pre>
    </div>
  ` : '';

  document.querySelector('#questionPanel').innerHTML = `
    <div class="question-count">QUESTION ${String(questionIndex + 1).padStart(2, '0')} / ${String(totalQuestions).padStart(2, '0')}</div>
    <div class="question-navigator" aria-label="Question navigation">
      ${Array.from({ length: totalQuestions }, (_, i) => `<button class="question-number ${i === questionIndex ? 'is-current' : ''} ${questionStates[i].reviewed ? 'is-reviewed' : ''}" data-question="${i}">${i + 1}</button>`).join('')}
    </div>
    <h3>${proseHtml}</h3>
    ${codeBoxHtml}
    <div class="answers">
      ${options.map((option, i) => {
        const isOptCode = /(->|::|\[|\]|\{|\}|let |= |val )/.test(option);
        return `<button class="answer ${isOptCode ? 'is-code' : ''} ${state.selected.has(i) ? 'selected' : ''} ${state.reviewed && answers.includes(i) ? 'correct' : ''} ${state.reviewed && state.selected.has(i) && !answers.includes(i) ? 'incorrect' : ''}" data-index="${i}" aria-pressed="${state.selected.has(i)}" ${state.reviewed ? 'disabled' : ''}>
          <span class="answer-key">${String.fromCharCode(65 + i)}</span>
          <span class="answer-text">${escapeHtml(option)}</span>
        </button>`;
      }).join('')}
    </div>
    <div class="feedback ${state.reviewed ? 'show' : ''}" id="feedback">
      ${state.reviewed ? (
        state.correct
          ? (isPracticeMode ? '🎉 Excellent! That is correct — question cleared from your review deck!' : 'Nice work — that is the correct answer.')
          : `Not quite. The correct answer${answers.length > 1 ? 's are' : ' is'} ${answers.map(index => String.fromCharCode(65 + index)).join(', ')}.`
      ) : ''}
    </div>
    <div class="quiz-actions">
      <button class="previous-button" id="previousButton" ${questionIndex === 0 ? 'disabled' : ''}>← Previous</button>
      <span class="hint">${state.reviewed ? (state.correct ? 'Correct answer' : 'Answer reviewed') : (isMultiSelect ? 'Select all answers that apply' : 'Choose one answer')}</span>
      <div class="action-buttons">
        <button class="check-button" id="checkButton" ${state.reviewed || state.selected.size === 0 ? 'disabled' : ''}>Check answer</button>
        <button class="next-button" id="nextButton">${isLastQuestion ? 'See results' : 'Next →'}</button>
      </div>
    </div>
  `;

  // Attach event handlers
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => goToQuestion(+button.dataset.question)));
  document.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => toggleAnswer(+button.dataset.index, isMultiSelect)));
  document.querySelector('#previousButton').addEventListener('click', () => goToQuestion(questionIndex - 1));
  document.querySelector('#nextButton').addEventListener('click', () => isLastQuestion ? renderResults() : goToQuestion(questionIndex + 1));
  document.querySelector('#checkButton').addEventListener('click', () => reviewAnswer(answers));

  // Copy button handler
  const copyBtn = document.querySelector('.copy-code-btn');
  if (copyBtn && code) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
      }).catch(() => {
        copyBtn.textContent = 'Copied!';
      });
    });
  }
}

function toggleAnswer(index, isMultiSelect) {
  const state = questionStates[questionIndex];
  if (state.reviewed) return;
  if (!isMultiSelect) state.selected.clear();
  if (state.selected.has(index)) state.selected.delete(index);
  else state.selected.add(index);
  renderQuestion();
}

function reviewAnswer(answers) {
  const state = questionStates[questionIndex];
  if (!state.selected.size || state.reviewed) return;
  state.reviewed = true;
  state.correct = answers.length === state.selected.size && answers.every(index => state.selected.has(index));

  if (isPracticeMode) {
    const entry = practiceQuestions[questionIndex];
    if (state.correct) {
      // Remove question from missed deck since user got it right!
      removeMissedEntry(entry.weekIndex, entry.questionIndex);
    }
  } else {
    // Normal quiz mode: record if missed
    if (!state.correct) {
      recordMissed(activeWeek, questionIndex);
    }
  }

  renderQuestion();
}

function renderResults() {
  if (isPracticeMode) {
    const score = questionStates.filter(state => state.correct).length;
    const total = practiceQuestions.length;
    const remainingCount = loadMissed().length;
    const message = score === total
      ? 'Outstanding! You correctly answered every question in this practice session!'
      : `You got ${score} of ${total} right. ${remainingCount} questions remain in your deck for review.`;

    document.querySelector('#questionPanel').innerHTML = `
      <div class="result">
        <div class="result-mark">&#10003;</div>
        <div class="question-count">PRACTICE SESSION COMPLETE</div>
        <h3>Practice finished!</h3>
        <p>${message}</p>
        <div class="score">${score} / ${total} Correct</div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
          ${remainingCount > 0 ? '<button class="restart-button" id="retryRemainingBtn">Practice Remaining (' + remainingCount + ')</button>' : ''}
          <button class="${remainingCount > 0 ? 'secondary-button' : 'restart-button'}" id="returnHomeBtn">Return to Dashboard</button>
        </div>
      </div>
    `;

    const retryBtn = document.querySelector('#retryRemainingBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => startMissedPracticeQuiz());
    }
    document.querySelector('#returnHomeBtn').addEventListener('click', () => {
      isPracticeMode = false;
      quizView.classList.add('hidden');
      homeView.classList.remove('hidden');
      renderMissedPanel();
      window.scrollTo(0, 0);
    });
    return;
  }

  // Normal Quiz Results
  const week = weeks[activeWeek];
  week.questions.forEach(([, options, correct], i) => {
    const state = questionStates[i];
    if (!state.reviewed && state.selected.size > 0) {
      const answers = correctIndexes(options, correct);
      state.reviewed = true;
      state.correct = answers.length === state.selected.size && answers.every(idx => state.selected.has(idx));
      if (!state.correct) recordMissed(activeWeek, i);
    }
  });

  const score = questionStates.filter(state => state.correct).length;
  const total = week.questions.length;
  const message = score === total ? 'Perfect run. You clearly own this week.' : score >= Math.ceil(total * .7) ? 'Solid work. A few concepts are worth another look.' : 'Keep at it — practice is how these ideas stick.';
  document.querySelector('#questionPanel').innerHTML = `
    <div class="result">
      <div class="result-mark">&#10003;</div>
      <div class="question-count">WEEK ${activeWeek + 1} COMPLETE</div>
      <h3>Quiz finished!</h3>
      <p>${message}</p>
      <div class="score">${score} / ${total}</div>
      <button class="restart-button" id="restartButton">Try again</button>
    </div>
  `;
  document.querySelector('#restartButton').addEventListener('click', () => startWeek(activeWeek));
}

// ── Back Button & Header Navigation ──────────────────────────────────────────
document.querySelector('#backButton').addEventListener('click', () => {
  isPracticeMode = false;
  quizView.classList.add('hidden');
  homeView.classList.remove('hidden');
  renderMissedPanel();
  window.scrollTo(0, 0);
});

if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    isPracticeMode = false;
    quizView.classList.add('hidden');
    homeView.classList.remove('hidden');
    renderMissedPanel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (topbarMissedBtn) {
  topbarMissedBtn.addEventListener('click', () => {
    // If currently in quiz view, exit to home view first
    if (!quizView.classList.contains('hidden')) {
      isPracticeMode = false;
      quizView.classList.add('hidden');
      homeView.classList.remove('hidden');
      renderMissedPanel();
    }
    const missedPanel = document.querySelector('#missedPanel');
    if (missedPanel) {
      missedPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

if (practiceMissedBtn) {
  practiceMissedBtn.addEventListener('click', () => startMissedPracticeQuiz());
}

if (startPracticeMissedBtn) {
  startPracticeMissedBtn.addEventListener('click', () => startMissedPracticeQuiz());
}

// ── Missed Questions (localStorage) ─────────────────────────────────────────
const STORAGE_KEY = 'ocaml_missed_questions';

function loadMissed() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveMissed(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function recordMissed(weekIndex, qIndex) {
  const week = weeks[weekIndex];
  const [text, options, correct] = week.questions[qIndex];
  const list = loadMissed();
  const exists = list.some(e => e.weekIndex === weekIndex && e.questionIndex === qIndex);
  if (!exists) {
    list.push({ weekIndex, weekTitle: week.title, questionIndex: qIndex, text, options, correct });
    saveMissed(list);
    renderMissedPanel();
  }
}

function removeMissedEntry(weekIndex, qIndex) {
  const list = loadMissed().filter(e => !(e.weekIndex === weekIndex && e.questionIndex === qIndex));
  saveMissed(list);
  renderMissedPanel();
}

function renderMissedPanel() {
  const list = loadMissed();
  const countEl = document.querySelector('#missedCount');
  const badgeEl = document.querySelector('#topbarMissedBadge');
  const emptyEl = document.querySelector('#missedEmpty');
  const listEl = document.querySelector('#missedList');
  const bannerEl = document.querySelector('#missedPracticeBanner');
  const bannerCountEl = document.querySelector('#practiceBannerCount');

  if (countEl) countEl.textContent = list.length;
  if (badgeEl) badgeEl.textContent = list.length;
  if (bannerCountEl) bannerCountEl.textContent = list.length;

  if (topbarMissedBtn) {
    topbarMissedBtn.classList.toggle('has-missed', list.length > 0);
  }

  if (practiceMissedBtn) {
    practiceMissedBtn.disabled = list.length === 0;
  }

  if (bannerEl) {
    bannerEl.classList.toggle('hidden', list.length === 0);
  }

  if (!emptyEl || !listEl) return;
  emptyEl.style.display = list.length === 0 ? 'flex' : 'none';

  if (list.length === 0) {
    listEl.innerHTML = '';
    return;
  }

  // Render each missed card with row-by-row options and highlighted correct answers!
  listEl.innerHTML = list.map((entry, idx) => {
    const { weekIndex, weekTitle, questionIndex: qi, text, options, correct } = entry;
    const { prose, code } = parseQuestion(text);
    const proseHtml = renderProseHtml(prose);
    const codeHtml = code ? `<div class="missed-code-box"><pre class="missed-code">${escapeHtml(code)}</pre></div>` : '';
    const answers = correctIndexes(options, correct);
    const isMultiSelect = answers.length > 1;

    // Render options ROW BY ROW with check answer style
    const optionsHtml = options.map((opt, optIdx) => {
      const isCorrect = answers.includes(optIdx);
      const isOptCode = /(->|::|\[|\]|\{|\}|let |= |val )/.test(opt);
      return `
        <div class="missed-option-row ${isCorrect ? 'is-correct' : 'is-neutral'} ${isOptCode ? 'is-code' : ''}">
          <span class="option-key">${String.fromCharCode(65 + optIdx)}</span>
          <span class="option-text">${escapeHtml(opt)}</span>
          ${isCorrect ? '<span class="correct-badge">✓ Correct</span>' : ''}
        </div>
      `;
    }).join('');

    return (
      '<div class="missed-card">' +
        '<div class="missed-card-header">' +
          '<div class="missed-card-meta">' +
            '<span class="missed-week-tag">Week ' + (weekIndex + 1) + ' &middot; ' + escapeHtml(weekTitle) + '</span>' +
            '<span class="missed-q-num">Q' + (qi + 1) + '</span>' +
            '<span class="missed-type-badge">' + (isMultiSelect ? 'MULTIPLE CORRECT' : 'SINGLE CHOICE') + '</span>' +
          '</div>' +
          '<button class="missed-remove-btn" data-entry-idx="' + idx + '" title="Remove from review deck">&times;</button>' +
        '</div>' +
        '<div class="missed-question-text">' + proseHtml + '</div>' +
        codeHtml +
        '<div class="missed-options-list">' +
          optionsHtml +
        '</div>' +
      '</div>'
    );
  }).join('');

  listEl.querySelectorAll('.missed-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const i = +btn.dataset.entryIdx;
      const updated = loadMissed();
      updated.splice(i, 1);
      saveMissed(updated);
      renderMissedPanel();
    });
  });
}

document.querySelector('#resetMissedButton').addEventListener('click', () => {
  saveMissed([]);
  renderMissedPanel();
});

// Initial render
renderMissedPanel();
