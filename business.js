const businessModels=[
 {id:'service',icon:'🎨',name:'Skill Service',desc:'Sell a skill directly: design, editing, tutoring or freelancing.',cash:0,demand:45,margin:85,risk:20},
 {id:'digital',icon:'📦',name:'Digital Product',desc:'Build once, sell repeatedly: templates, guides or small tools.',cash:0,demand:35,margin:95,risk:35},
 {id:'resell',icon:'🛍️',name:'Reselling',desc:'Source low, sell higher. Faster market feedback, but needs working capital.',cash:800,demand:55,margin:35,risk:50}
];

const businessEvents=[
 {title:'First 10 customers',text:'People are interested, but most say your offer feels too generic.',choices:[
  {t:'Niche down to one clear customer',s:'Make the offer more specific.',fx:{demand:14,brand:10,cash:150,stress:2},xp:18,out:'Clearer positioning increases conversion.'},
  {t:'Lower the price heavily',s:'Try to win on affordability.',fx:{demand:8,brand:-4,cash:80,stress:4},xp:11,out:'You gain attention, but train customers to expect cheap pricing.'},
  {t:'Add more features',s:'Make the offer look bigger.',fx:{demand:3,brand:2,cash:-100,stress:10},xp:9,out:'More features increase work before proving what customers actually value.'}
 ]},
 {title:'A competitor appears',text:'Someone launches a similar offer with better presentation.',choices:[
  {t:'Improve the customer experience',s:'Keep the core offer, make delivery noticeably better.',fx:{demand:9,brand:15,cash:-120,stress:4},xp:17,out:'Differentiation through experience protects you from pure price competition.'},
  {t:'Copy their features quickly',s:'Close the gap fast.',fx:{demand:5,brand:-5,cash:-80,stress:9},xp:10,out:'You reduce the visible gap, but become reactive.'},
  {t:'Ignore them and talk to customers',s:'Find what buyers actually care about.',fx:{demand:12,brand:8,cash:30,stress:1},xp:19,out:'Customer evidence gives you a stronger response than competitor anxiety.'}
 ]},
 {title:'Cash gets tight',text:'Growth is happening, but your available cash is nearly gone.',choices:[
  {t:'Cut low-value expenses',s:'Protect runway without touching the core product.',fx:{cash:350,demand:-2,brand:0,stress:-3},xp:18,out:'Runway improves while the customer experience stays mostly intact.'},
  {t:'Spend more on promotion',s:'Try to grow out of the problem.',fx:{cash:-250,demand:18,brand:4,stress:8},xp:13,out:'Aggressive growth can work, but it makes a cash problem more dangerous.'},
  {t:'Pause expansion and sell manually',s:'Do direct outreach before spending again.',fx:{cash:220,demand:10,brand:5,stress:5},xp:20,out:'Manual selling gives cash and information at the same time.'}
 ]},
 {title:'Customers ask for something new',text:'Several buyers request the same add-on.',choices:[
  {t:'Pre-sell it before building',s:'Validate willingness to pay first.',fx:{cash:260,demand:10,brand:9,stress:2},xp:20,out:'Pre-selling reduces product risk and funds development.'},
  {t:'Build it immediately',s:'Move fast while interest is high.',fx:{cash:-180,demand:12,brand:8,stress:9},xp:14,out:'Speed helps, but you commit resources before confirming payment.'},
  {t:'Say no and stay focused',s:'Protect simplicity.',fx:{cash:20,demand:-3,brand:3,stress:-5},xp:13,out:'Focus stays strong, though you may leave a validated opportunity unexplored.'}
 ]},
 {title:'A growth opportunity',text:'A creator offers to promote you, but wants a share of every sale they generate.',choices:[
  {t:'Agree with tracked commission',s:'Pay only when sales happen.',fx:{cash:420,demand:20,brand:13,stress:3},xp:20,out:'Performance-based distribution limits downside and expands reach.'},
  {t:'Pay a fixed fee upfront',s:'Keep all future revenue.',fx:{cash:-300,demand:16,brand:10,stress:6},xp:11,out:'You keep upside, but carry the acquisition risk yourself.'},
  {t:'Decline and keep organic growth',s:'Stay independent.',fx:{cash:100,demand:3,brand:4,stress:-2},xp:12,out:'You preserve control, but growth remains slower.'}
 ]}
];

