const concernData = {
  clarity: { label: 'For breakout-prone days', name: 'Clarity, without the stripping.', text: 'A barrier-first pairing that clears the noise, then keeps hydration close.', footer: 'Niacinamide + gentle cleansing', link: '/products/moisturizing-gel-oily-skin', color: '#1834ac' },
  glow: { label: 'For your glow era', name: 'Brighten the pace, not the pressure.', text: 'A fresh, vitamin-forward reset designed to make your everyday cleanse feel like a beginning.', footer: 'Vitamin C + everyday ritual', link: '/products/vitamin-c-face-wash', color: '#d47a3c' },
  shield: { label: 'For daily exposure', name: 'Make protection the easy part.', text: 'A featherlight sunscreen step that lets you get on with your day—no white cast, no compromise.', footer: 'SPF 50+ + hydration', link: '/products/aqua-sunscreen-gel-spf-50-pa-3plus', color: '#265dc5' },
  even: { label: 'For uneven-looking tone', name: 'Care for every chapter of your skin.', text: 'A considered brightening step to pair with patient, gentle consistency.', footer: 'Brightening care + barrier support', link: '/products/ocevia-skin-brightening-cream', color: '#995492' }
};

const details = {
  protection: { number: '01 / PROTECTION', title: 'A wearable layer of defence.', text: 'Broad-spectrum SPF 50+ with a weightless gel texture—made to make daily protection an easy yes.' },
  hydration: { number: '02 / HYDRATION', title: 'Hydration that plays well with sunlight.', text: 'Hyaluronic Acid keeps the formula comfortable and the finish supple-feeling through the day.' },
  finish: { number: '03 / FINISH', title: 'The kind of invisible you notice.', text: 'The aqua-gel finish disappears fast, so daily sunscreen feels good on the skin, not just on paper.' }
};

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

document.querySelectorAll('.concern').forEach(button => {
  button.addEventListener('click', () => {
    const data = concernData[button.dataset.concern];
    document.querySelectorAll('.concern').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
    button.classList.add('active'); button.setAttribute('aria-selected', 'true');
    document.getElementById('matchLabel').textContent = data.label;
    document.getElementById('matchName').textContent = data.name;
    document.getElementById('matchText').textContent = data.text;
    document.getElementById('matchFooter').textContent = data.footer;
    document.getElementById('matchLink').href = data.link;
    document.getElementById('matchCard').style.background = data.color;
  });
});

document.querySelectorAll('.hotspot').forEach(button => {
  button.addEventListener('click', () => {
    const data = details[button.dataset.detail];
    document.querySelectorAll('.hotspot').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    document.getElementById('detailNumber').textContent = data.number;
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailText').textContent = data.text;
  });
});

const model = document.getElementById('productModel');
const rotation = document.getElementById('rotation');
function setRotation(value) { model.style.setProperty('--turn', `${value}deg`); rotation.value = value; }
rotation.addEventListener('input', event => setRotation(event.target.value));
document.getElementById('formulaStage').addEventListener('pointermove', event => {
  if (window.matchMedia('(pointer: fine)').matches && event.buttons === 1) {
    const rect = event.currentTarget.getBoundingClientRect();
    setRotation(Math.max(-28, Math.min(28, ((event.clientX - rect.left) / rect.width - .5) * 58)));
  }
});

const prices = { cleanser: 341, treat: 476, moisturize: 338, protect: 489 };
const routineLinks = {
  cleanser: '/products/vitamin-c-face-wash',
  treat: '/products/ocevia-skin-brightening-cream',
  moisturize: '/products/moisturizing-gel-oily-skin',
  protect: '/products/aqua-sunscreen-gel-spf-50-pa-3plus'
};
function updateRoutine() {
  const selected = [...document.querySelectorAll('.routine-step.selected')];
  const total = selected.reduce((sum, step) => sum + prices[step.dataset.product], 0);
  const count = selected.length;
  document.getElementById('routineCount').textContent = `${count}-step ${document.querySelector('.time-switch .active').dataset.time === 'AM' ? 'morning' : 'evening'} ritual`;
  document.getElementById('routinePrice').textContent = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('routineAdvice').textContent = count === 0 ? 'Choose one small step to start.' : count === 1 ? 'A beautiful beginning. Add a step when you’re ready.' : 'A simple, barrier-friendly edit for everyday consistency.';
  document.getElementById('cartCount').textContent = count;
}
document.querySelectorAll('.routine-step').forEach(step => step.addEventListener('click', () => {
  step.classList.toggle('selected');
  step.setAttribute('aria-pressed', step.classList.contains('selected'));
  step.querySelector('.step-add').textContent = step.classList.contains('selected') ? '✓' : '+';
  updateRoutine();
}));
document.querySelectorAll('.time-switch button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.time-switch button').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); updateRoutine();
}));
document.getElementById('saveRoutine').addEventListener('click', () => {
  const selected = [...document.querySelectorAll('.routine-step.selected')];
  if (!selected.length) return showToast('Choose at least one ritual step first.');
  const firstProduct = selected[0].dataset.product;
  showToast(`Your ${selected.length}-step ritual is ready. Opening the first product…`);
  setTimeout(() => window.open(routineLinks[firstProduct], '_blank', 'noopener'), 700);
});

const compareRange = document.getElementById('compareRange');
const beforeLayer = document.getElementById('beforeLayer');
const compareHandle = document.querySelector('.compare-slider b');
function updateCompare(value) { beforeLayer.style.width = `${value}%`; compareHandle.style.left = `${value}%`; }
compareRange.addEventListener('input', event => updateCompare(event.target.value));

const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
searchToggle.addEventListener('click', () => { searchPanel.hidden = !searchPanel.hidden; if (!searchPanel.hidden) document.getElementById('siteSearch').focus(); });
document.getElementById('siteSearch').addEventListener('input', event => {
  document.getElementById('searchGo').href = `/search?q=${encodeURIComponent(event.target.value)}`;
});
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!open)); menuToggle.classList.toggle('active', !open); mobileNav.hidden = open; });
document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.classList.remove('active'); }));

document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.reset(); showToast('You’re on the SKINAA list. See you soon.'); });
