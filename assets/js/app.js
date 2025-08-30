// ---------------------------
// Theme toggle with localStorage
// ---------------------------
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if ((savedTheme === 'dark') || (!savedTheme && prefersDark)) {
  root.classList.add('dark');
}
themeToggle?.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  if (window.lucide) lucide.createIcons();
});

// ---------------------------
// Mobile menu toggle
// ---------------------------
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// ---------------------------
// Dynamic year
// ---------------------------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------
// Fun facts random
// ---------------------------
const funfacts = [
  'I love building dashboards that reveal non-obvious patterns.',
  'My favorite charts: small multiples and ridgeline plots.',
  'I care about clean typography as much as model metrics.',
  'Team dark mode — always.'
];
document.getElementById('funfact').textContent = 'Fun fact: ' + funfacts[Math.floor(Math.random()*funfacts.length)];

// ---------------------------
// Projects fetch + render + search + filter + modal
// ---------------------------
const grid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
let PROJECTS = [];
let filtered = [];

function renderProjects(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  list.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card hover-expand group p-5';
    card.setAttribute('data-idx', String(idx));
    // Animasi AOS tiap card muncul dengan delay berbeda
    card.setAttribute('data-aos', 'zoom-in');
    card.setAttribute('data-aos-duration', '800');
    card.setAttribute('data-aos-delay', idx * 150); // delay bertahap

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-lg">${p.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full border">${p.categoryLabel}</span>
      </div>
      <p class="text-sm mt-2 line-clamp-3">${p.summary}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${p.tags.map(t=>`<span class="text-xs px-2 py-1 rounded-lg">${t}</span>`).join('')}
      </div>
      <div class="mt-4 flex items-center gap-4 text-sm">
        ${p.github ? `<a href="${p.github}" target="_blank" class="cta">GitHub</a>` : ''}
        ${p.demo ? `<a href="${p.demo}" target="_blank" class="cta">Live</a>` : ''}
      </div>
    `;
    card.addEventListener('click', (e) => { if(e.target.tagName === 'A') return; openModal(p); });
    grid.appendChild(card);
  });
}

function applyFilters() {
  const q = (searchInput.value || '').toLowerCase().trim();
  const cat = categoryFilter.value;
  filtered = PROJECTS.filter(p => {
    const matchesCat = (cat === 'all') || (p.category === cat);
    const matchesQ = !q || (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });
  renderProjects(filtered);
}

searchInput?.addEventListener('input', applyFilters);
categoryFilter?.addEventListener('change', applyFilters);

// ---------------------------
// Modal logic
// ---------------------------
const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');

function openModal(p) {
  modalContent.innerHTML = `
    <h3 class="text-2xl font-bold">${p.title}</h3>
    <p class="text-sm text-slate-500">${p.categoryLabel}</p>
    <p class="mt-2">${p.description}</p>
    <div class="mt-4 flex gap-3">
      ${p.github ? `<a class="px-4 py-2 rounded-xl" href="${p.github}" target="_blank">GitHub</a>` : ''}
      ${p.demo ? `<a class="px-4 py-2 rounded-xl border" href="${p.demo}" target="_blank">Live Demo</a>` : ''}
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}
function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
modalBackdrop?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// ---------------------------
// Fetch projects
// ---------------------------
fetch('assets/data/projects.json')
  .then(r=>r.json())
  .then(data => {
    PROJECTS = data.map(p=>({
      ...p,
      categoryLabel: ({'data-science':'Data Science','dashboard':'Dashboard','web':'Web','ml':'Machine Learning', 'iot':'Internet of Thing'}[p.category]||p.category)
    }));
    applyFilters();
  }).catch(()=>{ PROJECTS=[]; applyFilters(); });


// ---------------------------
// SKILL
// ---------------------------
const container = document.getElementById("skillsGrid");
const skills = [
  { name: "Python", logo: "assets/logos/python.png", whiteBg: false },
  { name: "SQL", logo: "assets/logos/sql.png", whiteBg: false },
  { name: "Power BI", logo: "assets/logos/powerbi.png", whiteBg: true },
  { name: "Statistics", logo: "assets/logos/statistics.png", whiteBg: false },
  { name: "Machine Learning", logo: "assets/logos/ml.png", whiteBg: false },
  { name: "Data Visualization", logo: "assets/logos/dataviz.png", whiteBg: false },
  { name: "Excel", logo: "assets/logos/excel.png", whiteBg: true },
  { name: "Tableau", logo: "assets/logos/tableau.png", whiteBg: false },
  { name: "R", logo: "assets/logos/r.png", whiteBg: false },
  { name: "Git & GitHub", logo: "assets/logos/github.png", whiteBg: false }
];


