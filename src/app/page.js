import Link from "next/link";
import ContactForm from "../components/ContactForm";
import ScrollReveal from "../components/ScrollReveal";

const services = [
  ["01", "Web design & development", "Clear, confident websites that bring your brand and customer journey together.", "↗"],
  ["02", "E-commerce solutions", "Online stores designed to make browsing, buying and returning feel effortless.", "◈"],
  ["03", "Custom applications", "Purpose-built portals, dashboards and tools shaped around the way your team works.", "⌘"],
  ["04", "UI/UX & creative design", "Thoughtful interfaces and visual identities that feel distinct and intuitive.", "✳"],
  ["05", "Digital marketing", "Practical search, social, paid and content strategies to help the right people find you.", "◎"],
  ["06", "Technology support", "Ongoing maintenance, troubleshooting and improvements for the platforms you rely on.", "＋"],
];

const principles = [
  ["01", "Business-first thinking", "We start with your goals and your customers, not a pre-set package."],
  ["02", "Design with a purpose", "Every page and interaction should help visitors understand, decide or act."],
  ["03", "Technology that fits", "We recommend tools and features based on what your project actually needs."],
  ["04", "Clear communication", "Scope, progress and next steps stay easy to understand."],
  ["05", "Support beyond launch", "We can keep helping as your website or application evolves."],
];

const faqs = [
  ["What services does ZENTRIX provide?", "We support businesses with website design and development, e-commerce, UI/UX, custom applications, mobile app development, branding, digital marketing, hosting coordination and ongoing technical support."],
  ["Can you create a new website for my business?", "Yes. We can help plan, design and develop a website around your business, audience and goals. The scope will depend on the pages, features and integrations you need."],
  ["Can you redesign my existing website?", "Yes. We can review your current website and identify opportunities to improve its structure, appearance, content, usability and technical performance."],
  ["Do you build e-commerce websites?", "Yes. We can help develop an online store with product catalogues, shopping journeys, checkout and relevant payment or business-system integrations, subject to platform capabilities."],
  ["Can you develop software for our internal business process?", "We can discuss custom portals, dashboards, approval flows, ticketing systems and other web applications based on your workflow and requirements."],
  ["Do you provide support after a project is completed?", "Ongoing maintenance and technical support can be arranged based on the platform, type of work and agreed support scope."],
  ["How long does a website project take?", "Timing depends on the number of pages, content readiness, design requirements, integrations and feedback cycles. We will discuss a realistic schedule after understanding the scope."],
  ["How do we get a quote?", "Share your goals, required features, expected timeline and any existing website or system details. We can review the information and discuss the appropriate scope."],
];

