// Comprehensive data store for Poetic Wednesdays Initiative (PW)
// Adheres strictly to the Brand Guidelines & Website Brief

export const BRAND = {
  name: "Poetic Wednesdays Initiative",
  shortName: "Poetic Wednesdays",
  acronym: "PW",
  subtext: "Poetry, Arts, Culture & Youth Literacy",
  established: 2014,
  registered: 2020,
  creativeDirector: "Nasiba Babale",
  quote: "Pictures rarely tell the full story, but in these ones, our stomachs were full of art",
  location: "Kano, Northern Nigeria",
  address: "PW Cultural Creative Hub, Farm Centre / Zoo Road, Kano State, Nigeria",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Kano+State+Nigeria",
  email: "connect@poeticwednesdays.org",
  phone: "+234 812 345 6789",
  kapfestUrl: "https://kapfest.org.ng/",
  kalamaiSelarUrl: "https://selar.co/m/poeticwednesdays",
  substackUrl: "https://poeticwednesdays.substack.com",
  socials: {
    twitter: "https://x.com/poeticwednesday",
    instagram: "https://instagram.com/poeticwednesdays",
    facebook: "https://facebook.com/poeticwednesdaysinitiative",
    linkedin: "https://linkedin.com/company/poetic-wednesdays-initiative",
    youtube: "https://youtube.com/@poeticwednesdays"
  }
};

export const POEM_OF_THE_DAY = {
  id: "pod-1",
  title: "A Constellation of Tongues",
  poet: "Nasiba Babale",
  poetRole: "Creative Director, Poetic Wednesdays",
  location: "Kano, Nigeria",
  audioDuration: "2:45",
  theme: "Identity & Northern Soil",
  year: "2026",
  epigraph: "“To name a sorrow in the dark is to hand the morning a lantern.”",
  stanzas: [
    "We gathered where the ancient walls folded their shadows,",
    "carrying syllables like roasted groundnuts wrapped in newsprint.",
    "Someone whispered a verse from a broken chalk slate,",
    "and suddenly the room grew wider than the Sahel sky.",
    "",
    "Here, our mothers measured rhythm in the pestle’s descent,",
    "and we, their stubborn children, measure freedom in the unsaid word.",
    "Do not tell us the tongue is only made for quiet prayers;",
    "it was also forged to crack open iron doors.",
    "",
    "On every Wednesday evening,",
    "we return our bruised hearts to the ink pot,",
    "dipping until the silence bleeds light."
  ],
  analysis: "A tribute to the origins of #PoeticWednesdays ten years ago, tracing how small gatherings of young voices grew into a movement safeguarding creative expression and cultural heritage in Northern Nigeria."
};

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Unwind Session: Voices at Twilight",
    category: "Unwind Sessions",
    caption: "Poets gathering at sunset in Kano, sharing fresh drafts and raw verses with constructive peer critique.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    date: "October 2026",
    location: "Alliance Française, Kano"
  },
  {
    id: 2,
    title: "Kano International Poetry Festival (KAPFest)",
    category: "KAPFest",
    caption: "The main stage lights up with performance poets, griots, and spoken word artists celebrating West African verse.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    date: "September 2026",
    location: "KAPFest Main Auditorium, Kano"
  },
  {
    id: 3,
    title: "Youth Creative Writing Masterclass",
    category: "Workshops",
    caption: "Mentors guiding secondary school and university writers through stanza architecture and metaphorical craft.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    date: "August 2026",
    location: "PW Literary Hub, Kano"
  },
  {
    id: 4,
    title: "Open Mic & Soul Rhythm Gathering",
    category: "Open Mics",
    caption: "First-time performers stepping up to the microphone, finding courage in the collective applause of their peers.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    date: "July 2026",
    location: "Community Amphitheatre"
  },
  {
    id: 5,
    title: "NAFASI Digital Rights & Civic Space Workshop",
    category: "NAFASI Program",
    caption: "In partnership with Magamba Network, empowering African poets and cultural activists with digital safety and expression tools.",
    image: "/nafasi-poster.jpg",
    date: "September 2026 – September 2027",
    location: "Pan-African Civic Space Initiative"
  },
  {
    id: 6,
    title: "Kalamai Magazine Launch & Editorial Reading",
    category: "Publications",
    caption: "Unveiling the print & digital anthology of Kalamai, featuring over 40 emerging voices from Northern Nigeria.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    date: "June 2026",
    location: "Kano Central Library"
  }
];

