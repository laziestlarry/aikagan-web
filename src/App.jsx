import { useEffect, useMemo, useState } from 'react'
import './App.css'

const routes = {
  '/': {
    label: 'Home',
    title: 'AIKAGAN | The Kaganate',
    description:
      'AIKAGAN is the operating web settlement for AutonomaX, ProPulse, and Golden Delivery systems.',
  },
  '/services': {
    label: 'Services',
    title: 'Services | AIKAGAN',
    description:
      'Explore AI automation, e-commerce conversion, deployment, orchestration, and Golden Delivery offers.',
  },
  '/products': {
    label: 'Products',
    title: 'Products | AIKAGAN',
    description:
      'Review downloadable delivery packs, consulting packages, and automation bundles from AIKAGAN.',
  },
  '/mission-control': {
    label: 'Mission Control',
    title: 'Mission Control | AIKAGAN',
    description:
      'Track engagement stages from intake to launch and optimization through the AIKAGAN mission control model.',
  },
  '/about': {
    label: 'About',
    title: 'About | AIKAGAN',
    description:
      'Learn how Kagan, Lazy Larry, AutonomaX, and ProPulse form the operating core of The Kaganate.',
  },
  '/contact': {
    label: 'Contact',
    title: 'Contact | AIKAGAN',
    description:
      'Start your project intake with AIKAGAN for audits, consulting, and delivery system deployment.',
  },
}

const serviceCards = [
  {
    name: 'AI Automation',
    detail:
      'Design and deploy task agents, lead pipelines, and operating logic that remove repetitive manual work.',
  },
  {
    name: 'E-Commerce Conversion',
    detail:
      'Upgrade messaging, offer architecture, and checkout journeys to turn qualified traffic into buyers.',
  },
  {
    name: 'Deployment',
    detail:
      'Ship stable production systems with monitoring, fallback plans, and clear ownership per launch phase.',
  },
  {
    name: 'Orchestration',
    detail:
      'Connect AutonomaX and ProPulse modules into a unified command surface for teams and operators.',
  },
  {
    name: 'Golden Delivery',
    detail:
      'Package fulfillment and handoff systems built for speed, clarity, and measurable post-delivery outcomes.',
  },
]

const productCards = [
  {
    name: 'Golden Delivery Pack',
    detail:
      'Downloadable templates and process maps for intake, scoping, handoff, and fulfillment operations.',
    cta: 'View Offers',
  },
  {
    name: 'Conversion Lift Audit',
    detail:
      'A fixed-scope consulting package with offer diagnosis, friction map, and prioritized action plan.',
    cta: 'Request Audit',
  },
  {
    name: 'Automation Bundle',
    detail:
      'Composable workflows for CRM routing, fulfillment triggers, and post-purchase communication.',
    cta: 'Start Project',
  },
]

const missionStages = [
  ['01', 'Intake', 'Capture business constraints, goals, and deployment readiness.'],
  ['02', 'System Design', 'Select modules and define measurable conversion and delivery targets.'],
  ['03', 'Build Sprint', 'Implement automation, storefront improvements, and orchestration controls.'],
  ['04', 'Golden Delivery', 'Launch with clear handoff, support windows, and fulfillment checkpoints.'],
  ['05', 'Optimization', 'Review data, remove bottlenecks, and schedule the next growth cycle.'],
]

const ctaLinks = [
  ['Start Project', '#/contact'],
  ['View Offers', '#/products'],
  ['Request Audit', '#/contact'],
]

const getPathFromHash = () => {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash || hash === '/') return '/'
  return hash.startsWith('/') ? hash : `/${hash}`
}

const updateMetadata = ({ title, description }) => {
  document.title = title
  let descriptionTag = document.querySelector('meta[name="description"]')
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta')
    descriptionTag.setAttribute('name', 'description')
    document.head.append(descriptionTag)
  }
  descriptionTag.setAttribute('content', description)
}

function PageSection({ heading, intro, children }) {
  return (
    <section className="panel">
      <h2>{heading}</h2>
      {intro ? <p className="panel-intro">{intro}</p> : null}
      {children}
    </section>
  )
}

function CtaGroup({ compact = false }) {
  return (
    <div className={`cta-group${compact ? ' compact' : ''}`}>
      {ctaLinks.map(([label, href]) => (
        <a key={label} className="button-link" href={href}>
          {label}
        </a>
      ))}
    </div>
  )
}