export default function Home() {
  return (
    <main className="landing marketing premium-home">
      <nav className="marketing-nav">
        <Link href="/" className="brand">ZENTRIX</Link>
        <div><a href="#services">Services</a><a href="#approach">Our approach</a><a href="#faq">FAQs</a><a href="#contact">Contact</a><Link href="/login">Sign in</Link><Link className="button small" href="/register">Get started <span>↗</span></Link></div>
      </nav>

      <section className="marketing-hero premium-hero">
        <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="marketing-copy hero-copy-premium">
          <p className="eyebrow"><span className="eyebrow-mark"/> Digital solutions, thoughtfully made</p>
          <h1>Your next digital move <em>starts here.</em></h1>
          <p className="lede">We help businesses turn ideas into digital experiences that look right, work smoothly and make everyday tasks easier. From websites and online stores to custom applications and ongoing technology support, ZENTRIX brings design, development and practical thinking together.</p>
          <div className="actions"><a className="button" href="#contact">Start your project <span>↗</span></a><a className="text-link" href="#services">Explore our services <span>↓</span></a></div>
          <div className="hero-proof"><span className="proof-spark">✳</span><p><b>One considered approach.</b><br/>From the first idea to what comes next.</p></div>
        </div>
        <aside className="hero-art" aria-label="Abstract purple digital sculpture representing ideas taking shape">
          <div className="hero-art-heading"><span><i/> ZENTRIX DIGITAL STUDIO</span><b>01 <small>/ 04</small></b></div>
          <div className="hero-art-canvas">
            <div className="hero-art-grid" aria-hidden="true"/>
            <svg className="hero-sculpture" viewBox="0 0 500 500" role="img" aria-label="Layered purple abstract sculpture">
              <defs>
                <radialGradient id="sculptureGlow" cx="50%" cy="48%" r="52%"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset=".5" stopColor="#d8c4f4" stopOpacity=".7"/><stop offset="1" stopColor="#8a5cc4" stopOpacity="0"/></radialGradient>
                <linearGradient id="sculptureFace" x1=".1" y1=".1" x2=".9" y2=".85"><stop offset="0" stopColor="#f8f3ff"/><stop offset=".38" stopColor="#b898e4"/><stop offset=".72" stopColor="#8053b5"/><stop offset="1" stopColor="#4d2a77"/></linearGradient>
                <linearGradient id="sculptureShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".85"/><stop offset=".45" stopColor="#c9afe9" stopOpacity=".8"/><stop offset="1" stopColor="#76509e" stopOpacity=".72"/></linearGradient>
                <filter id="sculptureShadow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
              </defs>
              <circle cx="250" cy="250" r="195" fill="url(#sculptureGlow)"/>
              <g className="art-orbit orbit-outer"><circle cx="250" cy="250" r="184" fill="none" stroke="#70459e" strokeOpacity=".22" strokeWidth="1" strokeDasharray="2 8"/><circle cx="250" cy="66" r="4" fill="#70459e"/><circle cx="250" cy="434" r="3" fill="#b397d3"/></g>
              <g className="art-orbit orbit-inner"><ellipse cx="250" cy="250" rx="145" ry="177" fill="none" stroke="#fff" strokeOpacity=".68" strokeWidth="1.5"/><ellipse cx="250" cy="250" rx="110" ry="164" fill="none" stroke="#7953a3" strokeOpacity=".22" strokeWidth="1"/></g>
              <ellipse cx="250" cy="393" rx="91" ry="18" fill="#56357c" opacity=".23" filter="url(#sculptureShadow)"/>
              <path d="M253 89c49 15 95 62 103 111 9 52-26 81-73 111-44 28-76 56-73 99-50-25-82-70-77-120 5-47 43-76 80-103 36-26 62-53 40-98Z" fill="url(#sculptureFace)" stroke="#fff" strokeOpacity=".72" strokeWidth="2"/>
              <path d="M253 89c-18 42 3 73 38 105 35 31 64 57 58 99-6 45-49 71-91 94-28 16-48 33-48 61-34-28-57-65-57-107 0-49 34-80 71-108 36-27 64-51 64-86 0-24-13-43-35-58Z" fill="url(#sculptureShade)" opacity=".83"/>
              <path d="M248 111c28 36 30 65-5 97-35 33-85 63-86 114-1 34 17 61 41 83" fill="none" stroke="#fff" strokeOpacity=".78" strokeWidth="2"/>
              <path d="M280 116c47 39 76 83 65 125-11 42-54 67-91 91-34 22-59 46-59 84" fill="none" stroke="#56347e" strokeOpacity=".45" strokeWidth="1.5"/>
              <circle cx="349" cy="165" r="5" fill="#fff"/><circle cx="155" cy="328" r="4" fill="#70459e"/><circle cx="322" cy="363" r="3" fill="#fff"/>
            </svg>
            <div className="art-note note-top"><span>01</span><div><b>Ideas, refined</b><small>Made useful by design</small></div></div>
            <div className="art-note note-bottom"><i/> DESIGN <span>·</span> BUILD <span>·</span> GROW</div>
          </div>
          <div className="hero-art-footer"><span>CREATIVE TECHNOLOGY</span><span>BUILT AROUND YOU</span></div>
        </aside>
        <div className="hero-scroll"><span/> SCROLL TO EXPLORE</div>
      </section>

      <ScrollReveal as="section" className="intro-band theme-dark" variant="fade"><span className="intro-label">A more considered<br/>way to move forward</span><p>Technology should make business simpler — not add another layer of complexity. We work with you to understand what you are trying to achieve and build a digital solution around it.</p><span className="intro-index">Z / 2026</span></ScrollReveal>

      <section className="content-section premium-services theme-light" id="services">
        <ScrollReveal className="section-heading" variant="rise"><div><p className="eyebrow">What we can do together</p><h2>The right mix of creativity <em>& technology.</em></h2></div><p>Explore the ways we can help bring your next digital move to life.</p></ScrollReveal>
        <div className="premium-service-grid">{services.map(([number, title, description, icon], index) => <ScrollReveal as="article" className="premium-service-card" variant="rise" delay={(index % 3) * 110} key={number}><div className="service-card-top"><span>{number}</span><span className="service-card-arrow">{icon}</span></div><h3>{title}</h3><p>{description}</p><a href="#contact" aria-label={`Discuss ${title}`}>Explore service <span>↗</span></a></ScrollReveal>)}</div>
      </section>

      <section className="approach-section theme-dark" id="approach"><ScrollReveal className="approach-heading" variant="line"><p className="eyebrow">The ZENTRIX point of view</p><h2>Good work starts with <em>the right questions.</em></h2><p>A successful digital project is about more than getting something built. It is about choosing the right approach and making sure the finished solution serves a real purpose.</p></ScrollReveal><div className="principle-list">{principles.map(([number, title, desc], index)=><ScrollReveal as="article" variant="line" delay={index * 90} key={number}><span>{number}</span><h3>{title}</h3><p>{desc}</p><b>↗</b></ScrollReveal>)}</div></section>

      <section className="process-section theme-light"><ScrollReveal className="section-heading" variant="fade"><div><p className="eyebrow">How we work</p><h2>From first conversation <em>to what’s next.</em></h2></div><p>A clear, collaborative process built around your goals and the people who use what we create.</p></ScrollReveal><ScrollReveal className="process-track" variant="fade">{[["01","Listen","We learn about your goals, your customers and the challenge you want to solve."],["02","Plan","Together, we shape a practical approach and a clear direction."],["03","Design & build","We create, refine and test a solution around real needs."],["04","Launch & grow","We help you launch with confidence and can stay involved as you evolve."]].map(([n,title,desc], index)=><ScrollReveal as="article" variant="rise" delay={index * 120} key={n}><span>{n}</span><div className="process-node"/><h3>{title}</h3><p>{desc}</p></ScrollReveal>)}</ScrollReveal></section>

      <section className="faq-section theme-dark" id="faq"><ScrollReveal className="faq-heading" variant="rise"><p className="eyebrow">A few useful answers</p><h2>Good questions. <em>Clear answers.</em></h2><p>Here are a few things businesses often ask before starting a digital project with us.</p></ScrollReveal><ScrollReveal className="faq-list" variant="fade">{faqs.map(([question, answer], index) => <ScrollReveal as="details" className="faq-item" variant="line" delay={index * 65} open={index === 0} key={question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{question}</span><b aria-hidden="true">+</b></summary><p>{answer}</p></ScrollReveal>)}</ScrollReveal></section>

      <ScrollReveal as="section" className="closing-cta premium-cta theme-light" variant="line"><div className="cta-decoration">Z</div><p className="eyebrow">Your next step starts with a conversation</p><h2>Have a project in mind <em>or a process to improve?</em></h2><p>Tell us a little about it. We would be happy to understand your requirements and discuss a sensible way forward.</p><a className="button" href="#contact">Talk to ZENTRIX <span>↗</span></a></ScrollReveal>
      <ScrollReveal as="div" variant="fade"><ContactForm /></ScrollReveal>
      <ScrollReveal as="footer" className="marketing-footer theme-light" variant="rise"><Link href="/" className="brand">ZENTRIX</Link><div><b>Digital solutions with a clear purpose.</b><span>Websites · E-commerce · Applications · Design · Marketing · Support</span></div><div className="footer-links"><Link href="/login">Sign in</Link><Link href="/register">Create account</Link></div></ScrollReveal>
    </main>
  );
}