skills.forEach((skill, idx) => {
  const div = document.createElement("div");
  div.className = "flex flex-col items-center justify-center p-3 border rounded-xl hover:scale-105 hover:shadow-lg transition";
  div.setAttribute("data-aos", "zoom-in");
  div.setAttribute("data-aos-delay", idx * 100); // ✅ sekarang idx ada
  div.innerHTML = `
    <img src="${skill.logo}" alt="${skill.name}" class="w-12 h-12 mb-2 ${skill.whiteBg ? 'bg-white p-1 rounded' : ''}">
    <span class="font-medium text-center">${skill.name}</span>
  `;
  container.appendChild(div);
});




// ---------------------------
// Contact form handler
// ---------------------------
const contactForm = document.getElementById("contactForm");
const contactMsg = document.getElementById("contactMsg");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactMsg.classList.remove("hidden");
    contactForm.reset();

    setTimeout(() => {
      contactMsg.classList.add("hidden");
    }, 3000);
  });
}


// ---------------------------
// Experience toggler
// ---------------------------
const expBtns = document.querySelectorAll(".exp-btn");
const expContainer = document.getElementById("experienceContainer");

const EXPERIENCES = [
  { type:"work", title:"Intern", company:"Pemerintah Kota Surabaya", period:"Aug 2025 - Present", desc:"PROCUREMENT OF GOODS/SERVICES AND DEVELOPMENT ADMINISTRATION IN SURABAYA CITY" },
  { type:"org", title:"Member, Commission 2", organization:"BLM Fasilkom UPN Veteran Jawa Timur", period:"Jan 2024 - Dec 2024", desc:"Active member of Commission 2" },
  { type:"org", title:"Member, Human Resources", organization:"Veteran Robotic UPN Veteran Jawa Timur", period:"Dec 2024 - Present", desc:"Responsible for HR tasks and coordination" }
];

function renderExperience(type){
  expContainer.innerHTML = ""; // reset
  const filtered = EXPERIENCES.filter(e => e.type === type);
  if(filtered.length === 0){
    expContainer.classList.remove("timeline"); // hilangkan garis kalau kosong
    return;
  }
  expContainer.classList.add("timeline");

  filtered.forEach(exp => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <h3 class="font-semibold text-lg">${exp.title}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">${exp.company || exp.organization} — ${exp.period}</p>
      <p class="text-gray-700 dark:text-gray-300">${exp.desc}</p>
    `;
    expContainer.appendChild(div);

    // Delay sedikit untuk efek fade-in berurutan
    setTimeout(() => {
      div.classList.add("visible");
    }, 100);
  });
}

// Event tombol
expBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    expBtns.forEach(b=>{
      b.classList.remove("bg-accent-600","text-white");
      b.classList.add("bg-gray-200","text-gray-700","dark:bg-slate-800","dark:text-gray-300");
    });
    btn.classList.add("bg-accent-600","text-white");
    btn.classList.remove("bg-gray-200","text-gray-700","dark:bg-slate-800","dark:text-gray-300");

    renderExperience(btn.dataset.type);
  });
});

// Render default
renderExperience("work");


// Render awal Work
renderExperience("work");

// ---------------------------
// Scroll reveal elements with scroll direction
// ---------------------------
const scrollElements = document.querySelectorAll('.scroll-reveal');
let lastScrollTop = 0;

if (scrollElements.length > 0) {
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
  };

  const displayScrollElement = el => el.classList.add('visible');
  const hideScrollElement = el => el.classList.remove('visible');

  const handleScrollAnimation = () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = st > lastScrollTop;
    lastScrollTop = st <= 0 ? 0 : st;

    scrollElements.forEach(el => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el); // muncul saat terlihat
      } else {
        if (scrollingDown) hideScrollElement(el); // hilang saat scroll ke bawah
        else displayScrollElement(el);             // muncul saat scroll ke atas
      }
    });
  };

  window.addEventListener('scroll', handleScrollAnimation);
  window.addEventListener('load', handleScrollAnimation); // jalankan sekali saat load
}
