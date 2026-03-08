// ============================================================
// KOLAPO VICTOR — React Portfolio (CDN-based, no npm needed)
// Works by opening index.html directly in a browser
// ============================================================

const { useState, useEffect, useRef } = React;

// ── DATA ─────────────────────────────────────────────────────
const SKILLS = [
  { icon: "🌐", name: "HTML5", level: "Expert" },
  { icon: "🎨", name: "CSS3", level: "Expert" },
  { icon: "⚡", name: "JavaScript", level: "Advanced" },
  { icon: "⚛️", name: "React", level: "Intermediate" },
  { icon: "🟢", name: "Node.js", level: "Intermediate" },
  { icon: "📱", name: "Responsive Design", level: "Expert" },
  { icon: "🗄️", name: "MongoDB", level: "Intermediate" },
  { icon: "🛢️", name: "SQL", level: "Intermediate" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Landing Page Website",
    description:
      "A responsive business landing page website built with REACT, featuring modern design and smooth animations.",
    tech: ["REACT"],
    image: "images/land.jpg",
    live: "https://landing-page-demo-mu-six.vercel.app/",
    github: "https://github.com/victorkolapo84-code/Landing-page-demo",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "A mobile-first portfolio website with interactive elements and optimized performance across all devices including a light and darkmode toggle option.",
    tech: ["REACT"],
    image: "images/port.jpg",
    live: "https://portfolio-demo-rosy-ten.vercel.app/",
    github: "#",
  },
  {
    id: 3,
    title: "E-commerce Website",
    description:
      "A fully functional e-commerce platform with product browsing, cart management, a streamlined checkout experience, and SEO optimization.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js (Express)", "MongoDB", "Payment Integration"],
    image: "images/ecomm.jpg",
    live: "https://fortunehub.name.ng",
    github: "https://www.linkedin.com/in/kolapo-ofobutu-b68892382",
  },
  {
    id: 4,
    title: "Blog Website",
    description:
      "A responsive blog website built with HTML, CSS, and JavaScript, featuring modern design and smooth navigation.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "images/blog.jpg",
    live: "https://kpzblogwebsite.netlify.app/",
    github: "https://github.com/victorkolapo84-code/My-Blog-site",
  },
  {
    id: 5,
    title: "Quiz Website",
    description:
      "An interactive quiz application designed to test knowledge with various categories and instant feedback.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "images/quiz.jpg",
    live: "https://koleepeezuquiz.name.ng",
    github: "#",
  },
];

// ── THEME HELPERS ────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
}

function getInitialTheme() {
  // Default to LIGHT to fix the “too dark/black” look.
  try {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  } catch (e) {
    return "light";
  }
}

