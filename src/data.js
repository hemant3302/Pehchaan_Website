// All site copy, from "Pehchaan — Website Copy & FAQ".
// Anything in [square brackets] is a placeholder to confirm or replace before going live;
// it shows with a dashed outline on the site while HIGHLIGHT_PLACEHOLDERS is on (src/config.js).

import { HIRING, SHOW_ENGAGEMENTS } from './config.js'

export const brand = 'Pehchaan'

export const contact = {
  email: '[hello@pehchaan.xyz]',
  phone: '[+91 XXXXX XXXXX]',
  location: 'Delhi NCR, India',
  hours: 'Mon–Sat, 10am–7pm IST',
  careersEmail: '[careers@pehchaan.xyz]',
}

export const navLinks = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  ...(SHOW_ENGAGEMENTS ? [{ label: 'Engagements', to: '/engagements' }] : []),
  ...(HIRING ? [{ label: 'Careers', to: '/careers' }] : []),
  { label: 'FAQ', to: '/faq' },
]

/* ---------- SEO ---------- */

export const seo = {
  home: { title: 'Pehchaan — Brand & Performance Studio for D2C Brands', description: 'Strategy, identity, AI video, performance marketing and conversion-first websites for D2C brands. One studio, one system, measured on real results.' },
  services: { title: 'Services — Brand Strategy, Identity, AI Video, Performance Marketing & Web · Pehchaan', description: 'Brand strategy, visual identity, packaging, AI video, performance creative, performance marketing, websites and apps — built as one connected system.' },
  work: { title: 'Work — D2C Brand & Creative Case Studies · Pehchaan', description: "See how we've helped brands like Kapiva and BitYog stand out and grow with strategy, design and video." },
  about: { title: 'About — Pehchaan, a Brand & Performance Studio from Delhi NCR', description: 'Pehchaan means identity. Meet the studio that builds brands people recognise and grows them with performance marketing, for D2C founders worldwide.' },
  engagements: { title: 'Pricing & Engagements · Pehchaan', description: 'Project, retainer and partner engagements for brand, creative and web. Clear scope, fixed quotes.' },
  contact: { title: 'Contact · Pehchaan', description: 'Tell us about your brand. Free 30-minute call, reply within 24 hours.' },
  careers: HIRING
    ? { title: 'Careers · Pehchaan', description: "Build brands people remember. Real client briefs from day one at Pehchaan's studio." }
    : { title: 'Careers · Pehchaan', description: "Pehchaan isn't hiring right now. Open roles will be listed here when that changes." },
  faq: { title: 'FAQ · Pehchaan', description: "Everything you'd ask on a first call, answered upfront." },
  privacy: { title: 'Privacy Policy · Pehchaan', description: 'How Pehchaan handles your information.' },
  terms: { title: 'Terms · Pehchaan', description: 'Terms of working with Pehchaan.' },
}

/* ---------- HOME ---------- */

export const hero = {
  eyebrow: 'BRAND & PERFORMANCE STUDIO',
  headline: 'Brands people recognise. Creative that actually sells.',
  altHeadline: 'We design decisions, not just interfaces.',
  subhead: 'Pehchaan helps D2C brands grow with strategy, identity, AI-powered video, performance marketing and conversion-first websites — built as one system, measured on ROAS and CAC, not likes.',
  primary: { label: 'Start your project', to: '/contact' },
  secondary: { label: 'See our work', to: '/work' },
}

// Use only numbers you can defend. `count` animates; leave it off for placeholders.
export const stats = [
  { count: 3, suffix: '+', label: 'Years building brands and products' },
  { display: '[X]+', label: 'D2C brands served' },
  { display: '[X]+', label: 'Ad creatives and videos shipped' },
]

export const tickerItems = ['BRAND STRATEGY', 'PERFORMANCE MARKETING', 'VISUAL IDENTITY', 'PACKAGING', 'AI VIDEO', 'PERFORMANCE CREATIVE', 'REELS', 'WEBSITES & APPS', 'DESIGN SYSTEMS']

export const badges = ['SINCE 2026', 'DELHI NCR', 'WORKING GLOBALLY']
export const manifesto = "We don't do generic. Every brand we touch starts with one question: why should anyone pick you? We build that answer into everything people see, from the logo to the website, then put it in front of the right people with ads judged on sales, not likes."

