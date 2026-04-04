import { DEFAULT_QUIZ_COUNT } from './constants.js';

function inferQuizKind(item = {}) {
  if (item.contentType) return item.contentType;

  const text = [
    item.question || '',
    item.explanation || '',
    ...(item.tags || [])
  ].join(' ').toLowerCase();

  const codingTerms = [
    'script', 'gliderecord', 'glidequery', 'glideajax', 'api', 'json', 'rest', 'soap',
    'background script', 'script include', 'client script', 'business rule',
    'transform map', 'fix script', 'encoded query'
  ];
  const useCaseTerms = [
    'scenario', 'implement', 'troubleshoot', 'not attaching', 'not sending',
    'how do you', 'where do you look first', 'what steps', 'client wants',
    'design', 'configure', 'set up', 'repair', 'workflow', 'lifecycle'
  ];

  if (codingTerms.some((term) => text.includes(term))) return 'coding';
  if (useCaseTerms.some((term) => text.includes(term))) return 'use-case';
  return 'theory';
}

function matchesSelection(item, options) {
  if (options.difficulty && item.difficulty !== options.difficulty) return false;

  if (!options.scope || options.scope === 'mixed') return true;

  const inferredType = inferQuizKind(item);
  if (options.scope === 'coding' && inferredType !== 'coding') return false;
  if (options.scope === 'use-case' && inferredType !== 'use-case') return false;

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
