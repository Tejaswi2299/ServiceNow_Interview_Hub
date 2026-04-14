import { escapeHtml } from './utils.js';

export function buildQuizSetupFormMarkup({ roles = [], modules = [], topics = [], counts = [10, 20, 25, 30, 40], progressive = false } = {}) {
  const countOptions = counts.map((count) => `<option value="${count}" ${progressive && count === 10 ? 'selected' : ''}>${count}</option>`).join('');
  const scopeSelectAttrs = progressive ? ' name="scope" data-quiz-scope' : ' name="scope"';
  const roleLabelAttrs = progressive ? ' data-quiz-field="role" hidden' : '';
  const moduleLabelAttrs = progressive ? ' data-quiz-field="module" hidden' : '';
  const topicLabelAttrs = progressive ? ' data-quiz-field="topic" hidden' : '';
  const entitySelectState = progressive ? ' disabled' : '';
  const entityPlaceholder = progressive ? 'Select' : 'Any';
  const actionWrapperClass = progressive ? ' class="hero-actions"' : '';

  return `
    <form id="quiz-setup-form" class="filters" data-quiz-form>
      <label>
        Scope
        <select${scopeSelectAttrs}>
          <option value="mixed">Mixed</option>
          <option value="role">Role</option>
          <option value="module">Module</option>
          <option value="topic">Topic</option>
          <option value="coding">Coding</option>
          <option value="use-case">Use Case</option>
        </select>
      </label>
      <label${roleLabelAttrs}>
        Role
        <select name="roleValue"${entitySelectState}>
          <option value="">${entityPlaceholder} a role</option>
          ${roles.map((role) => `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}</option>`).join('')}
        </select>
      </label>
      <label${moduleLabelAttrs}>
        Module
        <select name="moduleValue"${entitySelectState}>
          <option value="">${entityPlaceholder} a module</option>
          ${modules.map((module) => `<option value="${escapeHtml(module.id)}">${escapeHtml(module.name)}</option>`).join('')}
        </select>
      </label>
      <label${topicLabelAttrs}>
        Topic
        <select name="topicValue"${entitySelectState}>
          <option value="">${entityPlaceholder} a topic</option>
          ${topics.map((topic) => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.name)}</option>`).join('')}
        </select>
      </label>
      <label>
        Difficulty
        <select name="difficulty">
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <label>
        ${progressive ? 'Question count' : 'Count'}
        <select name="count">
          ${countOptions}
        </select>
      </label>
      <div${actionWrapperClass}>
        <button class="button-link" type="submit">Start quiz</button>
      </div>
    </form>
  `;
}
