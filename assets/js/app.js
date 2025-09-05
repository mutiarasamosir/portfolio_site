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
// Fun Fact Generator
// ---------------------------
const funFacts = [
  "I once debugged for 6 hours only to realize it was a missing semicolon",
  "Big fan of clean dashboards and minimalist design",
  "Can drink 3 cups of coffee and still fall asleep",
  "Currently exploring deep learning for forecasting",
  "Love mixing data analysis with storytelling",
  'I love building dashboards that reveal non-obvious patterns.',
  'My favorite charts: small multiples and ridgeline plots.',
  'I care about clean typography as much as model metrics.',
  'Team dark mode — always.'
];

function showFunFact() {
  const span = document.getElementById("funfact");
  if (!span) return;
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  span.textContent = fact;
}

// tampilkan saat load
document.addEventListener("DOMContentLoaded", showFunFact);


// ---------------------------
// Projects fetch + render + modal (pakai Swiper)
// ---------------------------
const grid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
let PROJECTS = [];
let filtered = [];
let swiper; // simpan instance swiper

// Render project cards ke Swiper
function renderProjects(list) {
  projectsGrid.innerHTML = '';
  if (!list.length) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  list.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = `
      swiper-slide rounded-2xl 
      bg-white dark:bg-slate-800 
      border border-slate-200 dark:border-slate-700 
      shadow-md hover:shadow-xl 
      transform transition-all duration-300 hover:scale-105 
      overflow-hidden flex flex-col cursor-pointer
    `;

    card.innerHTML = `
      <div class="h-40 bg-slate-200 dark:bg-slate-700">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">` : ''}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">${p.title}</h3>
          <span class="text-xs px-2 py-1 rounded-full border">${p.categoryLabel}</span>
        </div>
        <p class="text-sm mt-2 text-slate-600 dark:text-slate-300 line-clamp-3">${p.summary}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${p.tags.map(t => `<span class="text-xs px-2 py-1 rounded-lg bg-accent-100 dark:bg-accent-500/20">${t}</span>`).join('')}
        </div>
        <div class="mt-4">
          <button class="text-accent-600 hover:underline text-sm see-more-btn">See More →</button>
        </div>
      </div>
    `;

    // 1) Klik tombol See More → buka modal
    card.querySelector('.see-more-btn').addEventListener('click', (e) => {
      e.stopPropagation(); // biar gak dobel trigger
      openModal(p, idx);
    });

    // 2) Klik di seluruh card → buka modal
    card.addEventListener('click', (e) => {
      // kalau klik link jangan buka modal
      if (e.target.tagName === 'A' || e.target.classList.contains('see-more-btn')) return;
      openModal(p, idx);
    });

    projectsGrid.appendChild(card);
  });

  swiper.update();
}


  // init / update Swiper
  if (swiper) swiper.destroy();
  swiper = new Swiper("#projectsSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  });


// ---------------------------
// Apply Filters (search + category)
// ---------------------------
function applyFilters() {
  const q = (searchInput.value || '').toLowerCase().trim();
  const cat = categoryFilter.value;
  filtered = PROJECTS.filter(p => {
    const matchesCat = (cat === 'all') || (p.category === cat);
    const matchesQ = !q || (
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.join(' ').toLowerCase().includes(q)
    );
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
    ${p.image ? `<img src="${p.image}" alt="${p.title}" class="rounded-xl w-full h-60 object-cover mb-4">` : ''}
    <h3 class="text-2xl font-bold">${p.title}</h3>
    <p class="text-sm text-slate-500 mb-3">${p.categoryLabel}</p>
    <p class="mt-2 text-slate-600 dark:text-slate-300">${p.description}</p>
    <div class="mt-4 flex gap-3">
      ${p.github ? `<a class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800" href="${p.github}" target="_blank">GitHub</a>` : ''}
      ${p.demo ? `<a class="px-4 py-2 rounded-xl border" href="${p.demo}" target="_blank">Live Demo</a>` : ''}
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
modalBackdrop?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---------------------------
// Fetch projects.json
// ---------------------------
fetch('assets/data/projects.json')
  .then(r => r.json())
  .then(data => {
    PROJECTS = data.map(p => ({
      ...p,
      categoryLabel: ({
        'data-science': 'Data Science',
        'dashboard': 'Dashboard',
        'web': 'Web',
        'ml': 'Machine Learning',
        'iot': 'Internet of Things'
      }[p.category] || p.category)
    }));
    applyFilters();
  })
  .catch(() => { PROJECTS = []; applyFilters(); });

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
  {
    type: "work",
    title: "Intern",
    company: "Pemerintah Kota Surabaya",
    period: "Aug 2025 - Present",
    desc: "Supporting procurement and administration for Surabaya City. Streamlined document workflow and improved reporting efficiency."
  },
  {
    type: "org",
    title: "Member, Commission 2",
    organization: "BLM Fasilkom UPN Veteran Jawa Timur",
    period: "Jan 2024 - Dec 2024",
    desc: "Actively contributed to legislative activities, drafted policy recommendations, and coordinated student representation."
  },
  {
    type: "org",
    title: "Human Resources Member",
    organization: "Veteran Robotic UPN Veteran Jawa Timur",
    period: "Dec 2024 - Present",
    desc: "Handled HR coordination, recruitment, and internal training sessions to strengthen team development."
  }
];

