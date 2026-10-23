const weeks = window.pastedWeeks;

const grid = document.querySelector('#weekGrid');
const homeView = document.querySelector('#homeView');
const quizView = document.querySelector('#quizView');
const cardTemplate = document.querySelector('#weekCardTemplate');
const topbarMissedBtn = document.querySelector('#topbarMissedBtn');
const brandLink = document.querySelector('#brandLink');

let activeWeek = 0;
let questionIndex = 0;
let questionStates = [];

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
  activeWeek = index;
  questionIndex = 0;
  questionStates = weeks[index].questions.map(() => ({ selected: new Set(), reviewed: false, correct: false }));

  // Switch view cleanly: home hidden, quiz visible
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
  if (index < 0 || index >= weeks[activeWeek].questions.length) return;
  questionIndex = index;
  renderQuestion();
  document.querySelector('#questionPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Question Text & Code Parsing ─────────────────────────────────────────────
function parseQuestion(raw) {
  if (!raw) return { prose: '', code: '' };
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. Explicit double newline
  const doubleNl = text.indexOf('\n\n');
  if (doubleNl !== -1) {
    return {
      prose: text.slice(0, doubleNl).trim(),
      code: text.slice(doubleNl + 2).trim()
    };
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

// ── Render Question ──────────────────────────────────────────────────────────
function renderQuestion() {
  const week = weeks[activeWeek];
  const [text, options, correct] = week.questions[questionIndex];
  const answers = correctIndexes(options, correct);
  const isMultiSelect = answers.length > 1;
  const state = questionStates[questionIndex];
  const isLastQuestion = questionIndex === week.questions.length - 1;

  document.querySelector('#quizWeekNumber').textContent = String(activeWeek + 1).padStart(2, '0');
  document.querySelector('#quizEyebrow').textContent = `WEEK ${activeWeek + 1}`;
  document.querySelector('#quizTitle').textContent = week.title;
  document.querySelector('#quizDescription').textContent = week.description;
  document.querySelector('#progressText').textContent = `${questionIndex + 1} / ${week.questions.length}`;
  document.querySelector('#progressBar').style.width = `${((questionIndex + 1) / week.questions.length) * 100}%`;
  document.querySelector('#questionDots').innerHTML = week.questions.map((_, i) =>
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
    <div class="question-count">QUESTION ${String(questionIndex + 1).padStart(2, '0')} / ${String(week.questions.length).padStart(2, '0')}</div>
    <div class="question-navigator" aria-label="Question navigation">
      ${week.questions.map((_, i) => `<button class="question-number ${i === questionIndex ? 'is-current' : ''} ${questionStates[i].reviewed ? 'is-reviewed' : ''}" data-question="${i}">${i + 1}</button>`).join('')}
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
      ${state.reviewed ? (state.correct ? 'Nice work — that is the correct answer.' : `Not quite. The correct answer${answers.length > 1 ? 's are' : ' is'} ${answers.map(index => String.fromCharCode(65 + index)).join(', ')}.`) : ''}
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
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
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
  if (!state.correct) recordMissed(activeWeek, questionIndex);
  renderQuestion();
}

function renderResults() {
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
  quizView.classList.add('hidden');
  homeView.classList.remove('hidden');
  renderMissedPanel();
  window.scrollTo(0, 0);
});

if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
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
  }
}

function renderMissedPanel() {
  const list = loadMissed();
  const countEl = document.querySelector('#missedCount');
  const badgeEl = document.querySelector('#topbarMissedBadge');
  const emptyEl = document.querySelector('#missedEmpty');
  const listEl = document.querySelector('#missedList');

  if (countEl) countEl.textContent = list.length;
  if (badgeEl) badgeEl.textContent = list.length;
  if (topbarMissedBtn) {
    topbarMissedBtn.classList.toggle('has-missed', list.length > 0);
  }

  if (!emptyEl || !listEl) return;
  emptyEl.style.display = list.length === 0 ? 'flex' : 'none';

  if (list.length === 0) {
    listEl.innerHTML = '';
    return;
  }

  listEl.innerHTML = list.map((entry, idx) => {
    const { weekIndex, weekTitle, questionIndex: qi, text, options, correct } = entry;
    const { prose, code } = parseQuestion(text);
    const proseHtml = renderProseHtml(prose);
    const codeHtml = code ? `<div class="missed-code-box"><pre class="missed-code">${escapeHtml(code)}</pre></div>` : '';

    const cIdx = options.reduce((acc, opt, i) => {
      if (
        correct === opt ||
        correct.startsWith(opt + ', ') ||
        correct.endsWith(', ' + opt) ||
        correct.includes(', ' + opt + ', ')
      ) acc.push(i);
      return acc;
    }, []);
    const correctLabel = cIdx.map(i => String.fromCharCode(65 + i) + '. ' + options[i]).join(' / ');

    return (
      '<div class="missed-card">' +
        '<div class="missed-card-meta">' +
          '<span class="missed-week-tag">Week ' + (weekIndex + 1) + ' &middot; ' + escapeHtml(weekTitle) + '</span>' +
          '<span class="missed-q-num">Q' + (qi + 1) + '</span>' +
        '</div>' +
        '<p class="missed-question-text">' + proseHtml + '</p>' +
        codeHtml +
        '<div class="missed-answer-label"><span class="missed-correct-dot"></span><div>Correct: <strong>' + escapeHtml(correctLabel) + '</strong></div></div>' +
        '<button class="missed-remove-btn" data-entry-idx="' + idx + '" title="Remove from review deck">&times;</button>' +
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
