import { ArrowUpRight, Lightbulb, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';

export default function ContactPage({ t }) {
  const [form, setForm] = useState({ name: '', email: '', category: 'Idea', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      const response = await api.post('/feedback', form);
      setStatus({ type: 'success', text: response.data.message });
      setForm({ name: '', email: '', category: 'Idea', message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error.response?.data?.message || 'Unable to send your message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div>
            <span className="eyebrow">We are listening</span>
            <h1>{t.contactTitle}</h1>
            <p>{t.contactMessage}</p>
            <div className="contact-note"><Lightbulb size={18} /> Every useful idea helps JobConnect grow.</div>
          </div>
          <div className="contact-orbit" aria-hidden="true"><Send size={42} /><span>Start a conversation</span></div>
        </div>
      </section>

      <section className="container contact-layout">
        <div className="contact-details">
          <span className="about-kicker">Reach the team</span>
          <h2>Ideas, questions, or a partnership in mind?</h2>
          <p className="contact-intro">Tell us what would make finding work or hiring talent better. Your message goes directly to the JobConnect team.</p>
          <div className="contact-list">
            <a href="mailto:hello@jobconnectrwanda.rw"><Mail size={18} /><span><small>{t.contactEmail}</small>hello@jobconnectrwanda.rw</span><ArrowUpRight size={16} /></a>
            <a href="tel:+250788000000"><Phone size={18} /><span><small>{t.contactPhone}</small>+250 788 000 000</span><ArrowUpRight size={16} /></a>
            <div><MapPin size={18} /><span><small>{t.contactLocation}</small>Kigali, Rwanda</span></div>
          </div>
          <div className="contact-map">
            <iframe
              title="JobConnect Rwanda location in Kigali"
              src="https://www.google.com/maps?q=Kigali%2C%20Rwanda&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form className="card feedback-form" onSubmit={handleSubmit}>
          <div className="form-heading"><div><span className="about-kicker">Your voice matters</span><h2>Send an idea</h2></div><Lightbulb size={27} /></div>
          <div className="feedback-fields">
            <label>Name<input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></label>
            <label>What is this about?<select name="category" value={form.category} onChange={handleChange}><option>Idea</option><option>Feedback</option><option>Support</option><option>Partnership</option></select></label>
            <label className="feedback-message">Your message<textarea name="message" value={form.message} onChange={handleChange} placeholder="Share your idea or question..." rows="6" required /></label>
          </div>
          {status.text && <div className={`feedback-status ${status.type}`}>{status.text}</div>}
          <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'} <Send size={16} /></button>
        </form>
      </section>
    </div>
  );
}