function App() {
  const [path, setPath] = useState(getPathFromHash)

  useEffect(() => {
    const onHashChange = () => setPath(getPathFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const activeRoute = useMemo(() => routes[path] ?? routes['/'], [path])

  useEffect(() => {
    updateMetadata(activeRoute)
  }, [activeRoute])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <a className="brand" href="#/">
          AIKAGAN / The Kaganate
        </a>
        <nav aria-label="Primary">
          <ul>
            {Object.entries(routes).map(([routePath, route]) => (
              <li key={routePath}>
                <a
                  className={path === routePath ? 'active' : ''}
                  href={`#${routePath === '/' ? '/' : routePath}`}
                >
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero-panel">
          <p className="eyebrow">Operating settlement for intelligent commerce systems</p>
          <h1>AI infrastructure and delivery systems built for real conversion.</h1>
          <p>
            AIKAGAN is the public operating web system for AutonomaX, ProPulse, and Golden
            Delivery. We deploy practical automations, productized services, and clear execution
            tracks for teams that need outcomes.
          </p>
          <CtaGroup />
        </section>

        {path === '/' ? (
          <div className="grid">
            <PageSection
              heading="What we execute"
              intro="From first inquiry to post-launch optimization, every engagement is mapped, measurable, and commercially aligned."
            >
              <ul className="metric-list">
                <li>
                  <strong>Conversion architecture</strong>
                  <span>Offer, funnel, and checkout improvements grounded in business constraints.</span>
                </li>
                <li>
                  <strong>Automation deployment</strong>
                  <span>Production-ready agents and workflows with human override checkpoints.</span>
                </li>
                <li>
                  <strong>Golden Delivery protocol</strong>
                  <span>Structured handoff and service packaging for repeatable client delivery.</span>
                </li>
              </ul>
            </PageSection>

            <PageSection
              heading="Why teams choose The Kaganate"
              intro="No synthetic metrics, no inflated promises. Just scoped work, clear stages, and documented ownership."
            >
              <ul className="bullet-list">
                <li>Commercial-first strategy for product and service growth.</li>
                <li>Unified execution model across AutonomaX and ProPulse modules.</li>
                <li>Mission-control visibility from intake through launch and iteration.</li>
              </ul>
            </PageSection>
          </div>
        ) : null}

        {path === '/services' ? (
          <PageSection
            heading="Core Services"
            intro="Production-focused service lines for AI operations, commerce conversion, and dependable delivery."
          >
            <div className="card-grid">
              {serviceCards.map((service) => (
                <article key={service.name} className="card">
                  <h3>{service.name}</h3>
                  <p>{service.detail}</p>
                </article>
              ))}
            </div>
            <CtaGroup compact />
          </PageSection>
        ) : null}

        {path === '/products' ? (
          <PageSection
            heading="Productized Offers"
            intro="Downloadable packs, consulting packages, and automation bundles designed for immediate implementation."
          >
            <div className="card-grid">
              {productCards.map((product) => (
                <article key={product.name} className="card">
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                  <a className="text-link" href="#/contact">
                    {product.cta}
                  </a>
                </article>
              ))}
            </div>
          </PageSection>
        ) : null}

        {path === '/mission-control' ? (
          <PageSection
            heading="Mission Control"
            intro="A dashboard-style operating model to keep delivery predictable and visible."
          >
            <ol className="stage-list">
              {missionStages.map(([step, title, detail]) => (
                <li key={step}>
                  <span>{step}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </PageSection>
        ) : null}

        {path === '/about' ? (
          <PageSection
            heading="About The Kaganate"
            intro="Kagan and Lazy Larry built AIKAGAN to make advanced automation and conversion systems usable by real operators."
          >
            <p>
              AutonomaX forms the automation backbone. ProPulse drives commercial precision. Golden
              Delivery standardizes how projects are packaged, deployed, and handed off. AIKAGAN is
              where those systems are exposed, sold, and operated.
            </p>
          </PageSection>
        ) : null}

        {path === '/contact' ? (
          <PageSection
            heading="Project Intake"
            intro="Share project scope to start deployment planning, offers review, or a conversion audit."
          >
            <form className="intake-form">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" autoComplete="name" required />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required />

              <label htmlFor="company">Company</label>
              <input id="company" name="company" autoComplete="organization" />

              <label htmlFor="goal">Primary Goal</label>
              <textarea
                id="goal"
                name="goal"
                rows="4"
                placeholder="Tell us what you need shipped in the next 90 days."
                required
              />

              <button type="submit">Submit Intake</button>
            </form>
            <CtaGroup compact />
          </PageSection>
        ) : null}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} AIKAGAN / The Kaganate</p>
        <p>Operating web settlement for AutonomaX, ProPulse, and Golden Delivery.</p>
      </footer>
    </div>
  )
}

export default App
