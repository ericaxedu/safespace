const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const navLinks = $$('.nav-link');
const sections = $$('main section[id]');
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

navLinks.forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold: 0.12});
$$('.reveal').forEach(el => observer.observe(el));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, {rootMargin:'-25% 0px -65% 0px'});
sections.forEach(section => sectionObserver.observe(section));

$$('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});

$$('.faq-item button').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});

$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    $(`#${tab.dataset.tab}`)?.classList.add('active');
  });
});

const modalData = {
  physical: {
    title: 'Physical violence',
    body: 'Physical violence includes acts such as hitting, pushing, restraining, or causing physical injury. A person does not need to wait for severe injury before seeking support.',
    tip: 'Supportive response: move toward safety when possible, contact a trusted person, and seek appropriate help.'
  },
  sexual: {
    title: 'Sexual violence',
    body: 'Sexual violence includes sexual acts, contact, or conduct without free and informed consent. Consent should be voluntary, informed, and ongoing.',
    tip: 'Supportive response: avoid blame. Respect the person’s choices and help them reach appropriate support.'
  },
  emotional: {
    title: 'Emotional or psychological abuse',
    body: 'Emotional abuse may include threats, humiliation, intimidation, repeated insults, manipulation, or behavior intended to control another person.',
    tip: 'Supportive response: listen, validate the person’s experience, and help them connect with trusted support.'
  },
  economic: {
    title: 'Economic abuse',
    body: 'Economic abuse involves controlling access to money, work, property, education, or other resources as a way to control another person.',
    tip: 'Supportive response: help the person identify safe access to documents, trusted contacts, and support services.'
  },
  online: {
    title: 'Online or digital harassment',
    body: 'Online harassment includes harmful digital conduct such as threats, unwanted sexual remarks, non-consensual image sharing, cyberstalking, and other conduct covered by applicable law.',
    tip: 'Supportive response: save evidence when safe, review privacy settings, block or report abusive accounts, and seek appropriate help.'
  },
  stalking: {
    title: 'Stalking and harassment',
    body: 'Stalking involves repeated unwanted visual or physical proximity, non-consensual communication, or related conduct that causes fear for safety or emotional distress.',
    tip: 'Supportive response: document incidents when safe and seek support from trusted people or appropriate authorities.'
  }
};

const modal = $('#infoModal');
const modalTitle = $('#modalTitle');
const modalBody = $('#modalBody');
const modalTip = $('#modalTip');

$$('.info-card').forEach(card => {
  card.addEventListener('click', () => {
    const data = modalData[card.dataset.modal];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.textContent = data.body;
    modalTip.textContent = data.tip;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    lastFocus = document.activeElement; $('#modalClose')?.focus();
  });
});

let lastFocus;
function closeModal(){
  lastFocus?.focus();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
$('#modalClose')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const quizQuestions = [
  {q:'Gender-based violence only happens inside the home.', a:false, e:'False. Gender-related violence and harassment also occur in public places, schools, workplaces, online spaces, and other settings.'},
  {q:'Online harassment is also a form of gender-related harm.', a:true, e:'True. Philippine law addresses gender-based online sexual harassment, including specified unwanted sexual remarks, threats, image sharing without consent, and cyberstalking.'},
  {q:'Victims are responsible for the violence committed against them.', a:false, e:'False. Responsibility for abusive or violent conduct belongs to the person who commits it. Victim-blaming is harmful and should be avoided.'},
  {q:'Bystanders have a role in promoting safer communities.', a:true, e:'True. Bystanders can support people, interrupt unsafe situations when appropriate, report concerns, and connect people with help.'},
  {q:'Consent should be voluntary and ongoing.', a:true, e:'True. Consent is not created by pressure, threats, manipulation, or force.'},
  {q:'Protecting personal information is part of online safety.', a:true, e:'True. Strong passwords, privacy settings, careful sharing, and account security help protect personal information.'}
];
let quizIndex = 0, score = 0, answered = false;
const lastQ = quizQuestions.length - 1;

function renderQuiz(){
  const item = quizQuestions[quizIndex];
  $('#quizResult').hidden = true;
  $('.answer-grid').hidden = false;
  $('#quizQuestion').textContent = item.q;
  $('#quizProgress').textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  $('#progressBar').style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  $('#quizFeedback').className = 'quiz-feedback';
  $('#quizFeedback').textContent = '';
  $('#nextQuestion').hidden = true;
  answered = false;
  $$('.answer-btn').forEach(btn => { btn.classList.remove('selected'); btn.disabled = false; });
}
renderQuiz();

$$('.answer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const correct = (btn.dataset.answer === 'true') === quizQuestions[quizIndex].a;
    if (correct) score++;
    $$('.answer-btn').forEach(b => { b.classList.remove('selected'); b.disabled = true; });
    btn.classList.add('selected');
    const feedback = $('#quizFeedback');
    feedback.className = `quiz-feedback show ${correct ? 'correct' : 'incorrect'}`;
    feedback.textContent = `${correct ? 'Correct.' : 'Incorrect.'} ${quizQuestions[quizIndex].e}`;
    const next = $('#nextQuestion');
    next.textContent = quizIndex === lastQ ? 'See my score →' : 'Next question →';
    next.hidden = false;
    next.focus();
  });
});