export const WORK_PILLARS = [
  {
    id: "unwinds",
    title: "Unwind Sessions",
    badge: "Community Circle",
    icon: "Coffee",
    shortDesc: "Relaxed, welcoming spaces where poets and artists gather to share works-in-progress, exchange ideas, and receive constructive peer feedback.",
    fullDesc: "We host regular Unwind Sessions where poets and artists gather in relaxed, welcoming spaces to share their work, exchange ideas, and receive constructive peer feedback. These sessions are designed to encourage honest expression, build confidence, and foster meaningful connections within the creative community."
  },
  {
    id: "showcasing",
    title: "Showcasing Poets & Creative Work",
    badge: "Publishing & Archives",
    icon: "Feather",
    shortDesc: "Amplifying both emerging and established voices across Northern Nigeria and the African continent through accessible digital archives.",
    fullDesc: "Poetic Wednesdays is committed to amplifying both emerging and established voices. Through our website and digital platforms, we publish poems and creative works, providing visibility for writers and creating an accessible archive of contemporary literary expression."
  },
  {
    id: "workshops",
    title: "Workshops & Masterclasses",
    badge: "Skill-Building",
    icon: "BookOpen",
    shortDesc: "Learning sessions in creative writing, editing, and spoken word performance, both online and offline.",
    fullDesc: "We organise learning sessions in the form of creative writing workshops and masterclasses, both online and offline. These sessions focus on skill-building, mentorship, and practical guidance, helping young writers deepen their craft and grow at every stage of their creative journey."
  },
  {
    id: "interviews",
    title: "Poet Interviews & Open Mics",
    badge: "Dialogue & Stage",
    icon: "Mic",
    shortDesc: "Deep-dive interviews into the inspirations of writers paired with electrifying open mic sessions for experimental performance.",
    fullDesc: "Our poet interviews offer insight into the lives, processes, and inspirations of writers, while our open mic sessions create spaces for performance, experimentation, and discovery. Together, they nurture dialogue, confidence, and community across different levels of experience."
  },
  {
    id: "kapfest",
    title: "Kano International Poetry Festival",
    badge: "Annual Flagship",
    icon: "Globe",
    shortDesc: "A landmark festival bringing together poets, writers, and artists from diverse backgrounds for cultural exchange and celebration.",
    fullDesc: "We host the Kano International Poetry Festival (KAPFest) as a platform for literary exchange, celebration, and collaboration. The festival brings together poets, writers, and artists from diverse backgrounds to share work, ideas, and conversations that strengthen the literary ecosystem."
  },
  {
    id: "partnerships",
    title: "Collaborations & Partnerships",
    badge: "Ecosystem Building",
    icon: "Handshake",
    shortDesc: "Partnering with cultural institutions, policy advocates, and Pan-African networks like Magamba Network to create lasting systemic impact.",
    fullDesc: "Collaboration is central to our approach. We work with literary organisations, cultural platforms, and creative communities to expand access to literary opportunities, share resources, and continue creating lasting change through literature."
  }
];

