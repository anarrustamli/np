import { DEFAULT_PAGE_SIZE } from '@workflow-saas/shared';
import './App.css';

const features = [
  'Visual workflow builder with triggers and actions',
  'Execution engine with retries and logging',
  'Usage metering with subscription limits',
  'Team-ready foundation with shared packages'
];

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div>
            <p className="app__badge">Workflow Automation SaaS</p>
            <h1 className="app__title">Foundational UI Shell</h1>
            <p className="app__subtitle">
              This starter interface pairs with the Express API scaffold to accelerate development of the automation platform MVP.
            </p>
          </div>
          <div className="app__metric-card">
            <span className="app__metric-label">Default page size</span>
            <p className="app__metric-value">{DEFAULT_PAGE_SIZE}</p>
          </div>
        </div>
      </header>
      <main className="app__main">
        <section>
          <h2 className="section__title">What&apos;s included</h2>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature} className="feature-list__item">
                <p className="feature-list__text">{feature}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="app__footer">
        <div className="app__footer-inner">
          Ready to extend? Add routes, connectors, and billing per the project brief.
        </div>
      </footer>
    </div>
  );
}

export default App;
