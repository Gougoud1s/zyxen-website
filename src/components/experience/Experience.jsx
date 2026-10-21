import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { projects, services, partners } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import SEOMeta from "@/components/SEOMeta";
import "./experience.css";
const Scene = lazy(() => import("./Scene"));
const sections = [
  { name: "Who we are", key: "about", caption: "Get to know" },
  { name: "How we do it", key: "services", caption: "Our expertise" },
  { name: "Our work", key: "projects", caption: "Selected projects" },
  { name: "Contact", key: "contact", caption: "Start a conversation" },
];
export default function Experience({ ContactForm }) {
  const location = useLocation(),
    navigate = useNavigate();
  const { t } = useLanguage();
  const segment = location.pathname.split("/").filter(Boolean).at(-1);
  const section = sections.some((s) => s.key === segment) ? segment : null;
  const [selected, setSelected] = useState(null);
  const [chapter, setChapter] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [transition, setTransition] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const touch = useRef(0),
    wheel = useRef(0),
    timer = useRef(null),
    dialog = useRef(null);
  const project = projects[projectIndex];
  const count =
    section === "services" ? services.length : section === "about" ? 3 : 1;
  const navigation = useRef(null);
  const lastScroll = useRef(0);
  const go = (key) => {
    setTransition(sections.find((s) => s.key === key)?.name);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      navigate(`/${key}`);
      setSelected(null);
      setTransition(null);
    }, 850);
  };
  navigation.current = go;
  useEffect(() => {
    setChapter(0);
    wheel.current = 0;
    setContactOpen(false);
  }, [section]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!section || contactOpen) return;
    const step = (direction) => {
      if (Date.now() - lastScroll.current < 750) return;
      lastScroll.current = Date.now();
      if (chapter === count - 1 && direction > 0) {
        const current = sections.findIndex((s) => s.key === section);
        navigation.current(sections[(current + 1) % 4].key);
      } else
        setChapter((value) =>
          Math.max(0, Math.min(count - 1, value + direction)),
        );
    };
    const scroll = (e) => {
      if (
        e.target.closest(".experience-panel") &&
        e.target.closest(".experience-panel").scrollHeight >
          e.target.closest(".experience-panel").clientHeight
      )
        return;
      e.preventDefault();
      wheel.current += e.deltaY;
      if (Math.abs(wheel.current) > 120) {
        step(Math.sign(wheel.current));
        wheel.current = 0;
      }
    };
    const key = (e) => {
      if (e.target.closest("input,textarea,select")) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("wheel", scroll, { passive: false });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("wheel", scroll);
      window.removeEventListener("keydown", key);
    };
  }, [section, count, chapter, contactOpen]);
  useEffect(() => {
    if (!contactOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") setContactOpen(false);
      if (e.key === "Tab") {
        const items = dialog.current.querySelectorAll(
          "button,a,input,textarea,select",
        );
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [contactOpen]);
  const index = sections.findIndex((s) => s.key === section);
  const next = sections[(index + 1) % 4];
  const menu = () => {
    setSelected(Math.max(0, index));
    navigate("/");
  };
  return (
    <main
      className={`experience ${section || "home"} ${selected !== null ? "selecting" : ""}`}
      onTouchStart={(e) => {
        touch.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (
          section &&
          !contactOpen &&
          Math.abs(touch.current - e.changedTouches[0].clientY) > 50
        )
          setChapter((c) =>
            Math.max(
              0,
              Math.min(
                count - 1,
                c + Math.sign(touch.current - e.changedTouches[0].clientY),
              ),
            ),
          );
      }}
    >
      <SEOMeta
        title={`${section ? sections[index].name + " — " : ""}ZYXEN | Software Engineering Studio`}
        description={t("hero.desc")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Zyxen",
          url: "https://www.zyxen.gr",
        }}
      />
      <Suspense fallback={<div className="experience-canvas" />}>
        <Scene
          section={section}
          selection={selected}
          progress={chapter / Math.max(1, count - 1)}
          project={projectIndex}
        />
      </Suspense>
      <header className="experience-header">
        <Link
          to="/"
          onClick={() => setSelected(null)}
          className="experience-logo"
          aria-label="Zyxen home"
        >
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path d="M6 7h24L6 29h24M6 7v7m24 8v7" />
          </svg>
          <span>
            ZYXEN<small>SOFTWARE STUDIO</small>
          </span>
        </Link>
        <button
          className="experience-menu"
          aria-label="Open scene selector"
          onClick={menu}
        >
          <span />
          <span />
        </button>
      </header>
      {!section && selected === null && (
        <>
          <div className="experience-intro">
            <h1>We build platforms that scale businesses.</h1>
            <p>Software engineering & digital experiences.</p>
          </div>
          <button
            className="experience-button experience-explore"
            onClick={() => setSelected(0)}
          >
            Explore <span>↓</span>
          </button>
        </>
      )}
      {!section && selected !== null && (
        <nav className="experience-selector" aria-label="Explore Zyxen">
          <p>
            {selected + 1}/4 — {sections[selected].caption}
          </p>
          {sections.map((s, i) => (
            <button
              key={s.key}
              onPointerEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onClick={() => go(s.key)}
              className={i === selected ? "active" : ""}
            >
              {s.name}
              <span>↗</span>
            </button>
          ))}
        </nav>
      )}
      {section === "about" && (
        <article
          key={chapter}
          className={`experience-panel ${chapter === 1 ? "panel-right" : ""}`}
        >
          <span className="experience-eyebrow">
            Who we are / {chapter + 1} of 3
          </span>
          <h1>
            {chapter === 0
              ? "A studio built around delivery."
              : chapter === 1
                ? t("aboutPage.howTitle")
                : "Connected expertise."}
          </h1>
          {chapter === 0 ? (
            <p>{t("aboutPage.desc")}</p>
          ) : chapter === 1 ? (
            t("aboutPage.how").map((item) => <p key={item}>{item}</p>)
          ) : (
            <>
              <h2>
                {partners[0].name} <small>{partners[0].en.by}</small>
              </h2>
              <p>{partners[0].en.description}</p>
              <a
                className="experience-button"
                href={partners[0].website}
                target="_blank"
                rel="noreferrer"
              >
                Explore partnership ↗
              </a>
            </>
          )}
          <div className="experience-chapter-controls">
            <button onClick={() => chapter < 2 ? setChapter(chapter + 1) : go("services")}>
              {chapter < 2 ? "Next chapter →" : "How we do it →"}
            </button>
          </div>
        </article>
      )}
      {section === "services" && (
        <article
          key={chapter}
          className={`experience-panel ${chapter % 2 ? "panel-right" : ""}`}
        >
          <span className="experience-eyebrow">
            How we do it / {chapter + 1} of {services.length}
          </span>
          <h1>{services[chapter].en.name}</h1>
          <p>{services[chapter].en.description}</p>
          <p className="experience-tech">
            {services[chapter].tech.join(" / ")}
          </p>
          <Link
            className="experience-button"
            to={`/services/${services[chapter].slug}`}
          >
            Explore service ↗
          </Link>
          <div className="experience-chapter-controls">
            <button onClick={() => chapter < services.length - 1 ? setChapter(chapter + 1) : go("projects")}>
              {chapter < services.length - 1 ? "Next service →" : "Our work →"}
            </button>
          </div>
        </article>
      )}
      {section === "projects" && (
        <>
          <div className="experience-project-portal" key={`portal-${project.slug}`}>
            <img
              src={`/experience/projects/${project.slug}.png`}
              alt={`${project.en.name} website`}
            />
          </div>
          <article className="experience-panel" key={`project-${project.slug}`}>
            <span className="experience-eyebrow">
              Our work / {projectIndex + 1} of {projects.length}
            </span>
            <h1>{project.en.name}</h1>
            <p>{project.en.overview}</p>
            <Link
              className="experience-button"
              to={`/projects/${project.slug}`}
            >
              Explore project ↗
            </Link>
            <button
              className="experience-next-work"
              onClick={() =>
                setProjectIndex((projectIndex + 1) % projects.length)
              }
            >
              Next work →
            </button>
            <p className="experience-credit">{t("projectsPage.note")}</p>
          </article>
        </>
      )}
      {section === "contact" && (
        <article className="experience-contact">
          <h1>
            Let’s build something
            <br />
            worth exploring.
          </h1>
          <p>{t("ctaSub")}</p>
          <button
            className="experience-button"
            onClick={() => setContactOpen(true)}
          >
            Contact us ↗
          </button>
          <a href="mailto:hello@zyxen.gr">hello@zyxen.gr</a>
        </article>
      )}
      {section && (
        <>
          <aside className="experience-progress">
            <span>{sections[index].name}</span>
            <div>
              <i style={{ height: `${((chapter + 1) / count) * 100}%` }} />
            </div>
            <button onClick={() => go(next.key)}>{next.name} ↓</button>
          </aside>
          <div className="experience-scroll">
            {count > 1 ? (
              <>
                <span>Scroll to explore</span>
                <div className="experience-pagination">
                  {Array.from({ length: count }, (_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to chapter ${i + 1}`}
                      aria-current={chapter === i ? "step" : undefined}
                      onClick={() => setChapter(i)}
                      className={chapter === i ? "active" : ""}
                    />
                  ))}
                </div>
              </>
            ) : (
              <button onClick={() => go(next.key)}>
                Continue to {next.name} ↓
              </button>
            )}
          </div>
        </>
      )}
      <Link
        className="experience-envelope"
        to="/contact"
        aria-label="Contact Zyxen"
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 5h18v14H3zM3 5l9 8 9-8" />
        </svg>
      </Link>
      {!section && (
        <footer className="experience-legal">
          <span>© {new Date().getFullYear()} Zyxen</span>
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/cookie-policy">Cookies</Link>
        </footer>
      )}
      {transition && (
        <div className="experience-transition" role="status">
          <span>{transition}</span>
        </div>
      )}
      {contactOpen && (
        <div
          className="experience-modal-backdrop"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="experience-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Contact Zyxen"
            ref={dialog}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="experience-modal-close"
              onClick={() => setContactOpen(false)}
              aria-label="Close contact form"
            >
              ×
            </button>
            {ContactForm ? (
              <ContactForm embedded />
            ) : (
              <>
                <h2>Start a conversation</h2>
                <a className="experience-button" href="mailto:hello@zyxen.gr">
                  Email hello@zyxen.gr ↗
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