export const ART_LIBRARY_ITEMS = [
  {
    id: "art-1",
    category: "Poems and Poets",
    title: "Letters from the Sahelian Dusk",
    author: "Zainab Bello",
    date: "November 2026",
    readingTime: "3 min read",
    tag: "Poetry",
    excerpt: "The harmattan winds sweep across our manuscripts, yet every stanza remains anchored in the red dust of remembrance...",
    content: `The harmattan winds sweep across our manuscripts,
yet every stanza remains anchored in the red dust of remembrance.
When the sun folds into the minarets,
we untangle our secrets into ink.

What is a city without its songs?
What is a river that refuses to carry the cries of fishermen?
We write so the future will know:
we loved fiercely,
we spoke truth when terror asked for our quiet.`
  },
  {
    id: "art-2",
    category: "Interviews",
    title: "Crafting Space for Northern Women Poets: A Conversation with Nasiba Babale",
    author: "Art Library Editorial Board",
    date: "October 2026",
    readingTime: "7 min read",
    tag: "Interview",
    excerpt: "Nasiba Babale reflects on a decade of community building, the evolution of #PoeticWednesdays, and navigating cultural nuance...",
    content: `Editorial: "Ten years ago, #PoeticWednesdays was just an exchange between friends on Facebook. How did you know this had to become an institution?"

Nasiba: "Because silence has a heavy weight. Young creatives in Kano and across Northern Nigeria possessed breathtaking vision, but lacked physical and digital havens where their work could be critiqued with love and published with dignity. Registration in 2020 formalized our commitment to advocacy, youth literacy, and legal protection for creatives."

Editorial: "What role does KAPFest play in connecting Northern Nigeria to the global literary landscape?"

Nasiba: "Kano has always been a historic crossroads of scholarship, trade, and oral performance. KAPFest doesn't merely bring the world to Kano; it reminds the world that Kano has always been a fountainhead of poetry."`
  },
  {
    id: "art-3",
    category: "Blog",
    title: "Why Youth Literacy Must Be at the Center of Cultural Policy",
    author: "PW Policy & Advocacy Desk",
    date: "September 2026",
    readingTime: "5 min read",
    tag: "Essays & Advocacy",
    excerpt: "Arts organizations are essential contributors to community development and social cohesion. Here is our roadmap for legislative protection against censorship...",
    content: `Art is not a luxury; it is the civic immune system of any democracy.

At Poetic Wednesdays Initiative, our engagement with education stakeholders, cultural institutions, and policymakers centers on three pillars:
1. Direct government funding for youth arts hubs outside metropolitan capitals.
2. Anti-censorship safeguards that protect poets, satire artists, and spoken word practitioners.
3. IP and copyright frameworks that prevent predatory exploitation and piracy of literary works.`
  },
  {
    id: "art-4",
    category: "Reports",
    title: "Annual State of Youth Literary Arts in Northern Nigeria (2025–2026)",
    author: "PW Research Unit",
    date: "August 2026",
    readingTime: "12 min read",
    tag: "Annual Report",
    excerpt: "A comprehensive empirical assessment surveying over 1,200 young writers, 45 creative hubs, and community literacy initiatives across 7 Northern states.",
    content: `Key findings from our 2025-2026 Report:
- 84% of surveyed youth poets reported increased emotional well-being and confidence through participation in weekly Unwind Sessions.
- Over 600 manuscripts were cataloged, creating one of the largest decentralized contemporary archives of Hausa and English bilingual verse.
- Legislative outreach generated draft proposals for the Kano State Creative Protections Bill.`
  },
  {
    id: "art-5",
    category: "Newsletters",
    title: "PW Dispatch #48: Words in the Wind & Submissions Open for Kalamai Vol. 4",
    author: "Poetic Wednesdays Newsletter",
    date: "November 2026",
    readingTime: "4 min read",
    tag: "Newsletter",
    excerpt: "Highlights from our recent Unwind session, announcement of the NAFASI grant with Magamba Network, and open calls for writers...",
    content: `Dear Community,
Welcome to Dispatch #48. This month has been monumental:
- NAFASI Digital Rights project is now in active implementation.
- Submissions for Kalamai Volume 4 are officially open on theme 'Resilience & Rebirth'.
- Join our upcoming Open Mic this Friday at 5:00 PM WAT.`
  },
  {
    id: "art-6",
    category: "Publications",
    title: "Kalamai Magazine: Issue III — 'The Architecture of Water'",
    author: "Poetic Wednesdays Press",
    date: "Mid 2026",
    readingTime: "112 pages (Anthology)",
    tag: "Flagship Publication",
    excerpt: "Featuring poetry, micro-prose, photography, and critical essays exploring memory, drought, rebirth, and youth resilience in the Sahel.",
    content: `Kalamai is Poetic Wednesdays' signature literary journal. 
Now available in print and digital edition via Selar.
Includes works by 35 emerging poets, bilingual translations, and visual art from northern cultural creators.`
  },
  {
    id: "art-7",
    category: "Publications",
    title: "Dirge: An Anthology of Elegy and Remembrance",
    author: "Poetic Wednesdays Press",
    date: "2024",
    readingTime: "88 pages",
    tag: "Special Edition",
    excerpt: "A hauntingly beautiful commemorative collection exploring grief, healing, and the transformative solace of communal mourning.",
    content: `Dirge brought together poets from across Nigeria to process loss and celebrate resilience. Distributed to academic libraries, community cultural centres, and downloadable digitally.`
  }
];

