const STORAGE_KEY = 'evolve-v01';

const defaultState = {
  theme: 'dark', totalXP: 0, streak: 0, completed: [], decisionSessions: 0,
  decisionProfile: { logic: 0, risk: 0, empathy: 0, initiative: 0 },
  stats: { INT:12, CHA:10, STR:8, FIN:9, DISC:11, FOCUS:13, SOC:10 }
};

const quests = [
  { id:'study', icon:'📚', title:'Deep study', desc:'Study with full focus for 30 minutes', xp:40, stat:'INT', boost:3 },
  { id:'speak', icon:'🗣️', title:'Speak English', desc:'Practice speaking for 10 minutes', xp:30, stat:'CHA', boost:3 },
  { id:'move', icon:'🏃', title:'Move your body', desc:'Walk, stretch or exercise for 20 minutes', xp:35, stat:'STR', boost:3 },
  { id:'focus', icon:'🎯', title:'No-distraction sprint', desc:'Complete one 25-minute focus session', xp:35, stat:'FOCUS', boost:3 },
  { id:'social', icon:'🤝', title:'Social rep', desc:'Start one real conversation today', xp:45, stat:'SOC', boost:4 }
];

const statMeta = { INT:['🧠','Knowledge'], CHA:['🗣️','Communication'], STR:['💪','Strength'], FIN:['💰','Finance'], DISC:['⚡','Discipline'], FOCUS:['🎯','Focus'], SOC:['🤝','Social'] };

