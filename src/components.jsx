import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  Accessibility, Activity, Bone, Brain, CalendarDays, ChevronRight, ClipboardList,
  Dumbbell, Mail, MapPin, Menu, Phone, Plus, X,
} from 'lucide-react';
import { clinic, services } from './content.js';

const navItems = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/faqs', 'FAQs'],
  ['/contact', 'Contact'],
];

const serviceIcons = {
  bone: Bone, sport: Dumbbell, post: ClipboardList, back: Activity, neuro: Brain, mobility: Accessibility,
};

export const assessmentPhoto = {
  src: '/images/movement-assessment.jpg',
  alt: 'Illustrative photograph of a physiotherapist supporting a seated patient during a shoulder movement assessment.',
};

export const mobilityPhoto = {
  src: '/images/guided-mobility.jpg',
  alt: 'Illustrative photograph of a therapist discussing movement with an older adult.',
};

export function RouteChange() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}

export function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function' || typeof Element.prototype.animate !== 'function') return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const running = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting || preference.matches) continue;
        observer.unobserve(target);

        const animation = target.animate([
          { opacity: 0.8, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 440, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
      }
    }, { rootMargin: '0px 0px 32px 0px', threshold: 0.04 });

    document.querySelectorAll('#main-content [data-reveal]').forEach((target) => observer.observe(target));

    function stop() {
      observer.disconnect();
      observer.takeRecords();
      for (const animation of running) animation.cancel();
      running.clear();
    }

    const onPreferenceChange = (event) => { if (event.matches) stop(); };
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      preference.removeEventListener('change', onPreferenceChange);
      stop();
    };
  }, [pathname]);

  return null;
}

export function PageMeta({ title, description }) {
  useEffect(() => {
    document.title = title ? title + ' | ' + clinic.name : clinic.name + ' | Physiotherapy in Jaunpur';
    document.querySelector('meta[name="description"]').content = description;
  }, [title, description]);

  return null;
}

function Brand({ footer = false }) {
  return (
    <Link className={'brand' + (footer ? ' brand-footer' : '')} to="/">
      <img src="/clinic-mark.svg" width="46" height="46" alt="" />
      <span className="brand-copy">
        <strong>Wellness Physio</strong>
        <small>{footer ? 'Pain & Rehabilitation Centre' : 'PHYSIOTHERAPY CLINIC'}</small>
      </span>
    </Link>
  );
}

export function AppointmentLink({ service, children = 'Request an appointment', className = 'button button-primary', onClick }) {
  const link = '/contact' + (service ? '?service=' + encodeURIComponent(service.id) : '');
  return <Link className={className} to={link} onClick={onClick}><CalendarDays size={18} aria-hidden="true" />{children}</Link>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 881px)');
    const closeOnDesktop = (event) => { if (event.matches) setOpen(false); };
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div className="utility">
        <div className="container utility-inner">
          <a href={clinic.map} target="_blank" rel="noreferrer" className="utility-location"><MapPin size={14} aria-hidden="true" />{clinic.location}, Uttar Pradesh</a>
          <a href={'tel:' + clinic.telephone}><Phone size={14} aria-hidden="true" />{clinic.phone}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <button ref={toggle} type="button" aria-expanded={open} aria-controls="site-navigation" aria-label={open ? 'Close menu' : 'Open menu'} className="menu-toggle" onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="site-navigation" aria-label="Main navigation" className={open ? 'main-nav is-open' : 'main-nav'}>
            {navItems.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
            ))}
            <AppointmentLink className="button button-primary mobile-book" onClick={() => setOpen(false)}>Book a visit</AppointmentLink>
          </nav>
          <AppointmentLink className="button button-primary desktop-book">Book a visit</AppointmentLink>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand footer />
            <p>Physiotherapy and rehabilitation in Meerganj, Jaunpur, centred on the movements that matter in daily life.</p>
          </div>
          <nav aria-label="Footer navigation">
            <h2>Explore</h2>
            {navItems.slice(1).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>
          <nav aria-label="Physiotherapy services">
            <h2>Physiotherapy</h2>
            {services.filter((service) => service.available).map((service) => (
              <Link key={service.id} to={'/services/' + service.id}>{service.title.replace(/ Physiotherapy$/, '')}</Link>
            ))}
          </nav>
          <div>
            <h2>Visit or call</h2>
            <a className="icon-line" href={clinic.map} target="_blank" rel="noreferrer"><MapPin size={17} aria-hidden="true" /><span>{clinic.addressLines[0]}<br />{clinic.addressLines[1]}</span></a>
            <a className="icon-line" href={'tel:' + clinic.telephone}><Phone size={17} aria-hidden="true" />{clinic.phone}</a>
            <a className="icon-line" href={'mailto:' + clinic.email}><Mail size={17} aria-hidden="true" />{clinic.email}</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {clinic.name}</span><span>{clinic.descriptor}</span></div>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }) {
  return <p className="eyebrow"><span aria-hidden="true" />{children}</p>;
}

export function Breadcrumb({ current, parent }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        {parent && <li><ChevronRight size={14} aria-hidden="true" /><Link to={parent.to}>{parent.name}</Link></li>}
        <li><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{current}</span></li>
      </ol>
    </nav>
  );
}

export function PageHero({ crumb, parent, label, title, description, photo, children }) {
  return (
    <section className={'page-hero' + (photo ? ' page-hero-with-photo' : '')}>
      <div className="container">
        <Breadcrumb current={crumb} parent={parent} />
        <div className="page-hero-layout">
          <div>
            <Eyebrow>{label}</Eyebrow>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
            {children}
          </div>
          {photo && <img className="page-photo" src={photo.src} alt={photo.alt} width="883" height="887" />}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ service }) {
  const Icon = serviceIcons[service.icon];

  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="icon-tile"><Icon size={24} strokeWidth={1.65} aria-hidden="true" /></span>
        {!service.available && <span className="availability">Availability to confirm</span>}
      </div>
      <h3><Link to={'/services/' + service.id}>{service.title}</Link></h3>
      <p>{service.summary}</p>
      <Link className="text-link service-more" aria-label={'Learn more about ' + service.title} to={'/services/' + service.id}>Learn more</Link>
    </article>
  );
}

export function Accordion({ items }) {
  return (
    <div className="accordion">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}<Plus className="accordion-icon" size={19} aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Closing({ service, title = 'Let’s start with a conversation.', description = 'Tell us what you’re finding difficult and what you’d like to get back to. The clinic can help you work out the next step.' }) {
  return (
    <section className="section closing-section">
      <div className="container">
        <div className="closing" data-reveal>
          <div>
            <Eyebrow>Talk to the clinic</Eyebrow>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="closing-actions">
            <AppointmentLink service={service} className="button button-light">{service?.available === false ? 'Ask about availability' : 'Request an appointment'}</AppointmentLink>
            <a href={'tel:' + clinic.telephone} className="closing-phone"><Phone size={16} aria-hidden="true" />{clinic.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
