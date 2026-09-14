import { ArrowUpRight, BriefcaseBusiness, MapPinned, ShieldCheck, UsersRound } from 'lucide-react';

export default function AboutPage({ t }) {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow">JobConnect Rwanda</span>
            <h1>{t.aboutTitle}</h1>
            <p>{t.aboutP1}</p>
            <a href="#mission" className="about-scroll-link">
              Discover our mission <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="about-hero-art" aria-hidden="true">
            <div className="about-art-ring about-art-ring-one" />
            <div className="about-art-ring about-art-ring-two" />
            <div className="about-art-card about-art-card-main">
              <BriefcaseBusiness size={30} />
              <strong>Opportunity, organized.</strong>
              <span>Built for Rwanda's next chapter.</span>
            </div>
            <div className="about-art-card about-art-card-float">
              <UsersRound size={18} />
              <span>People first</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container about-impact" aria-label="Platform impact">
        <div><strong>01</strong><span>One trusted place</span></div>
        <div><strong>02</strong><span>Local opportunities</span></div>
        <div><strong>03</strong><span>Faster connections</span></div>
      </section>

      <section className="container about-content" id="mission">
        <div className="about-mission card">
          <span className="about-kicker">Why we exist</span>
          <h2>Making the path to meaningful work clearer.</h2>
          <p>{t.aboutP2}</p>
        </div>
        <div className="about-principles">
          <article>
            <MapPinned size={23} />
            <h3>Local by design</h3>
            <p>Relevant roles and real connections for communities across Rwanda.</p>
          </article>
          <article>
            <ShieldCheck size={23} />
            <h3>Built on trust</h3>
            <p>A clearer process helps candidates and employers move with confidence.</p>
          </article>
          <article>
            <UsersRound size={23} />
            <h3>For every ambition</h3>
            <p>Whether you are starting out or hiring your next great team member.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