const decisionScenarios = [
  {
    context:'You are leading a college presentation. Thirty minutes before it starts, the campus Wi‑Fi dies. One teammate is panicking and another says to wait because it may come back.',
    question:'What do you do first?',
    choices:[
      {title:'Start troubleshooting the Wi‑Fi yourself',sub:'You know enough networking to test the obvious failure points.',traits:{logic:2,initiative:3,risk:1},xp:14,titleOut:'You take control quickly',text:'Fast ownership can save the presentation, but the downside is tunnel vision if the problem is outside your reach.'},
      {title:'Ask what has already been tried, then divide tasks',sub:'One person troubleshoots while another prepares an offline backup.',traits:{logic:3,initiative:2,empathy:1},xp:18,titleOut:'You create parallel paths',text:'You reduce duplicate work and protect the main goal even if the technical fix fails.'},
      {title:'Immediately switch to a backup presentation plan',sub:'Ignore the network and protect the deadline.',traits:{logic:2,risk:-1,initiative:2},xp:15,titleOut:'You prioritize certainty',text:'This protects delivery, though you may abandon a fix that was actually quick and possible.'},
      {title:'Wait a few minutes before acting',sub:'The Wi‑Fi may recover on its own.',traits:{risk:-2,initiative:-1},xp:8,titleOut:'You preserve effort, but lose time',text:'Waiting avoids unnecessary work, but under a hard deadline it gives away your most valuable resource: time.'}
    ]
  },
  {
    context:'You are offered two fresher jobs. Job A pays more, is stable and repetitive. Job B pays less but gives you freedom to build, experiment and learn quickly.',
    question:'Which path do you choose right now?',
    choices:[
      {title:'Take Job A and build skills or savings on the side',sub:'Stability first, optionality later.',traits:{logic:3,risk:-1,initiative:1},xp:17,titleOut:'You choose strategic stability',text:'You protect your financial base while keeping a future exit open. The risk is becoming too comfortable to leave.'},
      {title:'Take Job B and bet on growth',sub:'Accept lower pay for a steeper learning curve.',traits:{risk:3,initiative:3,logic:1},xp:18,titleOut:'You optimize for upside',text:'You gain faster exposure and ownership, but your runway and stress tolerance matter more.'},
      {title:'Reject both and start your own thing',sub:'Maximum independence from day one.',traits:{risk:4,initiative:4,logic:-1},xp:14,titleOut:'You choose maximum autonomy',text:'High agency can create outsized growth, but without runway the pressure can distort good decisions.'},
      {title:'Delay and keep searching for a perfect third option',sub:'Avoid committing until the fit feels obvious.',traits:{risk:-2,initiative:-2,logic:1},xp:8,titleOut:'You keep optionality, but risk paralysis',text:'More information can help, but indefinite searching often hides fear of committing.'}
    ]
  },
  {
    context:'Two talented teammates strongly disagree on how to complete a project. Both are confident. The deadline is close and the rest of the team is getting distracted by the conflict.',
    question:'How do you handle it?',
    choices:[
      {title:'Let both present evidence, then choose one approach',sub:'Make the decision based on practicality and time.',traits:{logic:3,empathy:1,initiative:2},xp:18,titleOut:'You turn conflict into comparison',text:'You preserve both voices while forcing the debate toward evidence and execution.'},
      {title:'Combine both ideas into a compromise',sub:'Try to keep everyone satisfied.',traits:{empathy:3,logic:1,risk:1},xp:13,titleOut:'You protect harmony',text:'Compromise can preserve morale, but mixed solutions are not automatically better solutions.'},
      {title:'Choose the stronger person and move on',sub:'Speed matters more than consensus.',traits:{initiative:3,empathy:-1,risk:2},xp:13,titleOut:'You optimize for speed',text:'Fast decisions prevent drift, but ignoring the losing side can damage trust and hide useful information.'},
      {title:'Let them settle it themselves',sub:'Avoid becoming the referee.',traits:{initiative:-2,empathy:1,risk:1},xp:7,titleOut:'You avoid over-managing',text:'Autonomy is useful, but unresolved conflict can consume the whole team when time is already scarce.'}
    ]
  },
  {
    context:'A friend suddenly starts replying dryly. Nothing obvious happened. You feel tempted to assume they are upset with you.',
    question:'What is your next move?',
    choices:[
      {title:'Ask directly, but calmly, if something is wrong',sub:'Give them an easy way to answer honestly.',traits:{empathy:3,initiative:2,risk:1},xp:18,titleOut:'You seek clarity without drama',text:'Direct communication reduces mind-reading while still respecting the other person’s space.'},
      {title:'Match their energy and become distant too',sub:'Protect yourself before you look needy.',traits:{empathy:-1,risk:-1,initiative:-1},xp:8,titleOut:'You protect pride, not information',text:'Mirroring distance can feel safe, but it can create a conflict that did not originally exist.'},
      {title:'Give them time and observe before reacting',sub:'One dry conversation may mean nothing.',traits:{logic:2,empathy:2,risk:-1},xp:16,titleOut:'You avoid premature conclusions',text:'Observation is useful when evidence is weak, as long as patience does not become avoidance.'},
      {title:'Ask mutual friends what is happening',sub:'Gather information indirectly.',traits:{logic:1,initiative:1,empathy:-1},xp:10,titleOut:'You gather context indirectly',text:'You may learn something useful, but involving others can distort a private situation.'}
    ]
  },
  {
    context:'You have a small but promising idea for making money online. You have no budget, limited equipment, and no proof anyone will pay for it yet.',
    question:'What do you do this week?',
    choices:[
      {title:'Build the smallest free version and show it to real people',sub:'Test demand before adding features.',traits:{logic:3,initiative:3,risk:1},xp:20,titleOut:'You test reality early',text:'A small real test gives better information than weeks of private planning.'},
      {title:'Spend the week researching until the idea is fully planned',sub:'Reduce uncertainty before showing anything.',traits:{logic:2,risk:-2,initiative:-1},xp:10,titleOut:'You reduce uncertainty, slowly',text:'Research can sharpen the idea, but customer feedback is usually the information you cannot simulate alone.'},
      {title:'Post everywhere immediately and try to sell the idea first',sub:'Validate with attention before building.',traits:{risk:3,initiative:4,logic:1},xp:17,titleOut:'You validate demand aggressively',text:'Pre-selling can be powerful, but vague promises can create pressure before you know what you can deliver.'},
      {title:'Drop it because you do not have money to start properly',sub:'Wait until your resources improve.',traits:{risk:-3,initiative:-3},xp:5,titleOut:'You avoid financial risk completely',text:'Protecting scarce resources matters, but zero-budget tests often exist even when a full launch does not.'}
    ]
  }
];

