# Personal Portfolio Website

A responsive, interactive, and elegant portfolio site for showcasing projects, with dark mode, search & filter, modal details, animated sections, and a skills radar chart.

## 🚀 Features
- TailwindCSS (CDN) + custom CSS
- Dark/Light mode with localStorage
- Projects grid loaded from `assets/data/projects.json`
- Search + category filter
- Modal with project detail
- AOS scroll animations
- Chart.js radar for skills
- Fully responsive & accessible-ish (semantic headings, labels, alt text)
- Easy to deploy on GitHub Pages or Vercel

## 🧰 Quick Start
1. Open `index.html` locally to preview.
2. Edit `assets/data/projects.json` to add your projects.
3. Replace contact links and hero content.
4. Deploy:
   - **GitHub Pages**: push the folder to a new repo, enable Pages → `main` branch, `/root`.
   - **Vercel/Netlify**: import the repo and deploy as static site.

## 📝 Customize
- Colors & fonts via Tailwind config in `<head>`.
- Skills values in `assets/js/app.js` (Chart.js section).
- Add blog cards in `#blogGrid` or wire to a Markdown generator later.

Enjoy!
