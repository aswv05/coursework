(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ReplyCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const scenarios = Object.freeze([
    {
      id: 'shopping', label: 'Shopping collection', short: 'Shopping', tag: 'A practical request',
      message: 'Can you collect the shopping at 5?',
      placeholder: 'For example: I can collect it after 6.',
      replies: {
        yes: 'Yes, I can collect the shopping at 5.',
        no: 'Sorry, I can’t collect the shopping at 5.',
        clarify: 'Where should I collect the shopping from?'
      }
    },
    {
      id: 'dinner', label: 'Dinner plans', short: 'Dinner', tag: 'Confirming a plan',
      message: 'Will you be home for dinner at 7?',
      placeholder: 'For example: I will be home at 8 instead.',
      replies: {
        yes: 'Yes, I’ll be home for dinner at 7.',
        no: 'I won’t be home for dinner at 7.',
        clarify: 'What are we having for dinner?'
      }
    },
    {
      id: 'unclear', label: 'An unclear request', short: 'Clarifying', tag: 'Missing information',
      message: 'Can you pick it up on your way home?',
      placeholder: 'For example: Where would I need to collect it from?',
      replies: {
        yes: 'Yes, I can pick it up on my way home.',
        no: 'Sorry, I can’t pick it up on my way home.',
        clarify: 'What would you like me to pick up?'
      }
    }
  ]);
  const intentions = Object.freeze({ yes: 'Yes', no: 'No', clarify: 'Need more information' });
  function scenario(id) {
    const result = scenarios.find(item => item.id === id);
    if (!result) throw new Error('Unknown scenario');
    return result;
  }
  function createState(id = 'shopping') {
    scenario(id);
    return { scenarioId: id, intention: null, details: '', draft: '', mode: null,
      source: null, dirty: false, confirmed: null };
  }
  function isStale(state) {
    return state.mode === 'suggested' && Boolean(state.source) && (
      state.source.scenarioId !== state.scenarioId ||
      state.source.intention !== state.intention || state.source.details !== state.details
    );
  }
  function setIntention(state, intention) {
    if (!(intention in intentions)) throw new Error('Unknown intention');
    return state.confirmed ? state : { ...state, intention };
  }
  function setDetails(state, details) {
    return state.confirmed ? state : { ...state, details: String(details) };
  }
  function generate(state) {
    if (state.confirmed || !state.intention) return state;
    const base = scenario(state.scenarioId).replies[state.intention];
    const extra = state.details.trim();
    return { ...state, draft: extra ? base + ' ' + extra : base, mode: 'suggested',
      source: { scenarioId: state.scenarioId, intention: state.intention, details: state.details },
      dirty: false };
  }
  function editDraft(state, text) {
    if (state.confirmed || !state.mode) return state;
    return { ...state, draft: String(text), dirty: true };
  }
  function writeManually(state, keepDraft = false) {
    if (state.confirmed) return state;
    return { ...state, draft: keepDraft ? state.draft : '', mode: 'manual', source: null,
      dirty: Boolean(keepDraft && state.draft) };
  }
  function discard(state) {
    if (state.confirmed) return state;
    return { ...state, draft: '', mode: null, source: null, dirty: false };
  }
  function canConfirm(state) {
    return !state.confirmed && Boolean(state.mode) && Boolean(state.draft.trim()) && !isStale(state);
  }
  function confirm(state) {
    if (!canConfirm(state)) return state;
    return { ...state, confirmed: { text: state.draft.trim(), scenarioId: state.scenarioId,
      mode: state.mode, intention: state.intention, details: state.details } };
  }
  return { scenarios, intentions, scenario, createState, setIntention, setDetails,
    generate, editDraft, writeManually, discard, isStale, canConfirm, confirm };
});

