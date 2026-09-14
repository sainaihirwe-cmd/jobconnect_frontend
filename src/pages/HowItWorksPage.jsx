export default function HowItWorksPage({ t }) {
  return (
    <div className="container page-space">
      <div className="page-header">
        <h1>{t.howTitle}</h1>
      </div>
      <div className="steps-grid">
        <div className="step-card card">
          <span className="step-number">1</span>
          <h3>{t.registerStep}</h3>
          <p>{t.stepRegisterText}</p>
        </div>
        <div className="step-card card">
          <span className="step-number">2</span>
          <h3>{t.searchStep}</h3>
          <p>{t.stepSearchText}</p>
        </div>
        <div className="step-card card">
          <span className="step-number">3</span>
          <h3>{t.applyStep}</h3>
          <p>{t.stepApplyText}</p>
        </div>
      </div>
    </div>
  );
}
