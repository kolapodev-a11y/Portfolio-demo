# Kolapo Victor — Recruiter-Optimized Portfolio

A cleaned-up, recruiter-friendly portfolio for **Kolapo Victor**, a junior full-stack web developer focused on **React, JavaScript, Node.js, MongoDB, SQL, responsive UI, and accessibility**.

## What changed

This version was optimized to improve first impressions for recruiters and hiring managers:

- stronger headline and role positioning
- clearer value proposition in the hero section
- better project storytelling and stronger case-study style project copy
- downloadable **one-page resume** included in the repo
- clearer contact paths for email, phone, WhatsApp, LinkedIn, GitHub, and resume download
- improved recruiter-focused sections like "Why Hire Me" and "Recruiter Assets"
- local project images included in `images/optimized/`
- updated README so visitors understand what the project does, why it matters, and how to run it

## Live portfolio sections

- Hero / value proposition
- About / technical stack
- Strengths / why hire me
- Featured projects
- Resume download section
- Contact form and direct contact links

## File structure

```text
Peezutech_portfolio/
├── index.html
├── style.css
├── app.js
├── api/
│   └── contact.js
├── assets/
│   └── Kolapo_Victor_Resume_One_Page_2026.pdf
├── images/
│   └── optimized/
│       ├── land.webp
│       ├── port.webp
│       ├── ecomm.webp
│       ├── blog.webp
│       ├── quiz.webp
│       └── peezuhub.webp
├── resume/
│   └── index.html
├── robots.txt
└── sitemap.xml
```

## Why this version is better for job search

Recruiters usually scan a portfolio very quickly. This version helps them understand these things fast:

1. **What role Kolapo is targeting**
2. **Which technologies he can actually work with**
3. **What proof of work exists**
4. **How to contact him or download the resume**

## Running locally

Because the contact form posts to `/api/contact`, the best experience is to run the site from a local server or deploy it.

### Option 1: simple local preview

If you only want to preview the static pages, open a local server in the project folder.

### Option 2: deploy to Vercel

This repo already includes a Vercel-style serverless contact endpoint at `api/contact.js`.

Add these environment variables in Vercel:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (optional)
- `CONTACT_SUBJECT_PREFIX` (optional)

## Contact form notes

The form uses **Resend** through the serverless function in `api/contact.js`.
If sending fails, the interface falls back to opening the user’s default email app.

## Resume asset

The one-page resume lives at:

- `assets/Kolapo_Victor_Resume_One_Page_2026.pdf`
- `resume/index.html`

## Suggested next improvements

- add a custom domain email for extra professionalism
- add 1 to 2 short project walkthrough videos or GIFs
- add a GitHub profile README for job search visibility
- publish private repos publicly when possible, or add short case-study writeups for them
- tailor the resume slightly for frontend-heavy roles vs full-stack roles

## Maintainer

**Kolapo Victor**  
Portfolio: https://www.peezutech.name.ng/  
GitHub: https://github.com/kolapodev-a11y  
LinkedIn: https://www.linkedin.com/in/kolapo-ofobutu-b68892382
