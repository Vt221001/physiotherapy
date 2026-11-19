import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  Activity, CalendarDays, Check, CircleHelp, ClipboardCheck, Footprints, HeartHandshake,
  MapPin, MessageCircle, Target,
} from 'lucide-react';
import {
  Accordion, AppointmentLink, AssessmentCaption, assessmentPhoto, Closing, Eyebrow,
  mobilityPhoto, PageHero, PageMeta, ServiceCard,
} from './components.jsx';
import { clinic, faqGroups, services, topics } from './content.js';

const firstVisit = [
  { icon: MessageCircle, title: 'Tell us what’s changed', text: 'Talk through when the concern began, what you’ve already tried and how it affects the things you do each day.' },
  { icon: ClipboardCheck, title: 'Explore how you move', text: 'With your consent, the physiotherapist may observe relevant movements and assess strength, comfort or steadiness.' },
  { icon: Target, title: 'Agree on a starting plan', text: 'Discuss the findings, choose a goal that matters to you and agree on when to check how the plan is going.' },
];

export function Home() {
  return (
    <>
      <PageMeta description="The Wellness Physio Clinic in Meerganj, Jaunpur. Explore physiotherapy for pain, injuries and rehabilitation, and request an initial assessment." />
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>Physiotherapy in Jaunpur</Eyebrow>
            <h1>Move better.<br /><em>Live fuller.</em></h1>
            <p className="lead">Personalised physiotherapy for pain, injury and rehabilitation, with a plan shaped around the movements that matter to you.</p>
            <div className="hero-actions">
              <AppointmentLink />
              <Link to="/services" className="button button-outline">Explore services</Link>
            </div>
            <a className="hero-location" href={clinic.map} target="_blank" rel="noreferrer"><MapPin size={17} aria-hidden="true" />Meerganj Market, Jaunpur</a>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <img src={assessmentPhoto.src} alt={assessmentPhoto.alt} width="883" height="887" fetchPriority="high" />
            </div>
            <AssessmentCaption />
          </div>
        </div>
      </section>
      <div className="care-strip">
        <div className="container care-strip-inner">
          <div><ClipboardCheck aria-hidden="true" /><span>Individual assessments</span></div>
          <div><HeartHandshake aria-hidden="true" /><span>Shared decisions about care</span></div>
          <div><Footprints aria-hidden="true" /><span>Goals for everyday movement</span></div>
        </div>
      </div>

      <section className="section intro-section">
        <div className="container split-intro">
          <div>
            <Eyebrow>Welcome to the clinic</Eyebrow>
            <h2>Care for the way <em>you move.</em></h2>
          </div>
          <div>
            <p>The Wellness Physio Clinic is a pain and rehabilitation centre in Meerganj, Jaunpur. Whether an injury has interrupted your routine or familiar movements have become harder, an assessment gives you time to explain what’s changed and what you want to get back to.</p>
            <Link className="text-link" to="/about">Get to know the clinic</Link>
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-heading heading-row">
            <div><Eyebrow>Physiotherapy services</Eyebrow><h2>Find a place to <em>start.</em></h2></div>
            <Link className="button button-outline" to="/services">View all services</Link>
          </div>
          <div className="service-grid">
            {services.filter((service) => service.available).map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container editorial-grid">
          <figure className="editorial-photo">
            <img src={mobilityPhoto.src} alt={mobilityPhoto.alt} width="883" height="887" loading="lazy" />
          </figure>
          <div className="editorial-copy">
            <Eyebrow>Care built around you</Eyebrow>
            <h2>What would you like to <em>get back to?</em></h2>
            <p>Start with the activity that matters to you, whether that’s getting through a workday, walking to the market or returning to training. You can bring questions about:</p>
            <ul className="check-list">
              <li><Check aria-hidden="true" />Back or neck discomfort during daily tasks</li>
              <li><Check aria-hidden="true" />Joint stiffness or a change in strength</li>
              <li><Check aria-hidden="true" />Getting moving again after an injury or procedure</li>
              <li><Check aria-hidden="true" />Changes in walking, balance or confidence</li>
            </ul>
            <p>Together, you can decide what to work on first and how to check whether it’s making a difference.</p>
          </div>
        </div>
      </section>

      <section className="section visit-section">
        <div className="container">
          <div className="section-heading centered">
            <Eyebrow>Your first visit</Eyebrow>
            <h2>What an assessment <em>may involve.</em></h2>
            <p>There’s time to ask questions and decide together what feels like a manageable next step.</p>
          </div>
          <div className="process-grid">
            {firstVisit.map(({ icon: Icon, title, text }) => (
              <article key={title}><span className="icon-tile"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <div className="journey">
            <h3>From enquiry to ongoing care</h3>
            <ol>
              <li><strong>Enquire</strong><span>Tell the clinic what you’d like help with.</span></li>
              <li><strong>Arrange an assessment</strong><span>Confirm a time with the clinic.</span></li>
              <li><strong>Review your plan</strong><span>Agree when to revisit your goals together.</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>Before you visit</Eyebrow>
            <h2>Common <em>questions.</em></h2>
            <p>Find out what to expect and what to bring.</p>
            <Link className="text-link" to="/faqs">View all FAQs</Link>
          </div>
          <Accordion items={faqGroups[0].items} />
        </div>
      </section>
      <Closing />
    </>
  );
}

export function About() {
  return (
    <>
      <PageMeta title="About the Clinic" description="Learn how The Wellness Physio Clinic in Jaunpur approaches assessment, shared decisions and personalised physiotherapy goals." />
      <PageHero crumb="About" label="About the clinic" title={<>A practical approach to <em>better movement.</em></>} description="The Wellness Physio Clinic is a pain and rehabilitation centre in Meerganj, Jaunpur. Care begins with a conversation about what has changed and the activities you want to get back to." photo={mobilityPhoto} />
      <section className="section">
        <div className="container editorial-grid about-philosophy">
          <div><Eyebrow>Our philosophy</Eyebrow><h2>Your everyday life shapes <em>the plan.</em></h2></div>
          <div className="prose">
            <p>The impact of pain or reduced movement can show up in very ordinary moments. We want to understand how your work, home life, exercise and responsibilities affect what feels possible right now. That context helps us agree on something you can work on between visits.</p>
            <p>A physiotherapy assessment brings your history and priorities together with observations about movement and function. The physiotherapist will explain why a check may help and ask your permission before proceeding. You can ask questions, take a break or decline any part of the assessment.</p>
            <p>At a review, we talk about both changes you notice and what we can see in the activities we assessed together. If your priorities or circumstances change, we can revisit the plan with you.</p>
          </div>
        </div>
      </section>
      <section className="section visit-section">
        <div className="container">
          <div className="section-heading"><Eyebrow>How we work</Eyebrow><h2>What guides <em>your care.</em></h2></div>
          <div className="process-grid">
            <article><span className="icon-tile"><MessageCircle aria-hidden="true" /></span><h3>Time to explain</h3><p>Use your own words to describe the concern, share what you’ve tried and tell us which parts of your routine are most affected.</p></article>
            <article><span className="icon-tile"><HeartHandshake aria-hidden="true" /></span><h3>Decisions together</h3><p>Ask about the options, share any concerns and discuss how a suggested activity would fit around your responsibilities.</p></article>
            <article><span className="icon-tile"><Target aria-hidden="true" /></span><h3>Goals you can recognise</h3><p>Choose a real activity to work towards, such as taking the stairs at home or being more comfortable through a shift.</p></article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container clinic-profile">
          <span className="icon-tile"><Activity aria-hidden="true" /></span>
          <div><Eyebrow>Your physiotherapist</Eyebrow><h2>{clinic.practitioner}</h2><p>Physiotherapist at {clinic.name}.</p></div>
          <Link className="button button-outline" to="/contact">Contact the clinic</Link>
        </div>
      </section>
      <Closing />
    </>
  );
}

export function ServicesPage() {
  const [filter, setFilter] = useState('all');
  const filtered = services.filter((service) => filter === 'all' || service.group === filter);

  return (
    <>
      <PageMeta title="Physiotherapy Services" description="Explore physiotherapy, sports injury and post-operative rehabilitation, and back and neck care in Meerganj, Jaunpur." />
      <PageHero crumb="Services" label="Physiotherapy services" title={<>Care for pain, injury <em>and movement.</em></>} description="Explore the concerns you can talk through at an assessment. If you’re unsure which area fits, tell the clinic what you’re finding difficult." photo={assessmentPhoto} />
      <section className="section">
        <div className="container">
          <div className="section-heading"><Eyebrow>Explore care</Eyebrow><h2>Browse by <em>concern.</em></h2></div>
          <div className="filters" role="group" aria-label="Filter services by concern">
            {topics.map((topic) => (
              <button type="button" key={topic.id} aria-pressed={filter === topic.id} aria-controls="service-results" onClick={() => setFilter(topic.id)}>{topic.name}</button>
            ))}
          </div>
          <p role="status" className="filter-count">{filtered.length} areas of care</p>
          <div id="service-results" className="service-grid">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
        </div>
      </section>
      <Closing title="Unsure where to begin?" description="Tell the clinic which activity has become difficult. We can discuss whether an assessment is a suitable next step." />
    </>
  );
}

export function ServiceDetail() {
  const { serviceId } = useParams();
  const service = services.find(({ id }) => id === serviceId);
  if (!service) return <NotFound />;

  return (
    <>
      <PageMeta title={service.title} description={service.summary} />
      <PageHero crumb={service.title} parent={{ name: 'Services', to: '/services' }} label={service.available ? 'Physiotherapy & rehabilitation' : 'Availability to confirm'} title={service.title} description={service.intro} photo={service.group === 'mobility' ? mobilityPhoto : assessmentPhoto}>
        <AppointmentLink service={service}>{service.available ? 'Request an appointment' : 'Ask about availability'}</AppointmentLink>
      </PageHero>
      <section className="section">
        <div className="container detail-grid">
          <aside className="detail-aside">
            <Eyebrow>What to discuss</Eyebrow>
            <h2>Common concerns</h2>
            <ul className="check-list">{service.concerns.map((concern) => <li key={concern}><Check size={19} aria-hidden="true" />{concern}</li>)}</ul>
          </aside>
          <div className="detail-content">
            <article><h2>Assessment and rehabilitation</h2><p>{service.assessment}</p></article>
            <article><h2>What an appointment may involve</h2><p>{service.appointment}</p></article>
            <article><h2>Setting goals and reviewing progress</h2><p>{service.goals}</p></article>
          </div>
        </div>
      </section>
      <section className="section visit-section">
        <div className="container faq-layout">
          <div><Eyebrow>Before you visit</Eyebrow><h2>Questions about <em>this area.</em></h2><Link className="text-link" to="/faqs">View general FAQs</Link></div>
          <Accordion key={service.id} items={service.faq} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading"><Eyebrow>Explore services</Eyebrow><h2>Related areas <em>of care.</em></h2></div>
          <div className="service-grid related-grid">
            {service.related.map((id) => <ServiceCard key={id} service={services.find((related) => related.id === id)} />)}
          </div>
        </div>
      </section>
      <Closing service={service} title={service.available ? 'Discuss your next step.' : 'Ask the clinic about availability.'} description={service.available ? service.summary : 'Describe the kind of rehabilitation you’re looking for so the clinic can confirm whether it can help.'} />
    </>
  );
}

export function FaqPage() {
  return (
    <>
      <PageMeta title="Frequently Asked Questions" description="What to bring, what happens at a physiotherapy assessment, and how to arrange a visit in Jaunpur." />
      <PageHero crumb="FAQs" label="Before you visit" title={<>Frequently asked <em>questions.</em></>} description="Find out what to expect at an assessment, what to bring and how to arrange your visit." />
      <section className="section faq-page">
        <div className="container">
          {faqGroups.map(({ title, items }) => (
            <section className="faq-layout faq-group" key={title}>
              <div><span className="icon-tile"><CircleHelp aria-hidden="true" /></span><h2>{title}</h2></div>
              <Accordion items={items} />
            </section>
          ))}
          <div className="reference-note">For general information on physiotherapy visits, see the <a href="https://www.nhs.uk/tests-and-treatments/physiotherapy/" target="_blank" rel="noreferrer">NHS physiotherapy overview</a> and <a href="https://www.choosept.com/why-physical-therapy/prepare" target="_blank" rel="noreferrer">ChoosePT’s guide to preparing for a visit</a>.</div>
        </div>
      </section>
      <Closing title="Have a question about your visit?" />
    </>
  );
}

export function NotFound() {
  return (
    <>
      <PageMeta title="Page unavailable" description="Find services and appointment information at The Wellness Physio Clinic." />
      <section className="section not-found">
        <div className="container">
          <Eyebrow>Page unavailable</Eyebrow>
          <h1>This page has moved <em>or expired.</em></h1>
          <p>Return to the home page or explore the clinic’s physiotherapy services.</p>
          <div className="hero-actions">
            <Link to="/" className="button button-primary">Go to the home page</Link>
            <Link to="/services" className="button button-outline"><CalendarDays size={17} aria-hidden="true" />Explore services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