export const TEAM_MEMBERS = {
  board: [
    {
      name: "Prof. Fatima Mukhtar",
      role: "Board Chairperson",
      bio: "Distinguished academic, author, and cultural historian dedicated to preserving indigenous literary traditions and supporting youth arts legislation in Northern Nigeria.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Dr. Aliyu Sani",
      role: "Board Member (Cultural Policy & Governance)",
      bio: "Advocate for public arts funding with over 20 years of experience interfacing between civil society organizations and international cultural ministries.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Hajiya Aisha Umar",
      role: "Board Member (Community Outreach)",
      bio: "Literacy activist and educator spearheading grassroots reading rooms and maternal literacy programs across Kano, Jigawa, and Kaduna.",
      avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80"
    }
  ],
  youthAdvisory: [
    {
      name: "Umar Farouk Bello",
      role: "Youth Advisory Lead (Spoken Word & Digital Media)",
      bio: "Slam champion, digital storyteller, and mentor helping young poets navigate multimedia performance and civic engagement.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Maryam Inuwa",
      role: "Youth Advisory (Campus Networks)",
      bio: "Founder of university poetry circles and organizer of grassroots inter-faculty open mics in Bayero University Kano.",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Ibrahim Lawan",
      role: "Youth Advisory (Digital Rights & Tech)",
      bio: "Civic technologist collaborating on the NAFASI program to ensure digital protection and secure communications for literary activists.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    }
  ],
  executive: [
    {
      name: "Nasiba Babale",
      role: "Creative Director & Founder",
      bio: "Nasiba Babale is a visionary poet, cultural curator, and community leader who transformed the #PoeticWednesdays movement from an informal Facebook circle in 2014 into one of West Africa's most influential youth literary organizations. She directs PW's strategic artistic vision, leads policy advocacy, and oversees KAPFest and Kalamai.",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      name: "Mustapha Garba",
      role: "Programs Manager",
      bio: "Coordinates weekly Unwind Sessions, workshop logistics, open mics, and regional touring poetry caravans.",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Halima Jibril",
      role: "Editor-in-Chief (Kalamai Press)",
      bio: "Literary editor and essayist managing submissions, editorial boards, and production for Kalamai, Dirge, and the Art Library archive.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Tijjani Abubakar",
      role: "Advocacy & Partnerships Officer",
      bio: "Manages bilateral relationships with cultural institutions, Magamba Network, education ministries, and legal protection initiatives.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
    }
  ]
};

export const KALAMAI_DATA = {
  currentIssue: "Volume 3: Echoes of the Sahel",
  tagline: "The Premier Literary Journal of Northern Nigeria",
  price: "₦3,500 / $5.00 USD",
  selarLink: "https://selar.co/m/poeticwednesdays",
  description: "Kalamai is Poetic Wednesdays’ flagship journal of contemporary literature, visual arts, and cultural thought. Published biannually, it brings together fearless youth voices, searing poetry, experimental essays, and translated northern Nigerian oral heritage.",
  coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  features: [
    "Over 40 original poems and essays by emerging Northern Nigerian writers",
    "Bilingual section featuring classical and modern Hausa verse with English translations",
    "Exclusive visual art folio and photo essays",
    "In-depth roundtable on creative censorship and digital civic spaces"
  ],
  pastIssues: [
    {
      title: "Kalamai Vol. 2: Breaking the Vessel",
      year: "2025",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      status: "Available via Selar"
    },
    {
      title: "Kalamai Vol. 1: First Invocations",
      year: "2024",
      cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      status: "Archived / Digital Reprint"
    }
  ]
};