function renderExperience(type) {
  expContainer.innerHTML = "";
  const filtered = EXPERIENCES.filter(e => e.type === type);

  if (!filtered.length) {
    expContainer.innerHTML = `<p class="text-center text-slate-500 dark:text-slate-400">No experiences available.</p>`;
    return;
  }

  filtered.forEach((exp, idx) => {
    const div = document.createElement("div");
    div.className = "relative pl-6";

    div.innerHTML = `
      <!-- Dot timeline -->
      <span class="absolute -left-3 top-2 w-5 h-5 rounded-full bg-accent-600 border-4 border-white dark:border-slate-900"></span>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm hover:shadow-md transition">
        <h3 class="font-semibold text-lg text-accent-600">${exp.title}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
          ${exp.company || exp.organization} • <span class="italic">${exp.period}</span>
        </p>
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${exp.desc}</p>
      </div>
    `;

    // Animasi masuk (fade + slide)
    div.style.opacity = 0;
    div.style.transform = "translateY(20px)";
    setTimeout(() => {
      div.style.transition = "all 0.5s ease";
      div.style.opacity = 1;
      div.style.transform = "translateY(0)";
    }, idx * 150);

    expContainer.appendChild(div);
  });
}

// Event filter
expBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    expBtns.forEach(b => {
      b.classList.remove("bg-accent-600","text-white");
      b.classList.add("bg-gray-200","text-gray-700","dark:bg-slate-800","dark:text-gray-300");
    });
    btn.classList.add("bg-accent-600","text-white");
    btn.classList.remove("bg-gray-200","text-gray-700","dark:bg-slate-800","dark:text-gray-300");

    renderExperience(btn.dataset.type);
  });
});

// Default tampil Work
renderExperience("work");


// ---------------------------
// Load Blogs (Swiper version)
// ---------------------------
async function loadBlogs() {
  try {
    const res = await fetch("assets/data/blogs.json");
    const blogs = await res.json();
    const blogGrid = document.getElementById("blogGrid");
    blogGrid.innerHTML = "";

    blogs.forEach((b, idx) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide card hover-expand overflow-hidden rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 shadow";
      slide.setAttribute("data-aos", "fade-up");
      slide.setAttribute("data-aos-delay", b.delay || idx * 100);

      slide.innerHTML = `
        ${b.image ? `<div class="h-48 overflow-hidden"><img src="${b.image}" alt="${b.title}" class="w-full h-full object-cover"></div>` : ''}
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-lg mt-2">${b.title}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">${b.excerpt}</p>
          <a href="${b.url}" target="_blank" class="mt-4 px-4 py-2 rounded-xl bg-accent-600 text-white hover:brightness-110 transition text-sm text-center">Read More</a>
        </div>
      `;
      blogGrid.appendChild(slide);
    });

    // Init Swiper
    new Swiper(".blogSwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  } catch (err) {
    console.error("Error loading blogs:", err);
  }
}

loadBlogs();

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
