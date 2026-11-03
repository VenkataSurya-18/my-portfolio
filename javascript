/* ===== Helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Theme toggle (remembers choice) ===== */
const root = document.documentElement;
const themeBtn = $('#themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.innerHTML = `<i class="fa-solid fa-${t === 'dark' ? 'moon' : 'sun'}"></i>`;
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ===== Mobile menu ===== */
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ===== Typing animation ===== */
const roles = ['Python Developer', 'Backend Developer', 'AI/ML Enthusiast'];
const typed = $('#typed');
let r = 0, c = 0, del = false;
function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1500); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 80);
}
if (reduceMotion) typed.textContent = roles[0]; else type();

/* ===== Scroll reveal, skill bars, stat counters ===== */
function countUp(el) {
  const end = +el.dataset.count;
  if (reduceMotion) { el.textContent = end + '+'; return; }
  let n = 0;
  const step = Math.max(1, Math.ceil(end / 50));
  const t = setInterval(() => {
    n = Math.min(end, n + step);
    el.textContent = n + (n === end ? '+' : '');
    if (n === end) clearInterval(t);
  }, 30);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    $$('.bar', el).forEach(b => b.style.setProperty('--w', b.dataset.level + '%'));
    $$('[data-count]', el).forEach(countUp);
    io.unobserve(el);
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* ===== Project filter ===== */
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(x => x.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.f;
  $$('.proj').forEach(p => { p.hidden = f !== 'all' && p.dataset.cat !== f; });
}));

/* ===== Contact form validation ===== */
const form = $('#form');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address, like you@example.com.',
  msg: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};
function check(id) {
  const input = $('#' + id);
  const res = rules[id](input.value);
  $('#e-' + id).textContent = res === true ? '' : res;
  input.setAttribute('aria-invalid', res !== true);
  return res === true;
}
Object.keys(rules).forEach(id => $('#' + id).addEventListener('blur', () => check(id)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const valid = Object.keys(rules).map(check).every(Boolean);
  if (!valid) return;
  // Demo only: connect to Formspree/Netlify Forms here to receive real messages.
  form.reset();
  $('#ok').hidden = false;
  setTimeout(() => { $('#ok').hidden = true; }, 6000);
});

/* ===== Footer year ===== */
$('#yr').textContent = new Date().getFullYear();