let biz={model:null,round:0,cash:0,demand:0,brand:25,stress:10,revenue:0,xp:0,log:[]};
function openBusiness(){biz={model:null,round:0,cash:0,demand:0,brand:25,stress:10,revenue:0,xp:0,log:[]};const s=document.getElementById('businessSim');s.classList.add('open');s.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderBizStart()}
function closeBusiness(){const s=document.getElementById('businessSim');s.classList.remove('open');s.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function renderBizStart(){document.getElementById('businessStep').textContent='START';document.getElementById('businessContent').innerHTML=`<article class="biz-card glass"><p class="biz-kicker">FOUNDER MODE</p><h2>Start with almost nothing.</h2><p class="subtle">Choose a business model. The simulation rewards customer evidence, cash discipline and smart risk — not just aggressive growth.</p></article><div class="biz-options">${businessModels.map(m=>`<button class="biz-option" data-model="${m.id}"><b>${m.icon} ${m.name}</b><small>${m.desc}</small></button>`).join('')}</div>`;document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>startBusiness(b.dataset.model)))}
function startBusiness(id){const m=businessModels.find(x=>x.id===id);biz.model=m;biz.cash=m.cash;biz.demand=m.demand;biz.brand=25;biz.stress=10;biz.round=0;biz.log.push(`Started ${m.name}`);renderBizEvent()}
function bizStats(){return `<div class="biz-dashboard"><div class="biz-metric"><span>CASH</span><b>₹${Math.max(0,biz.cash)}</b></div><div class="biz-metric"><span>DEMAND</span><b>${Math.max(0,biz.demand)}</b></div><div class="biz-metric"><span>BRAND</span><b>${Math.max(0,biz.brand)}</b></div><div class="biz-metric"><span>STRESS</span><b>${Math.max(0,biz.stress)}</b></div></div>`}
function renderBizEvent(){if(biz.round>=businessEvents.length)return renderBizSummary();const e=businessEvents[biz.round];document.getElementById('businessStep').textContent=`${biz.round+1} / ${businessEvents.length}`;document.getElementById('businessContent').innerHTML=`${bizStats()}<article class="biz-event glass"><p class="biz-kicker">${biz.model.icon} ${biz.model.name.toUpperCase()}</p><h3>${e.title}</h3><p class="subtle">${e.text}</p></article><div class="biz-options">${e.choices.map((c,i)=>`<button class="biz-option" data-bizchoice="${i}"><b>${c.t}</b><small>${c.s}</small></button>`).join('')}</div>`;document.querySelectorAll('[data-bizchoice]').forEach(b=>b.addEventListener('click',()=>chooseBiz(Number(b.dataset.bizchoice))))}
function chooseBiz(i){const e=businessEvents[biz.round],c=e.choices[i];Object.entries(c.fx).forEach(([k,v])=>biz[k]=(biz[k]||0)+v);const sales=Math.max(0,Math.round((biz.demand*(biz.model.margin/100))*3));biz.revenue+=sales;biz.cash+=sales;biz.xp+=c.xp;biz.log.push(`${e.title}: ${c.t}`);document.getElementById('businessContent').innerHTML=`${bizStats()}<article class="biz-result glass"><strong>${c.out}</strong><span class="subtle">Round revenue: ₹${sales} · +${c.xp} XP</span></article><button id="bizNext" class="primary-action">Continue →</button>`;document.getElementById('bizNext').addEventListener('click',()=>{biz.round++;renderBizEvent()})}
function renderBizSummary(){document.getElementById('businessStep').textContent='RESULT';const score=Math.max(0,Math.round(biz.cash/25+biz.demand+biz.brand-biz.stress));const grade=score>=180?'A':score>=140?'B':score>=100?'C':'D';const label=grade==='A'?'Evidence-Driven Founder':grade==='B'?'Adaptive Builder':grade==='C'?'Promising Operator':'Learning Founder';document.getElementById('businessContent').innerHTML=`<article class="biz-card glass"><p class="biz-kicker">SIMULATION COMPLETE</p><div class="biz-grade">${grade}</div><h2>${label}</h2><p class="subtle">You finished with ₹${Math.max(0,biz.cash)} cash and ₹${biz.revenue} simulated revenue. Your choices show how you balance growth, evidence and runway.</p><div class="biz-summary-grid"><div><span>DEMAND</span><b>${Math.max(0,biz.demand)}</b></div><div><span>BRAND</span><b>${Math.max(0,biz.brand)}</b></div><div><span>STRESS</span><b>${Math.max(0,biz.stress)}</b></div><div><span>XP EARNED</span><b>${biz.xp}</b></div></div><button id="finishBusiness" class="primary-action">Collect XP & return</button></article><div class="biz-log">${biz.log.map(x=>`<div>${x}</div>`).join('')}</div>`;document.getElementById('finishBusiness').addEventListener('click',finishBusiness)}
function finishBusiness(){state.totalXP+=biz.xp;state.stats.FIN=Math.min(100,state.stats.FIN+3);state.stats.DISC=Math.min(100,state.stats.DISC+1);save();render();closeBusiness();toast(`Business Sim +${biz.xp} XP · FIN increased`)}

document.querySelectorAll('.module-card').forEach(card=>{if(card.dataset.module==='Business Sim')card.addEventListener('click',e=>{e.stopImmediatePropagation();openBusiness()},true)});document.getElementById('closeBusiness').addEventListener('click',closeBusiness);