// ── TYPED TEXT HOOK ──────────────────────────────────────────
function useTypedText(texts, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
    setDisplay(current.substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
}

// ── REVEAL ON SCROLL HOOK ────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── TOAST ────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const icon = type === "success" ? "✅" : "❌";
  return (
    <div className={`toast ${type}`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// ── THEME TOGGLE UI ──────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? "🌙" : "☀️"}
      </span>
      <span className="theme-toggle-text">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────
function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "about", "projects", "contact"];
      let current = "home";
      sections.forEach((s) => {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 120) current = s;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = ["home", "about", "projects", "contact"];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          <span className="nav-logo" onClick={() => scrollTo("home")}>
            &lt;Peezutech /&gt;
          </span>

          <ul className="nav-links">
            {links.map((l) => (
              <li key={l}>
                <a
                  href={`#${l}`}
                  className={activeSection === l ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(l);
                  }}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#contact"
                className="nav-cta"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
              >
                Hire Me
              </a>
            </li>

            <li className="nav-theme">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </li>
          </ul>

          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="mobile-menu-top">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        {links.map((l) => (
          <a
            key={l}
            href={`#${l}`}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(l);
            }}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
        <a
          href="#contact"
          className="mobile-hire"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("contact");
          }}
        >
          Hire Me →
        </a>
      </div>
    </>
  );
}

// ── HERO ─────────────────────────────────────────────────────
function Hero() {
  const typed = useTypedText([
    "Fullstack Web Developer",
    "React Developer",
    "UI/UX Enthusiast",
    "Problem Solver",
  ]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-grid-bg" />
      <div className="hero-container">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="dot" />
            Available for new projects
          </div>

          <h1 className="hero-title">
            Hello, I'm <span className="name">Kolapo Victor</span>
          </h1>

          <h2 className="hero-subtitle">
            {typed}
            <span className="typed-cursor">|</span>
          </h2>

          <p className="hero-description">
            I create beautiful, responsive websites and web applications that bring ideas to life —
            with clean code and modern design.
          </p>

          <div className="hero-buttons">
            <a
              href="#projects"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("projects");
              }}
            >
              🚀 View My Work
            </a>
            <a
              href="#contact"
              className="btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
            >
              💬 Get In Touch
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="profile-ring">
            <div className="profile-inner">👨‍💻</div>
            <div className="floating-badge badge-1">
              ⚛️ <strong>React</strong>
            </div>
            <div className="floating-badge badge-2">
              🟢 <strong>Node.js</strong>
            </div>
            <div className="floating-badge badge-3">
              🌐 <strong>Fullstack</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll down</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────
function About() {
  useReveal();
  return (
    <section id="about" className="about">
      <div className="section-header reveal">
        <div className="section-tag">Who I Am</div>
        <h2 className="section-title">
          About <span>Me</span>
        </h2>
      </div>

      <div className="about-grid">
        <div className="about-text-block reveal">
          <p>
            I'm a <strong>passionate web developer</strong> with hands-on experience building modern,
            responsive websites and full-stack web applications. I love turning complex problems into
            simple, beautiful designs.
          </p>
          <p>
            From crafting pixel-perfect UIs with <strong>React</strong>, HTML and CSS, to building robust
            backends with <strong>Node.js & MongoDB/SQL</strong> — I handle the full development cycle
            with attention to performance and user experience.
          </p>
          <p>
            When I'm not coding, I'm learning new technologies and pushing the boundaries of what's
            possible on the web.
          </p>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">5+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">2+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">7+</span>
              <span className="stat-label">Skills Mastered</span>
            </div>
          </div>
        </div>

        <div className="skills-block reveal">
          <h3>🛠 Tech Stack & Skills</h3>
          <div className="skills-grid">
            {SKILLS.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <span className="skill-icon">{skill.icon}</span>
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <div className="section-header reveal">
          <div className="section-tag">My Work</div>
          <h2 className="section-title">
            Featured <span>Projects</span>
          </h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div className="project-card reveal" ref={ref}>
      <div className="project-image-wrapper">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="project-overlay">
          <div className="overlay-links">
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="overlay-btn live">
              🔗 Live Demo
            </a>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="overlay-btn github">
              💻 GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tech-tags">
          {project.tech.map((t) => (
            <span key={t} className="tech-tag">
              {t}
            </span>
          ))}
        </div>

        <div className="project-links-row">
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
            🌐 Live Demo ↗
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
            👨‍💻 View Code ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT ──────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // EmailJS integration — same keys as the original site
      emailjs.init({ publicKey: "Gkisq4GSHGj4nx1rh" });
      await emailjs.send("service_id", "template_id", {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      });
      setToast({ message: "Message sent! I'll get back to you soon. 🎉", type: "success" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      // Fallback: open mailto
      window.location.href = `mailto:kolapodev@gmail.com?subject=Message from ${encodeURIComponent(
        form.name
      )}&body=${encodeURIComponent(form.message)}`;
      setToast({ message: "Opening email client as fallback...", type: "success" });
    } finally {
      setSending(false);
    }
  };

  const CONTACT_METHODS = [
    {
      icon: "📧",
      label: "Email",
      value: "kolapodev@gmail.com",
      href: "mailto:kolapodev@gmail.com",
    },
    {
      icon: "💬",
      label: "WhatsApp",
      value: "Chat with me on WhatsApp",
      href: "https://wa.me/2349050911921",
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "View LinkedIn Profile",
      href: "https://www.linkedin.com/in/kolapo-ofobutu-b68892382",
    },
    {
      icon: "🌐",
      label: "GitHub",
      value: "View GitHub Profile",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="contact">
      <div className="section-header reveal">
        <div className="section-tag">Say Hello</div>
        <h2 className="section-title">
          Get In <span>Touch</span>
        </h2>
      </div>

      <div className="contact-container">
        <div className="contact-info reveal">
          <h3>Let's Work Together 🤝</h3>
          <p>
            I'm always interested in new opportunities and exciting projects. Whether you have a
            question, a project in mind, or just want to say hi — feel free to reach out!
          </p>

          <div className="contact-methods">
            {CONTACT_METHODS.map((m) => (
              <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer" className="contact-method">
                <div className="contact-method-icon">{m.icon}</div>
                <div className="contact-method-text">
                  <strong>{m.label}</strong>
                  <span>{m.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-form-card reveal">
          <h3>Send a Message 💌</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="form-submit-btn" disabled={sending}>
              {sending ? "⏳ Sending..." : "🚀 Send Message"}
            </button>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <span className="footer-logo">&lt;Peezutech /&gt;</span>
          <nav className="footer-links">
            {["home", "about", "projects", "contact"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s);
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © {year} Portfolio by{" "}
            <a href="https://wa.me/2349050911921" target="_blank" rel="noopener noreferrer">
              Peezutech
            </a>
            . &nbsp;Built with <span className="footer-accent">⚛️ React</span> &amp; ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── BACK TO TOP ──────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top"
      aria-label="Back to top"
      type="button"
    >
      ↑
    </button>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

// ── MOUNT ────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
