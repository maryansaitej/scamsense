// Pure browser-side course rules. No network, cookies, accounts or database service.
import { assessments, scenarios, categories, revisions, publicContent } from './content.js';

export function scoreAnswers(questions, answers) {
  if (!Array.isArray(answers) || answers.length !== questions.length || new Set(answers.map(a=>a?.questionId)).size !== questions.length) throw new Error('Answer every question once.');
  return questions.map(q=>{
    const a=answers.find(a=>a?.questionId===q.id);
    if(!a||!q.choices.some(c=>c.id===a.choiceId))throw new Error('Choose a valid response for every question.');
    return {questionId:q.id,choiceId:a.choiceId,correct:a.choiceId===q.correct,explanation:q.explanation};
  });
}
const freshState = () => ({ version:1, pre:null, post:null, simulations:[], milestones:{}, revisionPractice:[], drafts:{pre:{},post:{}} });
const clone = value => JSON.parse(JSON.stringify(value));
export function createCourse(storage, key='scamsense:pages:v1') {
  let memory=null;
  function load() {
    let raw;
    try { raw=storage?storage.getItem(key):memory; }
    catch { throw new Error('Your browser blocked access to saved progress. Allow site storage or start in another browser.'); }
    if(!raw)return null;
    try {
      const s=JSON.parse(raw);
      if(s.version!==1||!Array.isArray(s.simulations)||!Array.isArray(s.revisionPractice)||!s.milestones||!s.drafts||!s.drafts.pre||!s.drafts.post)throw Error();
      for(const phase of ['pre','post'])if(s[phase]!==null)scoreAnswers(assessments[phase],s[phase]);
      const ordered=scenarios.flatMap(s=>s.steps.map(q=>({scenarioId:s.id,...q})));
      if(s.simulations.length>6||(!s.pre&&s.simulations.length))throw Error();
      s.simulations.forEach((a,i)=>{const q=ordered[i];if(a.stepId!==q.id||a.scenarioId!==q.scenarioId||!q.choices.some(c=>c.id===a.choiceId))throw Error();});
      for(const [id,m]of Object.entries(s.milestones))if(!scenarios.some(s=>s.id===id)||typeof m.lessonDone!=='boolean'||typeof m.completed!=='boolean')throw Error();
      if(s.revisionPractice.some(a=>!Object.hasOwn(revisions,a.moduleId)||!revisions[a.moduleId].choices.some(c=>c.id===a.choiceId))||new Set(s.revisionPractice.map(a=>a.moduleId)).size!==s.revisionPractice.length)throw Error();
      if(s.post && (!s.pre||s.simulations.length!==6||scenarios.some(q=>!s.milestones[q.id]?.completed)))throw Error();
      return s;
    } catch { throw new Error('Saved progress could not be read. Start a fresh journey to reset this site’s progress in this browser.'); }
  }
  function save(s) {
    const value=JSON.stringify(s);
    try { if(storage)storage.setItem(key,value);else memory=value; }
    catch { throw new Error('Progress could not be saved. Your choices are still selected. Free some browser storage or allow site storage, then retry.'); }
  }
  function requireState(){const s=load();if(!s)throw new Error('Start a learning journey first.');return s;}
  function moduleStates(s){let previous=!!s.pre;return scenarios.map(q=>{
    const m=s.milestones[q.id]||{};const decisions=s.simulations.filter(a=>a.scenarioId===q.id).length;
    const result={id:q.id,lessonDone:!!m.lessonDone,completed:!!m.completed,available:previous,decisions};
    result.stage=result.completed?'complete':!result.lessonDone?'lesson':decisions<2?'practice':'recap';previous=result.completed;return result;
  });}
  function assessmentResult(s,phase){if(!s[phase])return null;const answers=scoreAnswers(assessments[phase],s[phase]);const correct=answers.filter(a=>a.correct).length;return {answers,correct,total:6,percentage:Math.round(correct/6*100)};}
  function results(){
    const s=load();if(!s)return null;
    const pre=assessmentResult(s,'pre'),post=assessmentResult(s,'post'),modules=moduleStates(s);
    return {pre,post,modules,improvement:pre&&post?post.percentage-pre.percentage:null,
      simulations:s.simulations.map(a=>{const q=scenarios.find(q=>q.id===a.scenarioId).steps.find(q=>q.id===a.stepId);return {...a,correct:a.choiceId===q.correct,explanation:q.explanation};}),
      revision:post?Object.keys(categories).filter(id=>assessments.post.some(q=>q.category===id&&!post.answers.find(a=>a.questionId===q.id).correct)):[],
      revisionPractice:s.revisionPractice.map(a=>({...a,correct:a.choiceId===revisions[a.moduleId].correct,explanation:revisions[a.moduleId].explanation})),
      next:!pre?'pre':modules.some(m=>!m.completed)?'training':!post?'post':'results'};
  }
  return {
    persistent:!!storage,
    getContent:()=>publicContent(), getResults:results,
    start(){save(freshState());return results();},
    getDraft(phase){if(!['pre','post'].includes(phase))throw new Error('Unknown quiz.');return clone(load()?.drafts[phase]||{});},
    saveDraft(phase,answers){const s=requireState();if(!['pre','post'].includes(phase))throw new Error('Unknown quiz.');for(const [id,choice]of Object.entries(answers)){const q=assessments[phase].find(q=>q.id===id);if(!q?.choices.some(c=>c.id===choice))throw new Error('Unknown quiz choice.');}s.drafts[phase]={...s.drafts[phase],...answers};save(s);},
    submitAssessment(phase,answers){
      const s=requireState();if(!['pre','post'].includes(phase))throw new Error('Unknown quiz.');
      if(phase==='post'&&moduleStates(s).some(m=>!m.completed))throw new Error('Complete all three module recaps first.');
      scoreAnswers(assessments[phase],answers);
      if(!s[phase]){s[phase]=answers.map(({questionId,choiceId})=>({questionId,choiceId}));s.drafts[phase]={};save(s);}
      return assessmentResult(s,phase);
    },
    acknowledgeLesson(id){const s=requireState(),m=moduleStates(s).find(m=>m.id===id);if(!m)throw new Error('Unknown module.');if(!m.available)throw new Error('Finish the baseline and previous module first.');s.milestones[id]={lessonDone:true,completed:m.completed};save(s);},
    submitDecision(id,stepId,choiceId){
      const s=requireState(),scenario=scenarios.find(q=>q.id===id),q=scenario?.steps.find(q=>q.id===stepId);
      if(!q?.choices.some(c=>c.id===choiceId))throw new Error('Choose a valid scenario response.');
      const existing=s.simulations.find(a=>a.stepId===stepId);if(existing)return results().simulations.find(a=>a.stepId===stepId);
      const m=moduleStates(s).find(m=>m.id===id);if(!m.available||!m.lessonDone)throw new Error('Review this module’s example first.');
      const ordered=scenarios.flatMap(s=>s.steps);if(ordered[s.simulations.length]?.id!==stepId)throw new Error('Complete the previous decision first.');
      s.simulations.push({scenarioId:id,stepId,choiceId});save(s);return results().simulations.find(a=>a.stepId===stepId);
    },
    completeModule(id){const s=requireState(),m=moduleStates(s).find(m=>m.id===id);if(!m?.available||!m.lessonDone||m.decisions!==2)throw new Error('Finish the worked example and both decisions first.');s.milestones[id]={lessonDone:true,completed:true};save(s);},
    revise(id,choiceId){const s=requireState(),q=Object.hasOwn(revisions,id)?revisions[id]:null;if(!q?.choices.some(c=>c.id===choiceId))throw new Error('Choose a valid revision response.');if(!s.post)throw new Error('Finish the final check before revision.');s.revisionPractice=s.revisionPractice.filter(a=>a.moduleId!==id);s.revisionPractice.push({moduleId:id,choiceId});save(s);return results().revisionPractice.find(a=>a.moduleId===id);}
  };
}
