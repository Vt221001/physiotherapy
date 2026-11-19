import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Eyebrow, PageHero, PageMeta } from './components.jsx';
import { clinic, services } from './content.js';

const formPath = '/appointment-form.html';
const hasFormDelivery = import.meta.env.VITE_NETLIFY_FORMS === 'true';

function validate(form, data) {
  const errors = {};
  if (!data.get('name').trim()) errors.name = 'Enter your name.';
  if (!data.get('email').trim() || form.elements.email.validity.typeMismatch) {
    errors.email = 'Enter a valid email address.';
  }
  const phone = data.get('phone').trim();
  if (phone && (!/^\+?[\d().\s-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))) {
    errors.phone = 'Enter a valid phone number or leave this blank.';
  }
  if (!data.get('service')) errors.service = 'Choose an area of care or select “I’m not sure”.';
  if (!data.get('message').trim()) errors.message = 'Tell us briefly what you would like help with.';
  if (data.get('consent') !== 'yes') errors.consent = 'Confirm that the clinic may contact you about this enquiry.';
  return errors;
}

function AppointmentForm({ selected }) {
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  function clearError(event) {
    const { name } = event.target;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    if (status === 'error' || status === 'success') setStatus('idle');
  }

  function fieldProps(name, description) {
    return {
      id: name,
      name,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': [errors[name] && name + '-error', description].filter(Boolean).join(' ') || undefined,
    };
  }

  function fieldError(name) {
    return errors[name] && <span id={name + '-error'} className="field-error">{errors[name]}</span>;
  }

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const validation = validate(form, data);
    setErrors(validation);
    const firstError = Object.keys(validation)[0];
    if (firstError) {
      setStatus('idle');
      requestAnimationFrame(() => form.elements.namedItem(firstError)?.focus());
      return;
    }

    if (!hasFormDelivery) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(formPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data),
        signal: AbortSignal.timeout(15000),
      });
      const body = new DOMParser().parseFromString(await response.text(), 'text/html');
      const acknowledgement = /your form submission has been received/i.test(body.body.textContent.replace(/\s+/g, ' '));
      // Require Netlify's default acknowledgement. A static route can also return HTTP 200.
      if (!response.ok || !acknowledgement) {
        throw new Error('No form acknowledgement');
      }
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form id="appointment" className="contact-form" name="appointment" method="post" action={formPath} onSubmit={submit} onChange={clearError} noValidate>
      <input type="hidden" name="form-name" value="appointment" />
      <div hidden><label>Leave this field empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
      <Eyebrow>Appointment enquiry</Eyebrow>
      <h2>Tell us how we can help.</h2>
      <p>We’ll use your details to discuss your enquiry and confirm whether an appointment is available.</p>
      {!hasFormDelivery && <p className="form-notice">Online enquiries are currently unavailable. You can call or email the clinic using the details on this page.</p>}
      <fieldset disabled={status === 'sending'} className="form-fields">
        <legend className="sr-only">Appointment details</legend>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input {...fieldProps('name')} autoComplete="name" required maxLength={120} />
            {fieldError('name')}
          </div>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input {...fieldProps('email')} autoComplete="email" type="email" required maxLength={254} />
            {fieldError('email')}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone <span className="optional">(optional)</span></label>
            <input {...fieldProps('phone')} autoComplete="tel" type="tel" maxLength={32} />
            {fieldError('phone')}
          </div>
          <div className="field">
            <label htmlFor="timing">Preferred timing</label>
            <select id="timing" name="timing" defaultValue="No preference">
              <option>No preference</option><option>Morning</option><option>Afternoon</option><option>Evening</option>
            </select>
          </div>
          <div className="field full-field">
            <label htmlFor="service">Area of care</label>
            <select {...fieldProps('service')} defaultValue={selected?.title ?? ''} required>
              <option value="" disabled>Select an area of care</option>
              {services.map((service) => <option key={service.id} value={service.title}>{service.title + (service.available ? '' : ' (ask about availability)')}</option>)}
              <option value="Not sure">I’m not sure</option>
            </select>
            {fieldError('service')}
          </div>
          <div className="field full-field">
            <label htmlFor="message">What would you like help with?</label>
            <textarea {...fieldProps('message', 'message-guidance')} placeholder="A short note about the movement or activity you want to discuss" rows={4} required maxLength={1200} />
            {fieldError('message')}
            <small id="message-guidance">Please keep it brief and avoid sharing medical reports or sensitive personal information.</small>
          </div>
          <div className="field full-field">
            <label className="consent"><input {...fieldProps('consent')} type="checkbox" value="yes" required /><span>I agree to be contacted by the clinic about my appointment enquiry.</span></label>
            {fieldError('consent')}
          </div>
        </div>
        <button className="button button-primary form-submit" disabled={status === 'sending'} type="submit"><CalendarDays size={18} aria-hidden="true" />{status === 'sending' ? 'Sending enquiry…' : 'Send appointment enquiry'}</button>
      </fieldset>
      <div role="status" aria-live="polite">
        {status === 'sending' && <p className="sr-only">Sending your enquiry.</p>}
        {status === 'success' && <p className="form-feedback success">Your enquiry was submitted. Please wait for the clinic to confirm your appointment by phone or email.</p>}
      </div>
      {status === 'error' && <p role="alert" className="form-feedback error">We couldn’t submit your enquiry. {hasFormDelivery ? 'Try again or contact the clinic by phone or email.' : 'Please contact the clinic by phone or email.'}</p>}
    </form>
  );
}

export function Contact() {
  const [params] = useSearchParams();
  const selected = services.find((service) => service.id === params.get('service'));

  return (
    <>
      <PageMeta title="Contact & Appointments" description="Contact The Wellness Physio Clinic in Meerganj, Jaunpur by phone or email, or request an appointment." />
      <PageHero crumb="Contact" label="Contact & appointments" title={<>Make time for <em>better movement.</em></>} description="Request an initial assessment or ask about an area of care. The clinic will discuss your enquiry and confirm the next step with you." />
      <section className="section">
        <div className="container contact-layout">
          <AppointmentForm key={selected?.id ?? 'general'} selected={selected} />
          <aside className="contact-details">
            <Eyebrow>Find the clinic</Eyebrow>
            <h2>Visit or get in touch.</h2>
            <div className="contact-line"><span className="icon-tile"><MapPin aria-hidden="true" /></span><div><h3>Address</h3><address>{clinic.addressLines[0]}<br />{clinic.addressLines[1]}</address><a className="text-link" href={clinic.map} target="_blank" rel="noreferrer">Find directions</a></div></div>
            <div className="contact-line"><span className="icon-tile"><Phone aria-hidden="true" /></span><div><h3>Phone</h3><a href={'tel:' + clinic.telephone}>{clinic.phone}</a></div></div>
            <div className="contact-line"><span className="icon-tile"><Mail aria-hidden="true" /></span><div><h3>Email</h3><a href={'mailto:' + clinic.email}>{clinic.email}</a></div></div>
            <div className="contact-line"><span className="icon-tile"><Clock aria-hidden="true" /></span><div><h3>Opening hours</h3><p>Call the clinic to confirm current opening hours before travelling.</p></div></div>
          </aside>
        </div>
      </section>
    </>
  );
}