$('#nextQuestion').addEventListener('click', () => {
  if (quizIndex < lastQ) { quizIndex++; renderQuiz(); return; }
  const msg = score === quizQuestions.length ? 'Excellent. You are ready to help build safer spaces.' : score >= 4 ? 'Great work. Review the explanations you missed and keep learning.' : 'A good start. Explore the sections above and try again.';
  $('.answer-grid').hidden = true;
  $('#quizFeedback').className = 'quiz-feedback';
  $('#nextQuestion').hidden = true;
  $('#quizQuestion').textContent = 'Quiz complete';
  const res = $('#quizResult');
  res.innerHTML = `<strong>${score} / ${quizQuestions.length}</strong><p>${msg}</p><button class="next-btn" id="quizRestart" type="button">Try again</button> <a class="text-link" href="#pledge">Make a pledge →</a>`;
  res.hidden = false;
  $('#quizRestart').addEventListener('click', () => { quizIndex = 0; score = 0; renderQuiz(); });
});

const themeToggle = $('#themeToggle');
let savedTheme = null;
try { savedTheme = localStorage.getItem('safespace-theme'); } catch(e) {}
if (savedTheme === 'dark' || (!savedTheme && matchMedia('(prefers-color-scheme: dark)').matches)) document.body.classList.add('dark');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('safespace-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

const searchToggle = $('#searchToggle');
const searchPanel = $('#searchPanel');
const searchInput = $('#siteSearch');
const searchResults = $('#searchResults');
searchToggle?.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) searchInput.focus();
});

const searchIndex = [
  ['About Gender-Based Violence','#about'],['Physical violence','#forms'],['Sexual violence','#forms'],['Emotional abuse','#forms'],
  ['Economic abuse','#forms'],['Online harassment','#forms'],['Stalking','#warning'],['Warning signs','#warning'],['Safety at home','#safety'],
  ['Public safety','#safety'],['School safety','#safety'],['Workplace safety','#safety'],['Online safety','#safety'],['Statistics','#statistics'],
  ['RA 9262','#laws'],['RA 7877','#laws'],['RA 11313 Safe Spaces Act','#laws'],['Myth or Fact Quiz','#quiz'],['Help and Resources','#resources'],
  ['Take Action pledge','#pledge'],['RA 9710 Magna Carta of Women','#laws'],['RA 8353 Anti-Rape Law','#laws'],['RA 9995 voyeurism','#laws'],['FAQ','#faq'],['References','#references']
];

function updateSearch(){
  const term = searchInput.value.trim().toLowerCase();
  if (!term) { searchResults.innerHTML = ''; return; }
  const matches = searchIndex.filter(([label]) => label.toLowerCase().includes(term)).slice(0,8);
  searchResults.innerHTML = matches.length
    ? matches.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')
    : '<span>No matching section found.</span>';
  $$('#searchResults a').forEach(a => a.addEventListener('click', () => searchPanel.classList.remove('open')));
}
searchInput?.addEventListener('input', updateSearch);
$('#clearSearch')?.addEventListener('click', () => { searchInput.value=''; updateSearch(); searchInput.focus(); });

