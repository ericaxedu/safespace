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
  });
});

function closeModal(){
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
let quizIndex = 0;

function renderQuiz(){
  const item = quizQuestions[quizIndex];
  $('#quizQuestion').textContent = item.q;
  $('#quizProgress').textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  $('#progressBar').style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  $('#quizFeedback').className = 'quiz-feedback';
  $('#quizFeedback').textContent = '';
  $('#nextQuestion').hidden = true;
  $$('.answer-btn').forEach(btn => btn.classList.remove('selected'));
}
renderQuiz();

$$('.answer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.answer === 'true';
    const correct = choice === quizQuestions[quizIndex].a;
    $$('.answer-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const feedback = $('#quizFeedback');
    feedback.className = `quiz-feedback show ${correct ? 'correct' : 'incorrect'}`;
    feedback.textContent = `${correct ? 'Correct.' : 'Incorrect.'} ${quizQuestions[quizIndex].e}`;
    $('#nextQuestion').hidden = false;
  });
});

$('#nextQuestion').addEventListener('click', () => {
  quizIndex = (quizIndex + 1) % quizQuestions.length;
  renderQuiz();
});

const themeToggle = $('#themeToggle');
if (localStorage.getItem('safespace-theme') === 'dark') document.body.classList.add('dark');
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
  ['FAQ','#faq'],['References','#references']
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
