
import { DEFAULT_QUIZ_COUNT } from './constants.js';

function matchesSelection(item, options) {
  if (options.difficulty && item.difficulty !== options.difficulty) return false;

  if (!options.scope || options.scope === 'mixed') return true;

  if (options.scope === 'coding' || options.scope === 'use-case') {
    if (options.scope === 'coding' && !(item.tags || []).includes('coding') && item.contentType !== 'coding') return false;
    if (options.scope === 'use-case' && item.contentType !== 'use-case') return false;
  }

  if (options.scope === 'role' && options.value && !(item.roleIds || []).includes(options.value)) return false;
  if (options.scope === 'module' && options.value && !(item.moduleIds || []).includes(options.value)) return false;
  if (options.scope === 'topic' && options.value && !(item.topicIds || []).includes(options.value)) return false;

  return true;
}

export function buildQuiz(quizzes = [], options = {}) {
  const count = Number(options.count || DEFAULT_QUIZ_COUNT);
  const filtered = quizzes.filter((item) => matchesSelection(item, options));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function gradeQuiz(session, answers) {
  const results = session.questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = Number(userAnswer) === question.answerIndex;
    return {
      question,
      userAnswer,
      isCorrect
    };
  });

  const correct = results.filter((item) => item.isCorrect).length;
  const total = results.length;
  return {
    correct,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    results
  };
}
