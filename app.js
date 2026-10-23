const weeks = window.pastedWeeks;

const grid = document.querySelector('#weekGrid');
const homeView = document.querySelector('#homeView');
const quizView = document.querySelector('#quizView');
const cardTemplate = document.querySelector('#weekCardTemplate');
let activeWeek = 0;
let questionIndex = 0;
let questionStates = [];

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

function startWeek(index) {
  activeWeek = index;
  questionIndex = 0;
  questionStates = weeks[index].questions.map(() => ({ selected: new Set(), reviewed: false, correct: false }));
  homeView.classList.add('hidden');
  quizView.classList.remove('hidden');
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function correctIndexes(options, correct) {
  return options.reduce((indexes, option, index) => {
    // Use delimiter-bounded matching to avoid substring false-positives
    // e.g. option "2" must NOT match correct "20"
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
  document.querySelector('#questionDots').innerHTML = week.questions.map((_, i) => `<button class="question-dot ${questionStates[i].reviewed ? 'done' : ''} ${i === questionIndex ? 'active' : ''}" data-question="${i}" aria-label="Question ${i + 1}"></button>`).join('');
  document.querySelector('#questionPanel').innerHTML = `
    <div class="question-count">QUESTION ${String(questionIndex + 1).padStart(2, '0')} / ${String(week.questions.length).padStart(2, '0')}</div>
    <div class="question-navigator" aria-label="Question navigation">${week.questions.map((_, i) => `<button class="question-number ${i === questionIndex ? 'is-current' : ''} ${questionStates[i].reviewed ? 'is-reviewed' : ''}" data-question="${i}">${i + 1}</button>`).join('')}</div>
    <h3>${text}</h3>
    <div class="answers">${options.map((option, i) => `<button class="answer ${state.selected.has(i) ? 'selected' : ''} ${state.reviewed && answers.includes(i) ? 'correct' : ''} ${state.reviewed && state.selected.has(i) && !answers.includes(i) ? 'incorrect' : ''}" data-index="${i}" aria-pressed="${state.selected.has(i)}" ${state.reviewed ? 'disabled' : ''}><span class="answer-key">${String.fromCharCode(65 + i)}</span><span>${option}</span></button>`).join('')}</div>
    <div class="feedback ${state.reviewed ? 'show' : ''}" id="feedback">${state.reviewed ? (state.correct ? 'Nice work — that is the correct answer.' : `Not quite. The correct answer${answers.length > 1 ? 's are' : ' is'} ${answers.map(index => String.fromCharCode(65 + index)).join(', ')}.`) : ''}</div>
    <div class="quiz-actions"><button class="previous-button" id="previousButton" ${questionIndex === 0 ? 'disabled' : ''}>← Previous</button><span class="hint">${state.reviewed ? (state.correct ? 'Correct answer' : 'Answer reviewed') : (isMultiSelect ? 'Select all answers that apply' : 'Choose one answer')}</span><div class="action-buttons"><button class="check-button" id="checkButton" ${state.reviewed || state.selected.size === 0 ? 'disabled' : ''}>Check answer</button><button class="next-button" id="nextButton">${isLastQuestion ? 'See results' : 'Next →'}</button></div></div>`;

  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => goToQuestion(+button.dataset.question)));
  document.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => toggleAnswer(+button.dataset.index, isMultiSelect)));
  document.querySelector('#previousButton').addEventListener('click', () => goToQuestion(questionIndex - 1));
  document.querySelector('#nextButton').addEventListener('click', () => isLastQuestion ? renderResults() : goToQuestion(questionIndex + 1));
  document.querySelector('#checkButton').addEventListener('click', () => reviewAnswer(answers));
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
  renderQuestion();
}

function renderResults() {
  const week = weeks[activeWeek];
  // Auto-evaluate any questions that were answered but never "checked"
  week.questions.forEach(([, options, correct], i) => {
    const state = questionStates[i];
    if (!state.reviewed && state.selected.size > 0) {
      const answers = correctIndexes(options, correct);
      state.reviewed = true;
      state.correct = answers.length === state.selected.size && answers.every(idx => state.selected.has(idx));
    }
  });
  const score = questionStates.filter(state => state.correct).length;
  const total = week.questions.length;
  const message = score === total ? 'Perfect run. You clearly own this week.' : score >= Math.ceil(total * .7) ? 'Solid work. A few concepts are worth another look.' : 'Keep at it — practice is how these ideas stick.';
  document.querySelector('#questionPanel').innerHTML = `<div class="result"><div class="result-mark">&#10003;</div><div class="question-count">WEEK ${activeWeek + 1} COMPLETE</div><h3>Quiz finished!</h3><p>${message}</p><div class="score">${score} / ${total}</div><button class="restart-button" id="restartButton">Try again</button></div>`;
  document.querySelector('#restartButton').addEventListener('click', () => startWeek(activeWeek));
}


document.querySelector('#backButton').addEventListener('click', () => {
  quizView.classList.add('hidden');
  homeView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
