
    
  
(function () {
  'use strict';
  const C = window.ReplyCore;
  let state = C.createState();
  let pendingAction = null;
  const $ = id => document.getElementById(id);
  const elements = Object.fromEntries(['scenarios','incoming-message','extra-details',
    'generation-error','generate','manual','draft-panel','draft','draft-heading','draft-context',
    'stale-warning','confirm','reply-flow','completion','outgoing-message','change-dialog',
    'dialog-title','dialog-description','dialog-proceed'].map(id => [id, $(id)]));

  function ask(title, description, proceed, action) {
    pendingAction = action;
    elements['dialog-title'].textContent = title;
    elements['dialog-description'].textContent = description;
    elements['dialog-proceed'].textContent = proceed;
    elements['change-dialog'].showModal();
  }
  elements['change-dialog'].addEventListener('close', () => {
    const action = pendingAction;
    pendingAction = null;
    if (elements['change-dialog'].returnValue === 'proceed' && action) action();
    elements['change-dialog'].returnValue = '';
  });
  function focusDraft() { elements.draft.focus(); }
  function chooseScenario(id) {
    if (id === state.scenarioId) return;
    const apply = () => {
      state = C.createState(id);
      elements['generation-error'].hidden = true;
      render();

      elements['incoming-message'].setAttribute('tabindex', '-1');
      elements['incoming-message'].focus();
    };
    if (!state.confirmed && (state.details || state.draft || state.intention)) {
      ask('Start a different example?', 'Your current response, extra wording and unsent draft will be cleared.', 'Start example', apply);
    } else apply();
  }
  C.scenarios.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.scenario = item.id;
    button.textContent = item.short;
    button.addEventListener('click', () => chooseScenario(item.id));
    elements.scenarios.append(button);
  });
  function render() {
    const item = C.scenario(state.scenarioId);
    const stale = C.isStale(state);
    document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === state.scenarioId)));
    elements['incoming-message'].textContent = item.message;
    document.querySelectorAll('[name=intention]').forEach(input => { input.checked = input.value === state.intention; });
    if (elements['extra-details'].value !== state.details) elements['extra-details'].value = state.details;
    elements['draft-panel'].hidden = !state.mode;
    elements['draft-heading'].textContent = state.mode === 'manual' ? 'Your own reply' : 'Review your suggestion';
    if (elements.draft.value !== state.draft) elements.draft.value = state.draft;
    elements['stale-warning'].hidden = !stale;
    if (state.mode === 'suggested' && state.source) {
      elements['draft-context'].textContent = 'Based on: ' + C.intentions[state.source.intention] + (state.source.details.trim() ? ' · Extra wording: ' + state.source.details.trim() : ' · No extra wording');
    } else elements['draft-context'].textContent = 'Write your reply below.';
    elements.generate.textContent = stale ? 'Update suggestion' : 'Create suggestion';
    elements.confirm.disabled = !C.canConfirm(state);
    elements['reply-flow'].hidden = Boolean(state.confirmed);
    elements.completion.hidden = !state.confirmed;
    elements['outgoing-message'].textContent = state.confirmed ? state.confirmed.text : '';

  }
  document.querySelectorAll('[name=intention]').forEach(input => input.addEventListener('change', () => {
    state = C.setIntention(state, input.value);
    elements['generation-error'].hidden = true;
    render();

  }));
  elements['extra-details'].addEventListener('input', () => {
    state = C.setDetails(state, elements['extra-details'].value);
    render();
  });
  elements.generate.addEventListener('click', () => {
    if (!state.intention) {
      elements['generation-error'].hidden = false;
      document.querySelector('[name=intention]').focus();
      return;
    }
    const apply = () => { state = C.generate(state); render(); focusDraft();  };
    if (state.dirty && state.draft.trim()) ask('Replace your edited draft?', 'Creating a suggestion will replace your current wording. Keep working if you want to retain your edits.', 'Replace draft', apply);
    else apply();
  });
  elements.manual.addEventListener('click', () => {
    const apply = () => {
      state = C.writeManually(state, false); elements['generation-error'].hidden = true;
      render(); focusDraft();
    };
    if (state.draft.trim()) ask('Start a manual reply?', 'This clears the existing draft. To retain its wording, keep working and edit the draft directly.', 'Start blank reply', apply);
    else apply();
  });
  $('keep-manual').addEventListener('click', () => {
    state = C.writeManually(state, true); render(); focusDraft();

  });
  elements.draft.addEventListener('input', () => { state = C.editDraft(state, elements.draft.value); elements.confirm.disabled = !C.canConfirm(state); });
  $('cancel').addEventListener('click', () => {
    const apply = () => { state = C.discard(state); render(); elements.generate.focus();  };
    if (state.draft.trim()) ask('Cancel this draft?', 'The draft will be removed. Your selected response and extra wording will be kept.', 'Cancel draft', apply);
    else apply();
  });
  elements.confirm.addEventListener('click', () => {
    if (!C.canConfirm(state)) return;
    state = C.confirm(state); render();
    $('restart').focus();
  });
  $('restart').addEventListener('click', () => {
    state = C.createState(state.scenarioId); render();
    document.querySelector('[name=intention]').focus();
  });
  render();
})();