export const clientsSection = {
  heading: "Brands we've worked with",
  subhead: 'From Ayurveda to wellness to café culture — D2C and consumer brands building for the long run.',
}
// Get written permission before listing each brand (Kapiva came through Final Arc, so check with them too).
// Set `confirmed: true` once you have it in writing; unconfirmed brands are not shown.
export const clients = [
  { name: 'Kapiva', confirmed: true },
  { name: 'BitYog', confirmed: true },
  { name: 'Mamaearth', confirmed: true },
  { name: 'Ba Bli Blu', confirmed: false },
]

export const processSection = {
  heading: 'Our Process',
  subhead: 'Four steps. No guesswork. Every decision traced back to a business goal.',
}
export const processSteps = [
  { num: '01', title: 'Discover', text: "We dig into your brand, category, customers and competitors to find the gap nobody's using yet.", hue: 12, highlight: "the gap nobody's using yet" },
  { num: '02', title: 'Define', text: 'We lock positioning, brand language and a creative roadmap before anything gets designed.', hue: 20, highlight: 'before anything gets designed' },
  { num: '03', title: 'Design & Build', text: 'Identity, packaging, ads, video and web, made by one team so it all speaks the same language.', hue: 28, highlight: 'made by one team' },
  { num: '04', title: 'Measure & Scale', text: "We track ROAS, CAC and conversion, kill what doesn't work, and scale what does.", hue: 6, highlight: 'scale what does' },
]

export const valuesSection = {
  heading: 'What we stand for',
  subhead: 'Strategy first. Design that earns its place.',
}
export const values = [
  { title: 'Clarity', scene: 'orbit', text: "If your customer has to think twice, we've failed. We cut until the message lands in three seconds." },
  { title: 'Systems thinking', scene: 'rings', text: 'We design brands like products: rules, components and reasons, so you can scale without losing yourself.' },
  { title: 'Honesty', scene: 'crystal', text: "We report real numbers, flag what isn't working, and never sell you a service you don't need." },
]

export const servicesSection = {
  heading: 'What we do',
  subhead: 'One studio for the work that builds a brand and the work that sells it.',
}
export const services = [
  {
    category: 'Strategy',
    title: 'Brand Strategy',
    tag: 'Strategy service',
    oneLiner: 'Positioning, audience and brand language that give every decision a reason.',
    description: 'Before we design anything, we figure out why you win. Positioning, audience, tone and a brand language your whole team can use.',
    deliverables: ['Brand audit', 'Competitor and category mapping', 'Positioning statement', 'Audience personas', 'Brand language and tone of voice', 'Messaging framework'],
  },
  {
    category: 'Design',
    title: 'Visual Identity & Packaging',
    tag: 'Design service',
    oneLiner: 'Logos, systems and packs that stand out on shelf and in feed.',
    description: 'Identities built as systems, not just logos. Packaging that holds its own on a shelf and on a 6-inch screen.',
    deliverables: ['Logo and wordmark', 'Colour, type and graphic system', 'Brand guidelines', 'Packaging and label design', 'AI product mockups', 'Social and ad templates'],
  },
  {
    category: 'Creative',
    title: 'AI Video & Performance Creative',
    tag: 'Creative service',
    oneLiner: 'Ads, reels and AI video built to stop the scroll and convert.',
    description: 'Scroll-stopping ads, reels and AI-generated video, made fast and tested hard. We script for the hook, design for the platform and iterate on the data.',
    deliverables: ['Ad concepts and scripts', 'Generative AI video', 'Reels and short-form edits', 'Static and carousel ads', 'Creative testing plans', 'Social media management'],
  },
  {
    category: 'Growth',
    title: 'Performance Marketing',
    tag: 'Growth service',
    oneLiner: 'Paid campaigns planned, run and scaled on ROAS and CAC, not reach.',
    description: "Full-funnel paid campaigns on Meta and Google, run by the same team that makes the creative, so ads and messaging improve together. Available on its own if your brand is already in good shape.",
    deliverables: ['Ad account and tracking audit', 'Media plan and budget split', 'Campaign setup, pixel and conversion tracking', 'Audience and funnel strategy', 'Ongoing testing and optimisation', 'Weekly ROAS and CAC reporting'],
  },
  {
    category: 'Digital',
    title: 'Websites & Apps',
    tag: 'Digital service',
    oneLiner: 'Conversion-first sites and products, designed and built end to end.',
    description: 'Sites and products designed around one job: turning visitors into customers. UX research, UI, design systems and build — in Framer, Shopify or React.',
    deliverables: ['UX audit', 'Landing pages and D2C storefronts', 'Web and app UI', 'Design systems', 'Dashboards', 'Development and launch'],
  },
]

