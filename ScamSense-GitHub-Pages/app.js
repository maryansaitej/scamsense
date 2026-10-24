// GitHub Pages edition: course rules and progress run entirely in this browser.
import { createCourse } from './learning.js';
const siteKey = `scamsense:pages:v1:${new URL('.', location.href).pathname}`;
let browserStorage;
try {
  browserStorage = window.localStorage;
  const probe = `${siteKey}:probe`;
  browserStorage.setItem(probe, '1'); browserStorage.removeItem(probe);
} catch { browserStorage = undefined; }
const course = createCourse(browserStorage, siteKey);
const main = document.querySelector('#main');
let content, results = null, screen = 'welcome', simulationIndex = 0, busy = false, moduleId = 'email', quizIndex = 0, retryRevision = false;
const icon = (name) => {
  const paths = {
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    sms: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
    support: '<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H2v6h4v-6Zm16 0h2v6h-4v-6Zm0 6c0 3-4 3-6 3"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
const icons = { email: icon('email'), sms: icon('sms'), support: icon('support') };
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const e = escapeHtml;
function notice(message) { const box = document.querySelector('#notice'); box.textContent = message; box.hidden = false; }
function clearNotice() { document.querySelector('#notice').hidden = true; }
function readDraft(phase) { return course.getDraft(phase); }
function saveDraft(phase, answers) { course.saveDraft(phase, answers); }
const moduleState = () => results.modules.find(m => m.id === moduleId);
const moduleContent = () => content.modules.find(m => m.id === moduleId);
const scenario = () => content.scenarios.find(s => s.id === moduleId);
const savedDecision = q => results.simulations.find(a => a.stepId === q.id);
const moduleNumber = () => content.modules.findIndex(m => m.id === moduleId) + 1;
const missedCategories = phase => Object.keys(content.categories).filter(id => content.assessments[phase].some(q => q.category === id && !results[phase]?.answers.find(a => a.questionId === q.id)?.correct));
function heading(kicker, title, description, badge = '') {
  return `<div class="page-heading"><p class="eyebrow">${kicker}</p><div class="heading-row"><h1>${title}</h1>${badge ? `<span class="pill">${badge}</span>` : ''}</div><p class="lede">${description}</p></div>`;
}
function button(label, action, type = 'primary') { return `<button type="button" class="${type}" data-action="${action}">${label}</button>`; }
function feedback(answer) { return `<div class="feedback ${answer.correct ? '' : 'wrong'}" role="status"><strong>${answer.correct ? 'A safer choice.' : 'Here’s what to do differently.'}</strong><p>${e(answer.explanation)}</p></div>`; }
function navigation() {
  const active = ['welcome','pre','starting'].includes(screen) ? 'pre' : ['training','lesson','practice','recap'].includes(screen) ? 'training' : screen === 'post' ? 'post' : 'results';
  const completed = results?.modules.filter(m => m.completed).length || 0;
  const entries = [ ['pre', 'Start', true, !!results?.pre], ['training', 'Train', !!results?.pre, completed === 3], ['post', 'Check', completed === 3, !!results?.post], ['results', 'Review', !!results?.post, !!results?.post] ];
  document.querySelector('#navigation').innerHTML = entries.map(([id,label,available,done],i) => `<button class="nav-btn ${active === id ? 'active' : ''} ${done ? 'completed' : ''}" data-screen="${id}" ${available ? '' : 'disabled'} ${active === id ? 'aria-current="step"' : ''}><span class="nav-num">${done && active !== id ? '✓' : '0'+(i+1)}</span><span>${label}</span></button>`).join('');
  document.querySelector('#journey-count').textContent = !results?.pre ? 'ONE ROUTINE. THREE EVERYDAY SITUATIONS.' : results.post ? 'Learning journey complete · revision is always available' : `${completed} of 3 modules complete · ${completed === 3 ? 'Final check is ready' : 'Progress saved in this browser'}`;
}
function show(next, focus = true) {
  screen = next; main.dataset.view = next; clearNotice(); navigation();
  const render = { welcome, restart: restartScreen, pre: () => assessment('pre'), starting, training, lesson, practice, recap, post: () => assessment('post'), results: dashboard, revision };
  main.innerHTML = render[next]();
  document.querySelectorAll('[data-width]').forEach(el => { el.style.width = `${el.dataset.width}%`; });
  if (focus) { main.focus({ preventScroll: true }); window.scrollTo({ top:0, behavior:'instant' }); }
}
function restartScreen() {
  return `${heading('Start a new journey', 'Ready for another go?', 'This replaces this site’s saved journey in this browser, including your scores and drafts. Continue only if you want to start again.')}<div class="actions">${button('Keep my current results','results','secondary')}${button('Start a new baseline →','start')}</div>`;
}
function welcome() {
  return `<section class="hero" aria-label="Start learning"><div class="hero-copy"><p class="eyebrow"><span class="tiny-line"></span> A SMALL COURSE FOR EVERYDAY LIFE</p><h1>Before you click,<br><em>know what to do.</em></h1><p class="hero-description">Learn a simple routine for suspicious emails, texts, and support requests. See it explained, try it yourself, then check what you’ve learned.</p><div class="hero-actions">${button('Start the 2-minute baseline '+icon('arrow'),'start')}<span class="hero-duration">About 15 minutes total<br><strong>No account needed</strong></span></div><div class="hero-assurance">${icon('shield')} Safe examples. No real messages or secrets.</div></div><div class="threat-study" aria-hidden="true"><div class="study-top"><span><i></i> A SAFE PLACE TO PRACTISE</span><span>01 / 03</span></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="sample-mail"><div class="sample-sender"><span class="mail-avatar">C</span><div><strong>CloudNest</strong><small>Account notification</small></div><span class="sample-time">now</span></div><h3>A message arrives.</h3><p>It asks you to take action.<br>What would you do next?</p><span class="sample-button">Take a moment <span>↗</span></span><div class="sample-url">A fictional learning scenario</div></div><div class="signal-tag"><span>↳</span><div><small>LEARN BY MAKING A CHOICE</small><strong>Mistakes are welcome here.</strong></div></div><div class="study-bottom"><span>UNDERSTAND · PRACTISE · REFLECT</span><span>AT YOUR OWN PACE</span></div></div></section>
  <div class="section-heading"><div><p class="eyebrow">HERE’S THE PLAN</p><h2>One clear path.</h2></div><p>You’ll always know why you’re here<br>and what comes next.</p></div><div class="course-plan">${[['Start','6 short questions','Find your starting point. No pass or fail.'],['Train','3 focused modules','See an example, try a scenario, keep one takeaway.'],['Check','6 new questions','Use the routine without guidance.'],['Review','Your next step','Compare results and practise any missed topics.']].map((x,i)=>`<article><span class="eyebrow">0${i+1}</span><h3>${x[0]}</h3><strong>${x[1]}</strong><p>${x[2]}</p></article>`).join('')}</div><p class="welcome-bottom">Your progress stays in this browser. No account or server is needed. This is learning practice, not a security certification.</p>`;
}
function questionFields(q, selected, disabled = false, index = 0, label = 'QUESTION') {
  return `<fieldset class="question"><legend><small>${label} ${index+1}</small>${e(q.prompt)}</legend><div class="choices">${q.choices.map((c,i)=>`<label class="choice"><input type="radio" name="${e(q.id)}" value="${e(c.id)}" ${selected === c.id ? 'checked' : ''} ${disabled ? 'disabled' : 'required'}><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${e(c.label)}</span></label>`).join('')}</div></fieldset>`;
}
function assessment(phase) {
  const q = content.assessments[phase][quizIndex];
  return `${heading(phase === 'pre' ? '1 / Start · About 2 minutes' : '3 / Check · About 2 minutes', phase === 'pre' ? 'What would you do?' : 'Try it on your own.', phase === 'pre' ? 'This gives you a starting point. Choose what you would do today; you’ll learn the routine next.' : 'These are new situations. Use what you practised, without hints. Your first attempt will be saved.', `Question ${quizIndex+1} of 6`)}<form id="assessment-form" data-phase="${phase}"><div class="sim-progress" aria-label="Question ${quizIndex+1} of 6">${content.assessments[phase].map((_,i)=>`<span class="${i<=quizIndex?'done':''}"></span>`).join('')}</div><div class="question-block">${questionFields(q, readDraft(phase)[q.id], false, quizIndex)}</div><div class="actions"><button type="button" class="secondary" data-action="quiz-back" ${quizIndex===0?'disabled':''}>← Back</button><span class="subtle">No time limit</span><button class="primary" type="submit">${quizIndex===5 ? (phase==='pre'?'See my starting point →':'See my results →') : 'Next question →'}</button></div></form>`;
}
function starting() {
  const missed = missedCategories('pre');
  return `${heading('1 / Start · Baseline saved', 'Your starting point.', `You chose ${results.pre.correct} of 6 safer responses. This is a small learning snapshot, not a judgement of your ability.`)}<div class="next-card"><div><p class="eyebrow">WHAT HAPPENS NEXT</p><h2>Learn it. Then try it.</h2><p>Work through three short modules. Each explains the routine using an example, gives you a different situation to try, and finishes with one takeaway.</p><p>${missed.length ? `Give a little extra attention to <strong>${missed.map(id=>e(content.categories[id])).join(', ')}</strong>, where you missed a baseline question.` : 'You made a strong start. Practise the reasoning behind your choices in all three modules.'}</p></div>${button('Go to my training plan →','training')}</div><p class="subtle">Your baseline stays fixed. You can review its answers after the final check.</p>`;
}
function training() {
  const next = results.modules.find(m=>!m.completed);
  const missed = missedCategories('pre');
  return `${heading('2 / Train · About 3 minutes per module', 'Three situations. One routine.', 'In each module: see a worked example → try two decisions → review your takeaway.', `${results.modules.filter(m=>m.completed).length} of 3 complete`)}
  <div class="routine-ribbon">${content.framework.map((f,i)=>`<span><b>0${i+1}</b> ${e(f.title)}</span>`).join('')}</div><div class="module-list">${content.modules.map((m,i)=>{const state=results.modules[i];return `<article class="module-row ${next?.id===m.id?'recommended':''}"><div class="module-icon">${icons[m.id]}</div><div class="module-copy"><p class="eyebrow">MODULE 0${i+1} · ${state.completed?'COMPLETE':state.available?'UP NEXT':'AVAILABLE AFTER THE PREVIOUS MODULE'}</p><h3>${e(content.categories[m.id])}</h3><p>${e(m.objective)}</p>${missed.includes(m.id)?'<small>Worth extra attention based on your baseline.</small>':''}</div><button class="${next?.id===m.id?'primary':'secondary'}" data-action="module:${m.id}" ${state.available?'':'disabled'}>${state.completed?'Review module':state.lessonDone?'Continue module':'Start module'} ${icon('arrow')}</button></article>`;}).join('')}</div>${!next ? `<div class="next-card"><div><p class="eyebrow">ALL THREE MODULES COMPLETE</p><h2>Ready for a fresh set of situations?</h2><p>The final check uses six new questions. Your original scores won’t be changed by revision practice.</p></div>${button(results.post?'View my results →':'Take the final check →',results.post?'results':'post')}</div>`:''}`;
}
function moduleHeading(title, text, stage) {
  return `${button('← Training plan','training','small-link')}${heading(`2 / Train · Module ${moduleNumber()} of 3 · ${e(content.categories[moduleId])}`,title,text)}<div class="module-trail" aria-label="Module stages">${['See an example','Try it yourself','Keep the takeaway'].map((label,i)=>`<span class="${i===stage?'current':''}">${i+1}. ${label}</span>`).join('')}</div>`;
}
function lesson() {
  const m=moduleContent();
  return `${moduleHeading('See the routine in action.',m.objective,0)}<div class="worked-layout"><article class="worked-example"><p class="eyebrow">WORKED EXAMPLE · FICTIONAL</p><blockquote>${e(m.example)}</blockquote><p>This example is explained for you. Next, you’ll try a different message.</p></article><div class="routine-steps">${content.framework.map((f,i)=>`<details ${i===0?'open':''}><summary><span>0${i+1}</span>${e(f.title)}<span class="expand-mark" aria-hidden="true">+</span></summary><p>${e(m.steps[i])}</p></details>`).join('')}</div></div><div class="actions"><span class="subtle">Open each step to see how the routine works.</span>${button(moduleState().completed?'Back to my recap →':'I’ve reviewed the example. Let me try →',moduleState().completed?'recap':'finish-lesson')}</div>`;
}
function messageCard(s) {
  return `<article class="message message-${s.id}"><div class="message-bar"><span>${e(s.kind)}</span><span>FICTIONAL SCENARIO</span></div><div class="message-body"><div class="sender"><span class="mail-symbol">${icons[s.id]}</span><div><strong>${e(s.sender)}</strong><small>${e(s.address)}</small></div></div><h3>${e(s.subject)}</h3><p>${e(s.message)}</p>${s.link?`<details class="inspect-detail"><summary>Inspect the link destination</summary><span class="inert-link">${e(s.link)}</span><small>This is plain text, not a working link.</small></details>`:''}${s.id==='support' && simulationIndex===1?'<p><strong>Agent follow-up:</strong> “Let me remotely control your device to secure it. We must act now.”</p>':''}</div><div class="contained">All interactions stay inside this exercise.</div></article>`;
}
function practice() {
  const s=scenario(), q=s.steps[simulationIndex], answer=savedDecision(q);
  return `${moduleHeading('Now it’s your turn.',simulationIndex===0?'Read the new message. Pause and inspect before choosing your response.':'Choose how to verify or respond using an independent trusted route.',1)}<div class="simulation-layout"><div class="simulation-stage">${messageCard(s)}</div><div class="decision-panel"><p class="eyebrow">${simulationIndex===0?'PAUSE + INSPECT':'VERIFY + RESPOND'}</p><form id="simulation-form">${questionFields(q,answer?.choiceId,!!answer,simulationIndex,'DECISION')}${answer?feedback(answer):'<button class="primary" type="submit">Check my response →</button>'}</form>${answer?`<div class="actions">${button(simulationIndex===0?'Next: verify and respond →':'See my takeaway →','next-decision')}</div>`:''}<p class="subtle practice-note">You’re practising. An incorrect choice is a chance to learn.</p></div></div>`;
}
function recap() {
  const s=scenario(), m=moduleContent();
  const answers=s.steps.map(q=>savedDecision(q));
  return `${moduleHeading('One thing to take with you.',m.takeaway,2)}<div class="takeaway"><span>${icons[m.id]}</span><div><p class="eyebrow">THE HABIT TO KEEP</p><h2>${e(m.objective)}</h2><p>${answers.filter(a=>a?.correct).length} of 2 safer responses on your first attempt. Review the reasoning below; completion means you worked through the activity, not that you are immune to scams.</p></div></div><div class="recap-grid">${s.steps.map((q,i)=>`<article class="card"><p class="eyebrow">DECISION ${i+1}</p><h3>${e(q.prompt)}</h3><p>Your choice: ${e(q.choices.find(c=>c.id===answers[i]?.choiceId)?.label || 'Not answered')}</p>${answers[i]?feedback(answers[i]):''}</article>`).join('')}</div><div class="actions">${button('Revisit the worked example','lesson','secondary')}${button(moduleState().completed?'Back to training plan →':moduleNumber()===3?'Complete module & open final check →':'Complete module & continue →',moduleState().completed?'training':'complete-module')}</div>`;
}
function answerReview(phase) {
  return `<details class="review-detail"><summary>Review ${phase==='pre'?'baseline':'final'} answers</summary>${content.assessments[phase].map(q=>{const a=results[phase].answers.find(a=>a.questionId===q.id);return `<div class="review-answer"><h3>${e(q.prompt)}</h3><p class="subtle">Your choice: ${e(q.choices.find(c=>c.id===a.choiceId).label)}</p>${feedback(a)}</div>`;}).join('')}</details>`;
}
function dashboard() {
  const needed=results.revision;
  return `${heading('4 / Review · Journey complete','Here’s what you learned.','Compare your first attempts, then choose a focused practice exercise. Revision never changes these scores.')}
  <div class="stats"><article class="stat"><small>Before training</small><strong>${results.pre.percentage}%</strong><p>${results.pre.correct} of 6 safer responses</p></article><article class="stat"><small>After training</small><strong>${results.post.percentage}%</strong><p>${results.post.correct} of 6 safer responses</p></article><article class="stat highlight"><small>Change</small><strong>${results.improvement>0?'+':''}${results.improvement}</strong><p>percentage points</p></article></div><div class="section-heading"><div><p class="eyebrow">YOUR NEXT STEP</p><h2>${needed.length?'Strengthen these skills.':'Keep the habit going.'}</h2></div><p>${needed.length?'You missed a final question in these topics. Try a fresh example.':'You chose all six safer responses. You can still revisit any topic.'}</p></div><div class="module-list">${content.modules.filter(m=>!needed.length||needed.includes(m.id)).map(m=>`<article class="module-row"><div class="module-icon">${icons[m.id]}</div><div class="module-copy"><h3>${e(content.categories[m.id])}</h3><p>${e(m.objective)}</p>${results.revisionPractice.find(a=>a.moduleId===m.id)?.correct?'<small>Latest revision response: a safer choice.</small>':''}</div>${button('Practise this skill →',`revision:${m.id}`,'secondary')}</article>`).join('')}</div>${answerReview('post')}${answerReview('pre')}<div class="framework-strip"><div><h3>Pause. Inspect. Verify. Respond.</h3><p>This is a snapshot from six questions, not a validated security rating. Keep using the routine in everyday situations.</p></div></div><div class="actions">${button('Review all three modules','training','secondary')}${button('Start a fresh journey','restart','small-link')}</div>`;
}
function revision() {
  const q=content.revisions[moduleId];
  const answer=retryRevision?null:results.revisionPractice.find(a=>a.moduleId===moduleId);
  return `${button('← My results','results','small-link')}${heading('4 / Review · Focused practice',content.categories[moduleId],moduleContent().objective)}<div class="revision-layout"><details class="revision-reminder"><summary>Need a reminder of the routine?</summary>${content.framework.map((f,i)=>`<p><strong>${e(f.title)}.</strong> ${e(moduleContent().steps[i])}</p>`).join('')}</details><form id="revision-form"><div class="question-block">${questionFields(q,answer?.choiceId,!!answer,0,'FRESH EXAMPLE')}${answer?feedback(answer):''}</div>${answer?`<div class="actions">${answer.correct?'<span class="saved">You chose a safer response. Keep using the routine.</span>':button('Try again','retry-revision','secondary')}${button('Back to my results →','results')}</div>`:'<button class="primary" type="submit">Check my response →</button>'}</form><p class="subtle">This is extra practice. Your first-attempt assessment scores stay unchanged. Your latest revision response is saved.</p></div>`;
}
async function refresh() { results=course.getResults(); }
function openModule(id) {
  moduleId=id;
  const m=moduleState();
  if(!m?.available) return notice('Complete the previous module first.');
  if(m.completed) return show('recap');
  if(!m.lessonDone) return show('lesson');
  if(m.decisions===2) return show('recap');
  simulationIndex=m.decisions; show('practice');
}
function openQuiz(phase) {
  if(results?.[phase]) return show(phase==='pre'?'starting':'results');
  const draft=readDraft(phase);
  quizIndex=Math.max(0, content.assessments[phase].findIndex(q=>!draft[q.id]));
  show(phase);
}
async function act(action) {
  if(action==='restart') return show('restart');
  if(action==='start') {
    course.start(); await refresh(); openQuiz('pre');
  } else if(action==='pre') { if(!results) show('welcome'); else openQuiz('pre'); }
  else if(action==='post') openQuiz('post');
  else if(action.startsWith('module:')) openModule(action.split(':')[1]);
  else if(action.startsWith('revision:')) {moduleId=action.split(':')[1];retryRevision=false;show('revision');}
  else if(action==='finish-lesson') {course.acknowledgeLesson(moduleId);await refresh();openModule(moduleId);}
  else if(action==='complete-module') {course.completeModule(moduleId);await refresh();if(results.modules.every(m=>m.completed))openQuiz('post');else show('training');}
  else if(action==='next-decision') {if(simulationIndex===0){simulationIndex=1;show('practice');}else show('recap');}
  else if(action==='quiz-back') {quizIndex=Math.max(0,quizIndex-1);show(screen);}
  else if(action==='retry-revision') {retryRevision=true;show('revision');}
  else show(action);
}
document.addEventListener('click',async event=>{
  const target=event.target.closest('[data-action],[data-screen]');if(!target||busy||target.disabled)return;
  event.preventDefault();busy=true;target.disabled=true;
  try{await act(target.dataset.action||target.dataset.screen);}catch(err){notice(err.message);}
  finally{busy=false;if(target.isConnected)target.disabled=false;}
});
main.addEventListener('change',event=>{
  const form=event.target.closest('#assessment-form');if(!form)return;
  try { saveDraft(form.dataset.phase,{...readDraft(form.dataset.phase),...Object.fromEntries(new FormData(form))}); } catch(err) { notice(err.message); }
});
main.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const form=event.target;if(!form.reportValidity())return;
  const submit=form.querySelector('[type="submit"]');busy=true;submit.disabled=true;clearNotice();
  try {
    const values=new FormData(form);
    if(form.id==='assessment-form') {
      const phase=form.dataset.phase;
      const draft={...readDraft(phase),...Object.fromEntries(values)};saveDraft(phase,draft);
      if(quizIndex<5){quizIndex++;show(phase);}else {
        course.submitAssessment(phase,content.assessments[phase].map(q=>({questionId:q.id,choiceId:draft[q.id]})));
        await refresh();show(phase==='pre'?'starting':'results');
      }
    } else if(form.id==='simulation-form') {
      const q=scenario().steps[simulationIndex];
      course.submitDecision(moduleId,q.id,values.get(q.id));await refresh();show('practice');
    } else {
      const q=content.revisions[moduleId];course.revise(moduleId,values.get(q.id));await refresh();retryRevision=false;show('revision');
    }
  }catch(err){notice(err.message);}finally{busy=false;if(submit.isConnected)submit.disabled=false;}
});
async function init() {
  try {
    content=course.getContent(); await refresh();
    document.querySelector('#storage-note').textContent = course.persistent ? 'Progress is saved only in this browser. Clearing site data or switching devices starts a new journey.' : 'Browser storage is unavailable. You can complete the course, but progress lasts only in this open tab.';
    if(!results)show('welcome',false);
    else if(results.next==='pre')openQuiz('pre');
    else if(results.next==='training'){
      const next=results.modules.find(m=>!m.completed);
      if(next?.lessonDone)openModule(next.id);else show('training',false);
    }else if(results.next==='post')openQuiz('post');else show('results',false);
  }catch(err){main.innerHTML=`<h1>Let’s make a fresh start.</h1><p>${e(err.message)}</p>${button('Start a fresh journey in this browser','start')}`;}
}
init();
