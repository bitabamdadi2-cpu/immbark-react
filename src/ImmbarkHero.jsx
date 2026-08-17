import { useEffect, useRef, useState } from 'react';
import logo from './assets/logo.png';
import womanPhoto from './assets/woman.webp';

const LQIP =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAdABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDdxWfd3jQ3EWNnlNJ5Z65z3Naca7nA7VhywtLcgrJtIkMnIyAOP8Kl6FrU2sLlsn6YFFU5b2BUcGbYy8E7ScGiiwrmisoYcZGe5HT3qndQxS25jhcB8cMP0+tYul31zKIzLM75lwcntVi9ObCXOf3cwVeenT/GqSutQvZ6EWmRzrfyTTEgHIxg8n1/SisvUp5luWUyE7Dt44FFKzC6P//Z';

const STAR_PATH =
  'M10 1.5l2.6 5.9 6.4.6-4.8 4.3 1.5 6.3L10 15.4l-5.7 3.2 1.5-6.3L1 7.9l6.4-.6z';

function Star({ index }) {
  return (
    <span className="star" style={{ animationDelay: `${0.15 + index * 0.07}s` }}>
      <svg viewBox="0 0 20 20" fill="#fff"><path d={STAR_PATH} /></svg>
    </span>
  );
}

export default function ImmbarkHero() {
  const [scrolled, setScrolled] = useState(false);
  const [rating, setRating] = useState(4.9);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cardRef = useRef(null);
  const heroImageRef = useRef(null);
  const photoRef = useRef(null);
  const detailsRef = useRef(null);
  const summaryRef = useRef(null);
  const glowWrap1Ref = useRef(null);
  const glowWrap2Ref = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (photoRef.current?.complete) setPhotoLoaded(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const target = 4.9;
    const duration = 900;
    let raf;
    const start = performance.now() + 550;
    setRating(0);
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setRating(Number((eased * target).toFixed(1)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setRating(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (!prefersReducedMotion) {
          if (glowWrap1Ref.current) glowWrap1Ref.current.style.transform = `translateY(${y * 0.06}px)`;
          if (glowWrap2Ref.current) glowWrap2Ref.current.style.transform = `translateY(${y * -0.05}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const onToggle = () => setMenuOpen(details.open);
    const onKeydown = (e) => {
      if (e.key === 'Escape' && details.open) {
        details.open = false;
        summaryRef.current?.focus();
      }
    };
    const onDocClick = (e) => {
      if (details.open && !details.contains(e.target)) details.open = false;
    };

    details.addEventListener('toggle', onToggle);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onDocClick);
    return () => {
      details.removeEventListener('toggle', onToggle);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const firstLink = detailsRef.current?.querySelector('.mobile-panel a');
      firstLink?.focus();
    }
  }, [menuOpen]);

  const hasFinePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  const handleCardMouseMove = (e) => {
    if (!hasFinePointer || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mx', `${px}%`);
    cardRef.current.style.setProperty('--my', `${py}%`);

    if (heroImageRef.current) {
      const ix = (e.clientX - rect.left) / rect.width - 0.5;
      const iy = (e.clientY - rect.top) / rect.height - 0.5;
      heroImageRef.current.style.transform = `rotateY(${ix * 6}deg) rotateX(${iy * -6}deg)`;
    }
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--mx', '18%');
    cardRef.current.style.setProperty('--my', '15%');
    if (heroImageRef.current) heroImageRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className={`scrim${menuOpen ? ' show' : ''}`} onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }} />

      <div className="wrap">
        <header className={scrolled ? 'scrolled' : ''}>
          <div className="topnav">
            <a href="#" className="logo" aria-label="Immbark home"><img src={logo} alt="Immbark" /></a>

            <nav aria-label="Primary">
              <ul className="navlinks">
                <li><a href="#">Services</a></li>
                <li><a href="#">How it Works</a></li>
                <li><a href="#">Resources</a></li>
                <li><a href="#">News and Insights</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </nav>

            <div className="navright">
              <a href="#" className="login-btn">Login</a>
              <button className="icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
              </button>

              <details className="mobile-nav" ref={detailsRef}>
                <summary ref={summaryRef} aria-label="Toggle menu">
                  <span></span><span></span><span></span>
                </summary>
                <nav className="mobile-panel" aria-label="Mobile">
                  <a href="#">Services</a>
                  <a href="#">How it Works</a>
                  <a href="#">Resources</a>
                  <a href="#">News and Insights</a>
                  <a href="#">About Us</a>
                  <a href="#">Search</a>
                  <a href="#" className="login-btn">Login</a>
                </nav>
              </details>
            </div>
          </div>
        </header>

        <main id="main-content">
          <section
            className="card"
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="glow-wrap" ref={glowWrap1Ref} aria-hidden="true"><div className="glow" /></div>
            <div className="glow-wrap" ref={glowWrap2Ref} aria-hidden="true"><div className="glow-2" /></div>

            <div className="left">
              <div className="stars" role="img" aria-label="Rated 4.9 out of 5">
                <span className="icons" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} index={i} />)}
                </span>
                <span className="rated">Rated {rating.toFixed(1)}/5</span>
              </div>

              <h1>Immigration, <em>reimagined</em>—powered by smart tech, designed by lawyers</h1>
              <p className="sub">
                Our innovative platform streamlines the application process and connects you
                with licensed immigration attorneys with clear pricing—no guesswork, no hidden fees.
              </p>

              <div className="cta-row">
                <a href="#" className="btn btn-primary">
                  Apply Now
                  <span className="arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
                <a href="#" className="btn btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
                  </svg>
                  Consult with Lawyer
                </a>
              </div>
            </div>

            <div className="right" ref={heroImageRef} style={{ backgroundImage: `url(${LQIP})` }}>
              <img
                ref={photoRef}
                src={womanPhoto}
                width={800}
                height={980}
                alt="Immbark client reviewing her immigration application on a tablet"
                className={photoLoaded ? 'loaded' : ''}
                onLoad={() => setPhotoLoaded(true)}
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
