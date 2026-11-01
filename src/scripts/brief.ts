import { gsap } from 'gsap';

export interface BriefState { goal: string; features: string[]; }

const choices = [...document.querySelectorAll<HTMLButtonElement>('[data-goal]')];
const outputs = [...document.querySelectorAll<HTMLElement>('[data-goal-panel]')];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeGoal = choices[0]?.dataset.goal ?? 'introduce';
let onChange = () => {};

export function getBriefState(): BriefState {
  const output = outputs.find(panel => panel.dataset.goalPanel === activeGoal);
  const features = [...(output?.querySelectorAll<HTMLInputElement>('[data-feature]:checked') ?? [])].map(input => input.value);
  return { goal: activeGoal, features };
}

function syncInquiry() {
  const output = outputs.find(panel => panel.dataset.goalPanel === activeGoal);
  const choice = choices.find(button => button.dataset.goal === activeGoal);
  const state = getBriefState();
  const label = output?.dataset.goalLabel ?? 'Introduce my business';
  document.querySelectorAll<HTMLElement>('[data-brief-summary]').forEach(element => { element.textContent = label; });
  document.querySelectorAll<HTMLElement>('[data-feature-summary]').forEach(element => { element.textContent = state.features.length ? state.features.join(' · ') : 'No extra features selected.'; });
  const goalField = document.querySelector<HTMLInputElement>('[data-goal-field]');
  const featuresField = document.querySelector<HTMLInputElement>('[data-features-field]');
  const service = document.querySelector<HTMLSelectElement>('#contact-service');
  if (goalField) goalField.value = label;
  if (featuresField) featuresField.value = state.features.join(', ');
  if (service && choice?.dataset.service) service.value = choice.dataset.service;
  document.querySelectorAll<HTMLButtonElement>('[data-clear-brief]').forEach(button => { button.disabled = activeGoal === 'introduce' && state.features.length === 0; });
}

function selectGoal(goal: string, animate = true) {
  if (!choices.some(choice => choice.dataset.goal === goal)) return;
  const changed = activeGoal !== goal;
  activeGoal = goal;
  choices.forEach(choice => {
    const selected = choice.dataset.goal === goal;
    choice.setAttribute('aria-checked', String(selected));
    choice.tabIndex = selected ? 0 : -1;
  });
  outputs.forEach(output => { output.hidden = output.dataset.goalPanel !== goal; });
  const output = outputs.find(panel => panel.dataset.goalPanel === goal);
  if (changed && animate && output && !reduce.matches) {
    gsap.fromTo(output.querySelectorAll('h3 span,.goal-explanation,.feature-choices'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .035, duration: .35, ease: 'power2.out', clearProps: 'transform,opacity' });
  }
  syncInquiry();
}

export function restoreBrief(state: BriefState) {
  if (!state || !choices.some(choice => choice.dataset.goal === state.goal)) return;
  selectGoal(state.goal, false);
  const output = outputs.find(panel => panel.dataset.goalPanel === state.goal);
  output?.querySelectorAll<HTMLInputElement>('[data-feature]').forEach(input => { input.checked = Array.isArray(state.features) && state.features.includes(input.value); });
  syncInquiry();
}

export function initializeBrief(changed: () => void) {
  onChange = changed;
  choices.forEach((choice, index) => {
    choice.addEventListener('click', () => { selectGoal(choice.dataset.goal ?? 'introduce'); onChange(); });
    choice.addEventListener('keydown', event => {
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (!direction && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (index + direction + choices.length) % choices.length;
      selectGoal(choices[next].dataset.goal ?? 'introduce'); choices[next].focus(); onChange();
    });
  });
  document.querySelectorAll<HTMLInputElement>('[data-feature]').forEach(input => input.addEventListener('change', () => { syncInquiry(); onChange(); }));
  document.querySelectorAll('[data-clear-brief]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll<HTMLInputElement>('[data-feature]').forEach(input => { input.checked = false; });
    selectGoal('introduce'); onChange();
  }));
  document.querySelector('[data-contact-form]')?.addEventListener('reset', () => queueMicrotask(syncInquiry));
  syncInquiry();
}