let state = loadState();
let labIndex = 0;
let sessionScores = { logic:0, risk:0, empathy:0, initiative:0 };
let sessionXP = 0;

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...structuredClone(defaultState), ...saved, stats:{...defaultState.stats,...saved.stats}, decisionProfile:{...defaultState.decisionProfile,...saved.decisionProfile} } : structuredClone(defaultState);
  } catch { return structuredClone(defaultState); }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function levelInfo(totalXP){ let level=1,used=totalXP,need=100; while(used>=need){used-=need;level++;need=100+(level-1)*35} const titles=['Awakening','Builder','Explorer','Momentum','Pathfinder','Operator','Vanguard','Ascendant']; return {level,current:used,need,title:titles[Math.min(titles.length-1,Math.floor((level-1)/2))]}; }
function rankFor(level){ if(level>=15)return'Elite'; if(level>=10)return'Advanced'; if(level>=6)return'Rising'; if(level>=3)return'Builder'; return'Rookie'; }

function render(){
  const info=levelInfo(state.totalXP); document.documentElement.dataset.theme=state.theme;
  document.querySelector('meta[name="theme-color"]').setAttribute('content',state.theme==='dark'?'#070b14':'#edf3ff');
  document.getElementById('themeToggle').textContent=state.theme==='dark'?'☀︎':'☾';
  document.getElementById('level').textContent=info.level; document.getElementById('levelTitle').textContent=info.title;
  document.getElementById('xpText').textContent=`${info.current} / ${info.need} XP`; document.getElementById('xpBar').style.width=`${Math.min(100,(info.current/info.need)*100)}%`;
  document.getElementById('totalXP').textContent=state.totalXP; document.getElementById('streak').textContent=state.streak; document.getElementById('rankBadge').textContent=rankFor(info.level);
  renderStats(); renderQuests();
}
function renderStats(){ const grid=document.getElementById('statsGrid'); grid.innerHTML=Object.entries(state.stats).map(([key,value])=>{const[icon,label]=statMeta[key];return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${icon} ${key}</span><span class="stat-value">${value}</span></div><small class="subtle">${label}</small><div class="stat-bar"><i style="width:${Math.min(value,100)}%"></i></div></article>`}).join(''); }
function renderQuests(){ const list=document.getElementById('questList'); const count=quests.filter(q=>state.completed.includes(q.id)).length; document.getElementById('questCount').textContent=`${count}/${quests.length}`; list.innerHTML=quests.map(q=>{const done=state.completed.includes(q.id);return `<article class="quest ${done?'done':''}"><div class="quest-icon">${q.icon}</div><div><h4>${q.title}</h4><small>${q.desc} · +${q.xp} XP</small></div><button data-quest="${q.id}" ${done?'disabled':''}>${done?'✓':'DONE'}</button></article>`}).join(''); list.querySelectorAll('[data-quest]').forEach(btn=>btn.addEventListener('click',()=>completeQuest(btn.dataset.quest))); }
function completeQuest(id){ if(state.completed.includes(id))return; const q=quests.find(x=>x.id===id); if(!q)return; const before=levelInfo(state.totalXP).level; state.completed.push(id);state.totalXP+=q.xp;state.stats[q.stat]=Math.min(100,state.stats[q.stat]+q.boost);if(state.completed.length===1)state.streak=Math.max(1,state.streak);save();render();const after=levelInfo(state.totalXP).level;toast(after>before?`LEVEL UP — ${after} ⚡`:`+${q.xp} XP · ${q.stat} increased`); }
function toast(message){ const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),1800); }

function openDecisionLab(){ labIndex=0;sessionXP=0;sessionScores={logic:0,risk:0,empathy:0,initiative:0}; document.getElementById('decisionLab').classList.add('open');document.getElementById('decisionLab').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderScenario(); }
function closeDecisionLab(){ document.getElementById('decisionLab').classList.remove('open');document.getElementById('decisionLab').setAttribute('aria-hidden','true');document.body.style.overflow=''; }
function renderScenario(){ const s=decisionScenarios[labIndex];document.getElementById('labProgress').textContent=`${labIndex+1} / ${decisionScenarios.length}`;document.getElementById('scenarioContext').textContent=s.context;document.getElementById('scenarioQuestion').textContent=s.question;document.getElementById('decisionResult').hidden=true;document.getElementById('decisionSummary').hidden=true;const letters=['A','B','C','D'];const list=document.getElementById('choicesList');list.hidden=false;list.innerHTML=s.choices.map((c,i)=>`<button class="choice-btn" data-choice="${i}"><span class="choice-letter">${letters[i]}</span><span><b>${c.title}</b><small>${c.sub}</small></span></button>`).join('');list.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>chooseDecision(Number(btn.dataset.choice))));document.querySelector('.lab-screen').scrollTo({top:0,behavior:'smooth'}); }
function chooseDecision(choiceIndex){ const choice=decisionScenarios[labIndex].choices[choiceIndex]; Object.entries(choice.traits).forEach(([k,v])=>sessionScores[k]+=v); sessionXP+=choice.xp; document.getElementById('choicesList').hidden=true;document.getElementById('resultTitle').textContent=choice.titleOut;document.getElementById('resultText').textContent=choice.text;document.getElementById('resultTraits').innerHTML=Object.entries(choice.traits).map(([k,v])=>`<span class="trait-pill">${k.toUpperCase()} ${v>0?'+':''}${v}</span>`).join('');document.getElementById('decisionResult').hidden=false; }
function nextDecision(){ if(labIndex<decisionScenarios.length-1){labIndex++;renderScenario()}else showDecisionSummary(); }
function showDecisionSummary(){ document.getElementById('choicesList').hidden=true;document.getElementById('decisionResult').hidden=true;document.getElementById('decisionSummary').hidden=false;const ranked=Object.entries(sessionScores).sort((a,b)=>b[1]-a[1]);const top=ranked[0][0];const labels={logic:['Strategic Thinker','You naturally look for structure, trade-offs and practical outcomes.'],risk:['Bold Operator','You are comfortable moving before certainty is complete.'],empathy:['People-Aware Navigator','You weigh human impact and relationships heavily in your decisions.'],initiative:['High-Agency Builder','Your instinct is to act, own the problem and create momentum.']};document.getElementById('profileLabel').textContent=labels[top][0];document.getElementById('profileSummary').textContent=labels[top][1]+` This session earned ${sessionXP} XP.`;const max=Math.max(1,...Object.values(sessionScores).map(v=>Math.max(0,v)));document.getElementById('profileBars').innerHTML=Object.entries(sessionScores).map(([k,v])=>`<div class="profile-bar-line"><span>${k.toUpperCase()}</span><div class="profile-meter"><i style="width:${Math.max(4,Math.max(0,v)/max*100)}%"></i></div><b>${v}</b></div>`).join('');document.querySelector('.lab-screen').scrollTo({top:0,behavior:'smooth'}); }
function finishDecisionLab(){ const before=levelInfo(state.totalXP).level; state.totalXP+=sessionXP;state.decisionSessions+=1;Object.entries(sessionScores).forEach(([k,v])=>state.decisionProfile[k]=(state.decisionProfile[k]||0)+v);state.stats.INT=Math.min(100,state.stats.INT+2);state.stats.DISC=Math.min(100,state.stats.DISC+1);save();render();closeDecisionLab();const after=levelInfo(state.totalXP).level;toast(after>before?`LEVEL UP — ${after} ⚡`:`Decision Lab +${sessionXP} XP`); }

document.getElementById('themeToggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';save();render()});
document.querySelectorAll('.module-card').forEach(card=>card.addEventListener('click',()=>card.dataset.module==='Decision Lab'?openDecisionLab():toast(`${card.dataset.module} · coming in the next build`)));
document.getElementById('playBtn').addEventListener('click',()=>{document.querySelector('.modules-grid').scrollIntoView({behavior:'smooth',block:'center'});toast('Choose a training zone')});
document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Reset EVOLVE progress on this device?')){state=structuredClone(defaultState);save();render();toast('Progress reset')}});
document.getElementById('closeLab').addEventListener('click',closeDecisionLab);document.getElementById('nextScenario').addEventListener('click',nextDecision);document.getElementById('finishLab').addEventListener('click',finishDecisionLab);

render();
