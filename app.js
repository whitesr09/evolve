const STORAGE_KEY = 'evolve-v01';

const defaultState = {
  theme: 'dark',
  totalXP: 0,
  streak: 0,
  completed: [],
  stats: {
    INT: 12,
    CHA: 10,
    STR: 8,
    FIN: 9,
    DISC: 11,
    FOCUS: 13,
    SOC: 10
  }
};

const quests = [
  { id:'study', icon:'📚', title:'Deep study', desc:'Study with full focus for 30 minutes', xp:40, stat:'INT', boost:3 },
  { id:'speak', icon:'🗣️', title:'Speak English', desc:'Practice speaking for 10 minutes', xp:30, stat:'CHA', boost:3 },
  { id:'move', icon:'🏃', title:'Move your body', desc:'Walk, stretch or exercise for 20 minutes', xp:35, stat:'STR', boost:3 },
  { id:'focus', icon:'🎯', title:'No-distraction sprint', desc:'Complete one 25-minute focus session', xp:35, stat:'FOCUS', boost:3 },
  { id:'social', icon:'🤝', title:'Social rep', desc:'Start one real conversation today', xp:45, stat:'SOC', boost:4 }
];

const statMeta = {
  INT:['🧠','Knowledge'], CHA:['🗣️','Communication'], STR:['💪','Strength'], FIN:['💰','Finance'], DISC:['⚡','Discipline'], FOCUS:['🎯','Focus'], SOC:['🤝','Social']
};

let state = loadState();

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...structuredClone(defaultState), ...saved, stats:{...defaultState.stats,...saved.stats} } : structuredClone(defaultState);
  } catch { return structuredClone(defaultState); }
}

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function levelInfo(totalXP){
  let level = 1, used = totalXP, need = 100;
  while(used >= need){ used -= need; level++; need = 100 + (level-1)*35; }
  const titles = ['Awakening','Builder','Explorer','Momentum','Pathfinder','Operator','Vanguard','Ascendant'];
  const title = titles[Math.min(titles.length-1, Math.floor((level-1)/2))];
  return {level, current:used, need, title};
}

function rankFor(level){
  if(level >= 15) return 'Elite';
  if(level >= 10) return 'Advanced';
  if(level >= 6) return 'Rising';
  if(level >= 3) return 'Builder';
  return 'Rookie';
}

function render(){
  const info = levelInfo(state.totalXP);
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'dark' ? '#070b14' : '#edf3ff');
  document.getElementById('themeToggle').textContent = state.theme === 'dark' ? '☀︎' : '☾';
  document.getElementById('level').textContent = info.level;
  document.getElementById('levelTitle').textContent = info.title;
  document.getElementById('xpText').textContent = `${info.current} / ${info.need} XP`;
  document.getElementById('xpBar').style.width = `${Math.min(100,(info.current/info.need)*100)}%`;
  document.getElementById('totalXP').textContent = state.totalXP;
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('rankBadge').textContent = rankFor(info.level);
  renderStats();
  renderQuests();
}

function renderStats(){
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = Object.entries(state.stats).map(([key,value]) => {
    const [icon,label] = statMeta[key];
    return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${icon} ${key}</span><span class="stat-value">${value}</span></div><small class="subtle">${label}</small><div class="stat-bar"><i style="width:${Math.min(value,100)}%"></i></div></article>`;
  }).join('');
}

function renderQuests(){
  const list = document.getElementById('questList');
  const completedCount = quests.filter(q => state.completed.includes(q.id)).length;
  document.getElementById('questCount').textContent = `${completedCount}/${quests.length}`;
  list.innerHTML = quests.map(q => {
    const done = state.completed.includes(q.id);
    return `<article class="quest ${done?'done':''}"><div class="quest-icon">${q.icon}</div><div><h4>${q.title}</h4><small>${q.desc} · +${q.xp} XP</small></div><button data-quest="${q.id}" ${done?'disabled':''}>${done?'✓':'DONE'}</button></article>`;
  }).join('');
  list.querySelectorAll('[data-quest]').forEach(btn => btn.addEventListener('click', () => completeQuest(btn.dataset.quest)));
}

function completeQuest(id){
  if(state.completed.includes(id)) return;
  const q = quests.find(x => x.id === id);
  if(!q) return;
  const beforeLevel = levelInfo(state.totalXP).level;
  state.completed.push(id);
  state.totalXP += q.xp;
  state.stats[q.stat] = Math.min(100, state.stats[q.stat] + q.boost);
  if(state.completed.length === 1) state.streak = Math.max(1,state.streak);
  save(); render();
  const afterLevel = levelInfo(state.totalXP).level;
  toast(afterLevel > beforeLevel ? `LEVEL UP — ${afterLevel} ⚡` : `+${q.xp} XP · ${q.stat} increased`);
}

function toast(message){
  const el = document.getElementById('toast');
  el.textContent = message; el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark'; save(); render();
});

document.querySelectorAll('.module-card').forEach(card => card.addEventListener('click', () => toast(`${card.dataset.module} · coming in the next build`)));

document.getElementById('playBtn').addEventListener('click', () => {
  document.querySelector('.modules-grid').scrollIntoView({behavior:'smooth',block:'center'});
  toast('Choose a training zone');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if(confirm('Reset EVOLVE progress on this device?')){
    state = structuredClone(defaultState); save(); render(); toast('Progress reset');
  }
});

render();