export const workPreview = {
  heading: 'Work that moves numbers',
  subhead: 'A closer look at how we help brands get seen, chosen and remembered.',
}

// Fill every [result] with a real metric (CTR, ROAS, conversion lift, watch time) or a concrete output.
// Cards with `draft: true` stay hidden until their details are filled in.
export const cases = [
  { title: 'Ayurveda, but make it funny', client: 'Kapiva Shilajit', services: ['AI Video', 'Performance Creative'], visual: 'reel', summary: 'A 30-second comedy ad for Reels built to make a serious product stop the scroll.', result: '[result]' },
  { title: 'Sweet by the stick', client: 'Kapiva Honey Stick', services: ['AI Video', 'Performance Creative'], visual: 'honey', summary: 'Short-form video creative for a new on-the-go honey format.', result: '[result]' },
  { title: 'Yoga, built for women', client: 'BitYog', services: ['Brand', 'Performance Marketing', 'Website'], visual: 'web', summary: 'Brand, ads and a website rebuild for a women-only live yoga platform.', result: '[result]' },
  { title: 'One range, three videos', client: 'Mamaearth Onion', services: ['AI Video', 'Performance Creative'], visual: 'bottles', summary: 'A set of videos for the Onion range: hair oil, shampoo and conditioner.', result: '[result]' },
]
export const liveCases = cases.filter(c => !c.draft)

export const testimonialsSection = { heading: 'What founders say' }
// Ask Kapiva, BitYog and Mamaearth contacts for 2–3 lines each. Hidden until SHOW_TESTIMONIALS is on.
export const testimonials = [
  { quote: '[Quote from a real client]', name: '[Name]', role: '[Role], Kapiva', tone: 'a1' },
  { quote: '[Quote from a real client]', name: '[Name]', role: '[Role], BitYog', tone: 'a2' },
]

export const faqPreview = {
  heading: 'Questions, answered',
  subhead: "Everything you'd ask on a first call.",
}

export const finalCta = {
  heading: 'Ready to build your Pehchaan?',
  subhead: "Tell us where your brand is today. We'll tell you honestly what it needs next.",
  button: { label: 'Book a free call', to: '/contact' },
}

/* ---------- SERVICES PAGE ---------- */

export const servicesPage = {
  heading: 'Everything a brand needs to be seen, chosen and remembered.',
  intro: 'Most brands hire one agency for the logo, another for ads and a freelancer for the website — then wonder why nothing feels connected. We do it as one system, so your brand looks, sounds and sells the same everywhere.',
  cta: {
    heading: 'Not sure where to start?',
    body: "Most clients start with a brand audit. In one call we'll tell you what's working, what's leaking money and what to fix first.",
    button: { label: 'Book a free brand audit', to: '/contact' },
  },
}

/* ---------- WORK PAGE ---------- */

export const workPage = {
  heading: 'Work that delivers results',
  intro: "Real brands, real briefs, real numbers. Here's how we've helped D2C brands get noticed and grow.",
}

/* ---------- ABOUT PAGE ---------- */

// Brands cleared for listing, written as "A, B and C", so the About story only ever
// names brands that also appear in the logo strip
const shownClients = (() => {
  const names = clients.filter(c => c.confirmed).map(c => c.name)
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] || ''
})()

export const aboutPage = {
  heading: 'Pehchaan means identity. We build it, then we grow it.',
  intro: 'In Hindi, pehchaan is what makes someone recognisable, the face you know in a crowd. We build that for brands: a clear reason to exist and a look people spot instantly. Then we put it in front of the right people, with campaigns that turn recognition into revenue.',
  story: [
    'Pehchaan was founded in Delhi NCR in 2026 by Hemant Kumar. His work has always sat where design meets numbers: design systems and dashboards for enterprise teams, then ad creative and performance campaigns for D2C brands. On every project the same problem showed up: good products, messy identities, and marketing run separately from the brand. Strategy lived in one deck, design in another, and the ads went to someone who had never read either.',
    `So we built one team that does both: the brand people remember and the marketing that grows it. The same people shape your positioning, make the creative, run the campaigns and answer for the numbers. Brand first, built to perform.${shownClients ? ` Today, that's how we work with brands like ${shownClients}.` : ''}`,
  ],
  different: [
    { title: 'Brand and performance, one team', text: 'The people who shape your positioning also make your ads, run your campaigns and see your ROAS every week. Nothing gets lost in a handover.' },
    { title: 'Measured on money, not likes', text: "We use generative AI to make more creative and test it faster, then judge it on ROAS, CAC and conversion. Whatever doesn't pay its way gets cut." },
    { title: 'Industrial design thinking', text: 'We treat a brand like a product: every piece has a job, from the logo to the landing page to the funnel, and the whole system has to work at scale.' },
    { title: 'Global from day one', text: 'Built in Delhi NCR, working with brands across time zones.' },
  ],
  // Add people only once they've agreed to be listed.
  team: [
    { name: 'Hemant Kumar', role: 'Founder · Brand & Growth', bio: 'Leads strategy and growth at Pehchaan. Background in industrial design (B.Des, Nirma University), enterprise UX and performance marketing.' },
  ],
}