const backTop = $('#backTop');
window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 500));
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// Scroll progress bar
const prog = $('#scrollProgress');
const updateProgress = () => { const d = document.documentElement; prog.style.width = `${(d.scrollTop / Math.max(d.scrollHeight - d.clientHeight, 1)) * 100}%`; };
window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

// Accessibility: expanded state for accordions and FAQ
$$('.accordion-btn, .faq-item button').forEach(b => {
  b.setAttribute('aria-expanded', 'false');
  b.addEventListener('click', () => b.setAttribute('aria-expanded', b.closest('.open') ? 'true' : 'false'));
});

// Animated statistics
const countObs = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  countObs.unobserve(e.target);
  const el = e.target, t = el.textContent, n = parseFloat(t.replace(/,/g, ''));
  const dec = (t.split('.')[1] || '').replace(/\D/g, '').length, suf = t.replace(/[\d.,]/g, '');
  if (isNaN(n) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = performance.now();
  (function step(now){
    const p = Math.min((now - start) / 1100, 1), v = n * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec}) + suf;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}), {threshold: .6});
$$('.data-card strong').forEach(el => countObs.observe(el));

// Pledge card
const pledgeCard = $('#pledgeCard');
let pledge = null;
$('#pledgeMake')?.addEventListener('click', () => {
  const items = $$('#pledge input[type=checkbox]:checked').map(c => c.value);
  pledgeCard.innerHTML = '';
  if (!items.length) { pledgeCard.innerHTML = '<p class="pledge-empty">Select at least one commitment to create your card.</p>'; return; }
  pledge = {name: $('#pledgeName').value.trim() || 'A SafeSpace supporter', items};
  const mk = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };
  const ul = document.createElement('ul');
  items.forEach(i => ul.appendChild(mk('li', i)));
  const row = document.createElement('div'); row.className = 'pledge-actions';
  const dl = mk('button', 'Download image', 'outline-btn'), cp = mk('button', 'Copy text', 'outline-btn');
  dl.type = cp.type = 'button';
  dl.addEventListener('click', downloadPledge);
  cp.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(`${pledge.name}'s pledge (SafeSpace PH)\n` + pledge.items.map(i => '- ' + i).join('\n')); cp.textContent = 'Copied!'; }
    catch(e) { cp.textContent = 'Copy not supported'; }
  });
  row.append(dl, cp);
  pledgeCard.append(mk('span', 'SAFESPACE PH PLEDGE', 'pledge-kicker'), mk('h3', `${pledge.name}'s pledge`), ul, row);
});

function downloadPledge(){
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, '#70429a'); g.addColorStop(1, '#2c2047');
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  const wrap = (text, px, y, maxW, lh) => {
    let line = '';
    text.split(' ').forEach(w => { const t = line + w + ' '; if (x.measureText(t).width > maxW && line) { x.fillText(line, px, y); line = w + ' '; y += lh; } else line = t; });
    x.fillText(line, px, y); return y + lh;
  };
  x.fillStyle = '#e5cff2'; x.font = '700 34px Arial, sans-serif'; x.fillText('SAFESPACE PH PLEDGE', 90, 130);
  x.fillStyle = '#fff'; x.font = 'italic 700 70px Georgia, serif';
  let y = wrap(`${pledge.name}'s pledge`, 90, 260, 900, 82) + 30;
  x.font = '500 40px Arial, sans-serif';
  pledge.items.forEach(i => { y = wrap('✓  ' + i, 90, y, 900, 54) + 22; });
  x.fillStyle = '#e5cff2'; x.font = 'italic 36px Georgia, serif';
  x.fillText('Know the signs. Protect yourself. Support others.', 90, 1250);
  c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'safespace-pledge.png'; a.click(); URL.revokeObjectURL(a.href); });
}