/* ---------- ENGAGEMENTS (PRICING) PAGE ---------- */

export const engagementsPage = {
  heading: 'Simple ways to work with us',
  intro: 'Pick a one-off project, a monthly partnership or an embedded team. Every engagement starts with a free call and a written scope — no surprises.',
  note: 'Need something custom? Most of our work is scoped to the brand.',
  noteLink: { label: 'Tell us what you need →', to: '/contact' },
}
export const plans = [
  { name: 'Launch', tagline: 'For brands starting out or rebranding', price: '[$X]', per: 'per project', button: 'Start a project', features: ['Brand strategy workshop', 'Logo and visual identity', 'Brand guidelines', 'Packaging or label for 1 SKU', 'Social starter kit'] },
  { name: 'Growth', tagline: 'For D2C brands ready to scale ads', price: '[$X]', per: '/ month', button: 'Book a call', popular: true, features: ['Monthly ad concepts and scripts', '[X] AI videos or reels', '[X] static ads', 'Paid campaign management', 'Creative testing and reporting', 'Social media management'] },
  { name: 'Partner', tagline: 'For brands that want a full brand and growth team on tap', price: '[$X]', per: '/ month', button: 'Talk to us', features: ['Everything in Growth', 'Website or app design and build', 'Ongoing CRO', 'Dedicated strategist', 'Contract-to-hire option'] },
]

/* ---------- CAREERS PAGE ---------- */

export const careersPage = {
  heading: 'Build brands people remember',
  intro: "We're a small studio that gives people real work from day one. If you care about craft and want to see your designs go live for real brands, we'd like to meet you.",
  perks: ['Real client briefs, not dummy tasks', 'Direct feedback from the founder', 'Access to AI tools and new workflows', 'Flexible, remote-friendly work'],
  // Confirm the starter task is paid before publishing this line.
  hiring: "Send your portfolio. If it's a fit, we'll talk for 30 minutes, then give you a short paid starter task (2–3 days) so we can work together before deciding.",
  roles: ['Visual Designer', 'Video Editor', 'Graphic Design Intern', '[Role]'],
  fallback: 'No role for you? Send your work to',
  fallbackEnd: 'anyway. We read everything.',
  // Shown instead while HIRING is off in src/config.js
  closed: {
    heading: "We're not hiring right now",
    intro: "Thanks for your interest in Pehchaan. We don't have any open roles at the moment. When that changes, they'll be listed on this page.",
    button: { label: 'See our work', to: '/work' },
  },
}

/* ---------- CONTACT PAGE ---------- */

export const contactPage = {
  heading: "Let's talk about your brand",
  intro: 'Tell us where you are and where you want to be. We reply within 24 hours on working days.',
  needs: ['Brand strategy', 'Identity & packaging', 'AI video & ads', 'Performance marketing', 'Website or app', 'Not sure yet'],
  // Budget bands aren't specified in the copy doc; adjust to suit.
  budgets: ['[Under $2,000]', '[$2,000 – $5,000]', '[$5,000 – $10,000]', '[$10,000+]', 'Not sure yet'],
  submit: 'Send it over',
  success: "Got it. We'll be in touch within 24 hours.",
}

/* ---------- FAQ ---------- */

export const faqPage = {
  heading: 'Frequently asked questions',
  subhead: "Everything you'd ask on a first call, answered upfront.",
}
export const faqs = {
  General: [
    ['What does Pehchaan do?', "We're a brand and performance studio. We help D2C and consumer brands with strategy, visual identity, packaging, AI video, performance marketing and conversion-focused websites — all as one connected system."],
    ['Are you a digital marketing agency?', "No. We don't sell SEO packages or post-and-pray social media. We build the brand, make the creative and run the paid campaigns that sell it, and we measure all of it on ROAS, CAC and conversion, not reach or likes."],
    ['Who do you work with best?', 'D2C and consumer brands — wellness, food and beverage, beauty, lifestyle — from early-stage founders to established brands launching new lines.'],
    ['Do you work with international clients?', 'Yes. We work with brands across time zones. Calls are on Zoom or Google Meet, updates are async, and we keep at least 3–4 hours of overlap with your working day.'],
    ['What does "Pehchaan" mean?', "It's Hindi for identity or recognition — the thing that makes you instantly known. That's what we build for brands."],
  ],
  Process: [
    ['How does a project start?', 'With a free 30-minute call. We learn about your brand and goals, then send a written scope, timeline and quote within [2–3] working days.'],
    ['How long does a project take?', 'A brand identity usually takes [4–6] weeks. A landing page takes [2–3] weeks, a full website [6–10] weeks. Ad creative and video run on weekly or monthly cycles.'],
    ['How many revisions do I get?', 'Two rounds per deliverable are included. We share strategy and direction early, so big surprises at the revision stage are rare.'],
    ['How will we communicate?', "One point of contact, a shared Slack or WhatsApp group, a weekly update and a shared folder for all files. You'll always know what's happening."],
    ['What do you need from me to start?', 'A signed scope, the first payment, and access to your existing brand assets, ad accounts and analytics where relevant.'],
  ],
  'Pricing & Payments': [
    ['How much do you charge?', "It depends on scope. Projects start at [USD X] and monthly retainers at [USD X]. You'll get a fixed quote before any work begins."],
    ['Do you offer retainers?', "Yes. Most ongoing creative and performance work runs on a monthly retainer. We're also open to contract-to-hire setups."],
    ['What are your payment terms?', 'Projects: [50%] upfront, [50%] on delivery. Retainers: billed monthly in advance. We accept bank transfer for Indian clients and [Wise / PayPal / Payoneer] for international clients.'],
    ['Is ad spend included in your fees?', 'No. Media budget is paid directly to Meta, Google or other platforms from your own ad account. Our fee covers strategy, creative and campaign management.'],
    ['Can I pause or cancel a retainer?', "Yes, with [30] days' written notice."],
  ],
  Services: [
    ['Can I hire you for just one thing, like a logo or an ad?', "Yes. Many clients start with one project and expand later. We'll still make sure it fits your wider brand."],
    ['Do you use AI in your work?', 'Yes, deliberately. We use generative AI for video, mockups and faster exploration, then refine everything by hand. You get more options and faster testing without a drop in quality.'],
    ['Do you build websites or only design them?', 'Both. We design and build in Framer, Shopify or custom React, depending on what your brand needs.'],
    ['Do you run the ads too?', 'Yes. We plan, launch and manage paid campaigns on Meta and Google: tracking setup, audiences, testing, budget pacing and weekly reporting on ROAS and CAC. If you already have a media buyer, we can supply the creative and work alongside them instead.'],
    ['Can we hire you only for performance marketing?', "Yes. If your brand and creative are already in good shape, we can take over your paid campaigns on their own. We start with an audit of your ad accounts and tracking, and share a plan before any budget moves."],
    ['Who owns the final work?', 'You do. Once the project is paid in full, all final files and rights transfer to you.'],
    ['Do you sign NDAs?', 'Yes, happily. Just send it over before our first call.'],
  ],
}

/* ---------- FOOTER ---------- */

export const footer = {
  about: 'Pehchaan is a brand and performance studio helping D2C brands get seen, chosen and remembered — through strategy, design, AI video, performance marketing and conversion-first web.',
  newsletter: 'Brand notes, once a month. No spam, just things that work.',
  copyright: '© 2026 Pehchaan. Made in India, for brands everywhere.',
  columns: [
    {
      title: 'Pages',
      links: [
        ['About', '/about'], ['Work', '/work'], ['Services', '/services'],
        ...(SHOW_ENGAGEMENTS ? [['Engagements', '/engagements']] : []),
        ...(HIRING ? [['Careers', '/careers']] : []),
        ['Contact', '/contact'],
      ],
    },
    { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms', '/terms']] },
    // Replace '#' with your profile URLs.
    { title: 'Social', links: [['Instagram', '#'], ['LinkedIn', '#'], ['Behance', '#'], ['X', '#']] },
  ],
}
