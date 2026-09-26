import {
  CareerPath,
  RoadmapPhase,
  Module,
  Topic,
  StudyMaterial,
  Quiz,
  Project,
  AITool,
  Achievement,
  StudentProfile,
  SkillProgress,
  StudySession,
  NotificationItem
} from '../types';

export const initialCareers: CareerPath[] = [
  {
    id: 'career-fullstack',
    title: 'Full-Stack Developer + Software Engineer',
    slug: 'full-stack-developer',
    description: 'Master frontend, backend, databases, cloud, system design, and AI integration to build scalable production web applications.',
    totalPhases: 8,
    totalHours: 320,
    iconName: 'Layers',
    color: 'from-blue-600 to-indigo-600',
    recommendedRole: 'Software Development Engineer (SDE 1 / Full-Stack)',
    active: true
  },
  {
    id: 'career-aiml',
    title: 'AI / Machine Learning Engineer',
    slug: 'ai-ml-engineer',
    description: 'Learn Python, PyTorch, LLMs, RAG architectures, neural networks, vector databases, and MLOps deployment.',
    totalPhases: 6,
    totalHours: 290,
    iconName: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    recommendedRole: 'AI Application Engineer / ML Associate',
    active: false
  },
  {
    id: 'career-devops',
    title: 'Cloud & DevOps Engineer',
    slug: 'cloud-devops-engineer',
    description: 'Master Linux, Docker, Kubernetes, CI/CD pipelines, AWS/GCP cloud architecture, and Terraform IaC.',
    totalPhases: 6,
    totalHours: 260,
    iconName: 'Cloud',
    color: 'from-cyan-600 to-teal-600',
    recommendedRole: 'Cloud Solutions Specialist / DevOps Engineer',
    active: false
  },
  {
    id: 'career-data',
    title: 'Data Analyst & BI Specialist',
    slug: 'data-analyst',
    description: 'Data wrangling with SQL, Python Pandas, interactive dashboards in PowerBI/Tableau, and business intelligence.',
    totalPhases: 5,
    totalHours: 220,
    iconName: 'BarChart2',
    color: 'from-emerald-600 to-green-600',
    recommendedRole: 'Data Analyst / BI Consultant',
    active: false
  }
];

export const initialPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    careerId: 'career-fullstack',
    phaseNumber: 1,
    title: 'PHASE 1 — Programming Foundations',
    durationDays: 30,
    description: 'Master Computer Science basics, algorithmic logic, version control with Git, and the foundational trio: HTML, CSS, and modern JavaScript.',
    orderIndex: 1,
    iconName: 'Terminal'
  },
  {
    id: 'phase-2',
    careerId: 'career-fullstack',
    phaseNumber: 2,
    title: 'PHASE 2 — Frontend Development',
    durationDays: 45,
    description: 'Deep dive into asynchronous JavaScript, browser APIs, React component architecture, state management, Tailwind CSS, and responsive UI/UX.',
    orderIndex: 2,
    iconName: 'Layout'
  },
  {
    id: 'phase-3',
    careerId: 'career-fullstack',
    phaseNumber: 3,
    title: 'PHASE 3 — Backend Development',
    durationDays: 45,
    description: 'Build robust REST APIs using Node.js and Express.js, relational database schemas with PostgreSQL, Supabase integration, and JWT authentication.',
    orderIndex: 3,
    iconName: 'Server'
  },
  {
    id: 'phase-4',
    careerId: 'career-fullstack',
    phaseNumber: 4,
    title: 'PHASE 4 — Full Stack & Cloud Integration',
    durationDays: 45,
    description: 'Connect frontend and backend into unified web applications, manage secure sessions, file uploads, cloud deployments, and production security.',
    orderIndex: 4,
    iconName: 'Layers'
  },
  {
    id: 'phase-5',
    careerId: 'career-fullstack',
    phaseNumber: 5,
    title: 'PHASE 5 — Advanced Engineering & DSA',
    durationDays: 45,
    description: 'Sharpen core Data Structures & Algorithms, OOP principles, System Design fundamentals, automated unit testing, Docker, and CI/CD pipelines.',
    orderIndex: 5,
    iconName: 'Binary'
  },
  {
    id: 'phase-6',
    careerId: 'career-fullstack',
    phaseNumber: 6,
    title: 'PHASE 6 — AI + Modern Development',
    durationDays: 30,
    description: 'Harness Generative AI, LLM APIs (OpenAI/Gemini), prompt engineering, Retrieval-Augmented Generation (RAG), vector databases, and AI coding assistants.',
    orderIndex: 6,
    iconName: 'Sparkles'
  },
  {
    id: 'phase-7',
    careerId: 'career-fullstack',
    phaseNumber: 7,
    title: 'PHASE 7 — Real-World Industry Projects',
    durationDays: 45,
    description: 'Build complete, production-grade applications from scratch: modern portfolio, e-commerce platform, real-time collaboration apps, and AI-powered SaaS.',
    orderIndex: 7,
    iconName: 'FolderGit2'
  },
  {
    id: 'phase-8',
    careerId: 'career-fullstack',
    phaseNumber: 8,
    title: 'PHASE 8 — Job & Interview Preparation',
    durationDays: 30,
    description: 'Craft an ATS-optimized software engineer resume, polish your GitHub & LinkedIn, master live coding challenges, system design, and behavioral interviews.',
    orderIndex: 8,
    iconName: 'Award'
  }
];

export const initialModules: Module[] = [
  // Phase 1
  { id: 'mod-1', phaseId: 'phase-1', title: 'Computer Science Basics & CLI', description: 'Memory, CPU architecture, command line navigation, and operating system basics.', orderIndex: 1 },
  { id: 'mod-2', phaseId: 'phase-1', title: 'Programming Logic & Algorithms', description: 'Conditionals, loops, variables, function scope, and problem breakdown.', orderIndex: 2 },
  { id: 'mod-3', phaseId: 'phase-1', title: 'Git & GitHub Version Control', description: 'Repositories, commits, branching, merging, pull requests, and merge conflict resolution.', orderIndex: 3 },
  { id: 'mod-4', phaseId: 'phase-1', title: 'HTML5 Semantic Web', description: 'Semantic elements, accessibility (a11y), forms, SEO metadata, and best practices.', orderIndex: 4 },
  { id: 'mod-5', phaseId: 'phase-1', title: 'CSS3, Flexbox & CSS Grid', description: 'Box model, modern layouts with Flexbox and Grid, animations, and media queries.', orderIndex: 5 },
  { id: 'mod-6', phaseId: 'phase-1', title: 'JavaScript Fundamentals', description: 'Data types, objects, arrays, functions, array methods (map, filter, reduce), and DOM basics.', orderIndex: 6 },

  // Phase 2
  { id: 'mod-7', phaseId: 'phase-2', title: 'Advanced JavaScript & ES6+', description: 'Closures, prototypes, destructuring, rest/spread, and modern JS features.', orderIndex: 1 },
  { id: 'mod-8', phaseId: 'phase-2', title: 'Asynchronous JavaScript & Web APIs', description: 'Event loop, callbacks, Promises, Async/Await, and Fetch API.', orderIndex: 2 },
  { id: 'mod-9', phaseId: 'phase-2', title: 'React Core Architecture', description: 'JSX, functional components, props, state, component lifecycle, and virtual DOM.', orderIndex: 3 },
  { id: 'mod-10', phaseId: 'phase-2', title: 'React Hooks Mastery', description: 'useState, useEffect, useRef, useMemo, useCallback, and building custom hooks.', orderIndex: 4 },
  { id: 'mod-11', phaseId: 'phase-2', title: 'State Management & Routing', description: 'Client-side routing with React Router, Context API, and state patterns.', orderIndex: 5 },
  { id: 'mod-12', phaseId: 'phase-2', title: 'Tailwind CSS & UI Systems', description: 'Utility-first styling, responsive design tokens, dark mode, and Shadcn/UI patterns.', orderIndex: 6 },

  // Phase 3
  { id: 'mod-13', phaseId: 'phase-3', title: 'Node.js Runtime & NPM', description: 'Node event loop, fs module, path, HTTP module, and managing npm packages.', orderIndex: 1 },
  { id: 'mod-14', phaseId: 'phase-3', title: 'Express.js & RESTful API Design', description: 'Routing, middleware, request handling, response codes, and error middleware.', orderIndex: 2 },
  { id: 'mod-15', phaseId: 'phase-3', title: 'Relational Databases & SQL', description: 'Relational data modeling, DDL, DML, JOINS, aggregation, and indexing.', orderIndex: 3 },
  { id: 'mod-16', phaseId: 'phase-3', title: 'PostgreSQL & Supabase Architecture', description: 'Postgres tables, foreign keys, row level security (RLS), and Supabase client.', orderIndex: 4 },
  { id: 'mod-17', phaseId: 'phase-3', title: 'Authentication & Security Best Practices', description: 'Bcrypt hashing, JWT tokens, session cookies, CORS, helmet, and rate limiting.', orderIndex: 5 },

  // Phase 4
  { id: 'mod-18', phaseId: 'phase-4', title: 'Full-Stack Integration', description: 'Connecting React client with Express/Supabase backend with end-to-end data flow.', orderIndex: 1 },
  { id: 'mod-19', phaseId: 'phase-4', title: 'Cloud File Storage & Media', description: 'Supabase Storage buckets, file upload validation, CDN delivery, and multipart uploads.', orderIndex: 2 },
  { id: 'mod-20', phaseId: 'phase-4', title: 'Deployment & Production Ops', description: 'Vercel, Render, Railway, environment variables management, and HTTPS setup.', orderIndex: 3 },

  // Phase 5
  { id: 'mod-21', phaseId: 'phase-5', title: 'Data Structures (Arrays to Graphs)', description: 'Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Heaps, and Graphs.', orderIndex: 1 },
  { id: 'mod-22', phaseId: 'phase-5', title: 'Algorithm Techniques & Problem Solving', description: 'Two Pointers, Sliding Window, Recursion, Binary Search, DFS/BFS, and Dynamic Programming.', orderIndex: 2 },
  { id: 'mod-23', phaseId: 'phase-5', title: 'System Design Fundamentals', description: 'Scalability, Load Balancers, Caching (Redis), Database Sharding, and Microservices vs Monolith.', orderIndex: 3 },
  { id: 'mod-24', phaseId: 'phase-5', title: 'Testing & Containerization', description: 'Unit testing with Vitest/Jest, integration testing, and Docker containerization.', orderIndex: 4 },

  // Phase 6
  { id: 'mod-25', phaseId: 'phase-6', title: 'Generative AI & LLM Foundations', description: 'Transformers overview, prompt engineering strategies, zero-shot/few-shot techniques.', orderIndex: 1 },
  { id: 'mod-26', phaseId: 'phase-6', title: 'AI APIs & Function Calling', description: 'OpenAI & Google Gemini SDKs, streaming responses, structured JSON outputs.', orderIndex: 2 },
  { id: 'mod-27', phaseId: 'phase-6', title: 'RAG Architectures & Vector Databases', description: 'Embeddings, vector stores (pgvector, Pinecone), retrieval chunking, and contextual answering.', orderIndex: 3 },

  // Phase 7
  { id: 'mod-28', phaseId: 'phase-7', title: 'Beginner Projects: Fundamentals', description: 'Developer Portfolio, Task Management App, and Interactive Weather Dashboard.', orderIndex: 1 },
  { id: 'mod-29', phaseId: 'phase-7', title: 'Intermediate Projects: Full-Stack Web Apps', description: 'Full-Stack E-Commerce Store with Stripe, and Real-Time Chat Application with WebSockets.', orderIndex: 2 },
  { id: 'mod-30', phaseId: 'phase-7', title: 'Advanced Projects: AI SaaS Platform', description: 'AI-Powered Resume Analyzer & Career LMS with Supabase authentication and Stripe subscriptions.', orderIndex: 3 },

  // Phase 8
  { id: 'mod-31', phaseId: 'phase-8', title: 'Resume & Online Presence', description: 'ATS-friendly resume crafting, GitHub pinned repositories, and LinkedIn optimization.', orderIndex: 1 },
  { id: 'mod-32', phaseId: 'phase-8', title: 'Technical & Coding Interviews', description: 'Live coding mock interviews, DSA pattern recognition, and explaining complexity.', orderIndex: 2 },
  { id: 'mod-33', phaseId: 'phase-8', title: 'System Design & Behavioral Rounds', description: 'STAR method responses, culture fit, architectural whiteboarding, and salary negotiation.', orderIndex: 3 }
];

export const initialTopics: Topic[] = [
  // Phase 1 - Mod 1
  {
    id: 'top-1',
    moduleId: 'mod-1',
    phaseId: 'phase-1',
    title: 'How Computers Work & The Terminal Command Line',
    description: 'Understand binary, CPU, RAM, disk storage, and essential bash/powershell commands (cd, ls, mkdir, rm, grep).',
    estimatedMinutes: 45,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-10T14:30:00Z',
    dayNumber: 1,
    tags: ['CLI', 'OS', 'Fundamentals'],
    orderIndex: 1
  },
  {
    id: 'top-2',
    moduleId: 'mod-1',
    phaseId: 'phase-1',
    title: 'Web Architecture: Clients, Servers & DNS',
    description: 'Learn the journey of a URL request, DNS resolution, IP addresses, HTTP protocol, and response headers.',
    estimatedMinutes: 50,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-11T16:00:00Z',
    dayNumber: 2,
    tags: ['Networking', 'HTTP', 'Web Basics'],
    orderIndex: 2
  },
  // Phase 1 - Mod 2
  {
    id: 'top-3',
    moduleId: 'mod-2',
    phaseId: 'phase-1',
    title: 'Computational Thinking & Algorithmic Problem Solving',
    description: 'Decompose complex problems into pseudo-code, flowcharts, variables, branches, and iterative loops.',
    estimatedMinutes: 60,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-12T11:20:00Z',
    dayNumber: 3,
    tags: ['Logic', 'Algorithms', 'Problem Solving'],
    orderIndex: 1
  },
  // Phase 1 - Mod 3
  {
    id: 'top-4',
    moduleId: 'mod-3',
    phaseId: 'phase-1',
    title: 'Git Version Control & GitHub Essentials',
    description: 'Initialize repos, staging, committing, creating feature branches, pull requests, and resolving merge conflicts.',
    estimatedMinutes: 60,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-13T10:00:00Z',
    dayNumber: 4,
    tags: ['Git', 'GitHub', 'DevTools'],
    orderIndex: 1
  },
  // Phase 1 - Mod 4
  {
    id: 'top-5',
    moduleId: 'mod-4',
    phaseId: 'phase-1',
    title: 'HTML5 Semantic Tags & Web Accessibility',
    description: 'Structure clean pages using header, nav, main, section, article, footer, forms, and ARIA labels.',
    estimatedMinutes: 45,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-14T09:15:00Z',
    dayNumber: 5,
    tags: ['HTML5', 'Accessibility', 'Frontend'],
    orderIndex: 1
  },
  // Phase 1 - Mod 5
  {
    id: 'top-6',
    moduleId: 'mod-5',
    phaseId: 'phase-1',
    title: 'CSS Box Model, Flexbox & Responsive Layouts',
    description: 'Master margins, paddings, borders, flex container properties, justify/align, and media query breakpoints.',
    estimatedMinutes: 75,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-15T15:30:00Z',
    dayNumber: 6,
    tags: ['CSS', 'Flexbox', 'Responsive'],
    orderIndex: 1
  },
  {
    id: 'top-7',
    moduleId: 'mod-5',
    phaseId: 'phase-1',
    title: 'CSS Grid Layouts & Modern Responsive Design',
    description: 'Two-dimensional grid tracks, auto-fit, minmax, template areas, and mobile-first design strategy.',
    estimatedMinutes: 60,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-16T17:00:00Z',
    dayNumber: 7,
    tags: ['CSS Grid', 'Layouts', 'UI'],
    orderIndex: 2
  },
  // Phase 1 - Mod 6
  {
    id: 'top-8',
    moduleId: 'mod-6',
    phaseId: 'phase-1',
    title: 'JavaScript Types, Variables & Conditionals',
    description: 'Primitive types vs reference types, let/const, equality operators (===), truthy/falsy, and switch statements.',
    estimatedMinutes: 60,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-17T12:00:00Z',
    dayNumber: 8,
    tags: ['JavaScript', 'Basics', 'Syntax'],
    orderIndex: 1
  },
  {
    id: 'top-9',
    moduleId: 'mod-6',
    phaseId: 'phase-1',
    title: 'JavaScript Functions, Scope & Array Methods',
    description: 'Arrow functions, lexical scope, callbacks, and essential methods: map, filter, reduce, find, some, and every.',
    estimatedMinutes: 75,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-18T14:45:00Z',
    dayNumber: 9,
    tags: ['JavaScript', 'Arrays', 'Functional'],
    orderIndex: 2
  },
  {
    id: 'top-10',
    moduleId: 'mod-6',
    phaseId: 'phase-1',
    title: 'DOM Manipulation & Interactive Event Listeners',
    description: 'Selecting elements, modifying attributes, event bubbling, delegation, and building an interactive to-do list.',
    estimatedMinutes: 90,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-19T18:00:00Z',
    dayNumber: 10,
    tags: ['DOM', 'Events', 'JavaScript'],
    orderIndex: 3
  },

  // Phase 2 - Mod 7
  {
    id: 'top-11',
    moduleId: 'mod-7',
    phaseId: 'phase-2',
    title: 'JavaScript ES6+: Destructuring, Rest & Spread',
    description: 'Object and array destructuring, default parameters, template literals, and spread operator in immutable workflows.',
    estimatedMinutes: 45,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-20T11:00:00Z',
    dayNumber: 11,
    tags: ['ES6', 'JavaScript', 'Modern Syntax'],
    orderIndex: 1
  },
  {
    id: 'top-12',
    moduleId: 'mod-7',
    phaseId: 'phase-2',
    title: 'Closures, Lexical Scope & The Event Loop',
    description: 'Deep dive into call stack, Web APIs, microtask queue, macrotask queue, and closure memory retention.',
    estimatedMinutes: 75,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-21T13:30:00Z',
    dayNumber: 12,
    tags: ['JavaScript', 'Closures', 'Event Loop'],
    orderIndex: 2
  },
  // Phase 2 - Mod 8
  {
    id: 'top-13',
    moduleId: 'mod-8',
    phaseId: 'phase-2',
    title: 'Promises, Async/Await & Error Handling',
    description: 'Promise states, chaining, Promise.all, async/await syntax, try/catch blocks, and asynchronous error boundaries.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-22T16:00:00Z',
    dayNumber: 13,
    tags: ['Async', 'Promises', 'Error Handling'],
    orderIndex: 1
  },
  {
    id: 'top-14',
    moduleId: 'mod-8',
    phaseId: 'phase-2',
    title: 'Fetch API & Consuming Third-Party REST APIs',
    description: 'Making GET/POST requests, HTTP request headers, JSON serialization, loading states, and handling network errors.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-23T10:00:00Z',
    dayNumber: 14,
    tags: ['Fetch', 'REST API', 'HTTP'],
    orderIndex: 2
  },
  // Phase 2 - Mod 9
  {
    id: 'top-15',
    moduleId: 'mod-9',
    phaseId: 'phase-2',
    title: 'React Fundamentals: JSX, Props & Components',
    description: 'Setting up a Vite React project, creating components, passing props, conditional rendering, and rendering lists with keys.',
    estimatedMinutes: 75,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-24T12:00:00Z',
    dayNumber: 15,
    tags: ['React', 'JSX', 'Frontend'],
    orderIndex: 1
  },
  {
    id: 'top-16',
    moduleId: 'mod-9',
    phaseId: 'phase-2',
    title: 'useState & State Management in Components',
    description: 'Managing primitive and object state, immutable state updates, derived state, and lifting state up to parent components.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: true,
    completedAt: '2026-09-25T15:20:00Z',
    dayNumber: 16,
    tags: ['React', 'Hooks', 'State'],
    orderIndex: 2
  },
  // Phase 2 - Mod 10 (TODAY'S PLAN FOCUS)
  {
    id: 'top-17',
    moduleId: 'mod-10',
    phaseId: 'phase-2',
    title: 'useEffect Lifecycle & API Data Fetching',
    description: 'Dependency arrays, cleaning up event listeners/timers, preventing infinite re-renders, and fetching data on mount.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 17,
    tags: ['React', 'useEffect', 'Side Effects'],
    orderIndex: 1
  },
  {
    id: 'top-18',
    moduleId: 'mod-10',
    phaseId: 'phase-2',
    title: 'useRef, useMemo & useCallback Performance',
    description: 'Accessing DOM nodes with useRef, persistent values without re-rendering, memoizing expensive calculations and functions.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 18,
    tags: ['Performance', 'React Hooks', 'Optimization'],
    orderIndex: 2
  },
  {
    id: 'top-19',
    moduleId: 'mod-10',
    phaseId: 'phase-2',
    title: 'Building Custom React Hooks',
    description: 'Extracting reusable component logic into custom hooks like useFetch, useLocalStorage, and useDebounce.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 19,
    tags: ['Custom Hooks', 'Reusability', 'React'],
    orderIndex: 3
  },
  // Phase 2 - Mod 11
  {
    id: 'top-20',
    moduleId: 'mod-11',
    phaseId: 'phase-2',
    title: 'Client-Side Routing with React Router v6',
    description: 'Configuring createBrowserRouter, Outlet, dynamic route params, programmatic navigation with useNavigate, and 404 pages.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 20,
    tags: ['React Router', 'Navigation', 'SPA'],
    orderIndex: 1
  },
  {
    id: 'top-21',
    moduleId: 'mod-11',
    phaseId: 'phase-2',
    title: 'Global State Management with Context API',
    description: 'Creating context providers, custom consumer hooks, managing user authentication and theme state across the component tree.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 21,
    tags: ['Context API', 'State', 'Architecture'],
    orderIndex: 2
  },
  // Phase 2 - Mod 12
  {
    id: 'top-22',
    moduleId: 'mod-12',
    phaseId: 'phase-2',
    title: 'Tailwind CSS Mastery & Modern Design Systems',
    description: 'Configuring themes, color palettes, dark mode classes, transitions, glassmorphism, and responsive utility layouts.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 22,
    tags: ['Tailwind CSS', 'Design System', 'Styling'],
    orderIndex: 1
  },

  // Phase 3 - Mod 13
  {
    id: 'top-23',
    moduleId: 'mod-13',
    phaseId: 'phase-3',
    title: 'Node.js Architecture & Global Modules',
    description: 'V8 engine, libuv, asynchronous file system operations, process environment, and package.json management.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 23,
    tags: ['Node.js', 'Backend', 'Runtime'],
    orderIndex: 1
  },
  // Phase 3 - Mod 14
  {
    id: 'top-24',
    moduleId: 'mod-14',
    phaseId: 'phase-3',
    title: 'Building RESTful APIs with Express.js',
    description: 'Setting up routes, request parameters, JSON body parsing, query strings, and standard HTTP response status codes.',
    estimatedMinutes: 75,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 24,
    tags: ['Express.js', 'REST API', 'Backend'],
    orderIndex: 1
  },
  {
    id: 'top-25',
    moduleId: 'mod-14',
    phaseId: 'phase-3',
    title: 'Custom Middleware & Centralized Error Handling',
    description: 'Writing logging middleware, authentication checks, request validation with Zod, and global error handling handlers.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 25,
    tags: ['Middleware', 'Express.js', 'Validation'],
    orderIndex: 2
  },
  // Phase 3 - Mod 15
  {
    id: 'top-26',
    moduleId: 'mod-15',
    phaseId: 'phase-3',
    title: 'Relational Database Design & SQL Essentials',
    description: 'Primary keys, foreign keys, 1-to-many & many-to-many relationships, normalization, and writing INNER/LEFT JOIN queries.',
    estimatedMinutes: 90,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 26,
    tags: ['SQL', 'Databases', 'Relational'],
    orderIndex: 1
  },
  // Phase 3 - Mod 16
  {
    id: 'top-27',
    moduleId: 'mod-16',
    phaseId: 'phase-3',
    title: 'PostgreSQL & Supabase Real-Time Backend',
    description: 'Supabase dashboard, Postgres schema creation, table triggers, SQL functions, and executing queries via Supabase client.',
    estimatedMinutes: 75,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 27,
    tags: ['Supabase', 'PostgreSQL', 'Cloud DB'],
    orderIndex: 1
  },
  {
    id: 'top-28',
    moduleId: 'mod-16',
    phaseId: 'phase-3',
    title: 'Row Level Security (RLS) & Multi-Tenant Policies',
    description: 'Securing PostgreSQL tables with Supabase RLS policies, auth.uid() comparisons, and role-based permissions.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 28,
    tags: ['RLS', 'Security', 'Supabase'],
    orderIndex: 2
  },
  // Phase 3 - Mod 17
  {
    id: 'top-29',
    moduleId: 'mod-17',
    phaseId: 'phase-3',
    title: 'Authentication: Passwords, Bcrypt & JWT Sessions',
    description: 'Password hashing with salt rounds, signing and verifying JSON Web Tokens (JWT), refresh tokens, and cookie security.',
    estimatedMinutes: 90,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 29,
    tags: ['Auth', 'JWT', 'Security'],
    orderIndex: 1
  },
  {
    id: 'top-30',
    moduleId: 'mod-17',
    phaseId: 'phase-3',
    title: 'API Security: CORS, Rate Limiting & Helmet',
    description: 'Preventing cross-origin attacks, brute-force mitigation with express-rate-limit, SQL injection defense, and sanitization.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 30,
    tags: ['API Security', 'CORS', 'Best Practices'],
    orderIndex: 2
  },

  // Phase 4 - Mod 18
  {
    id: 'top-31',
    moduleId: 'mod-18',
    phaseId: 'phase-4',
    title: 'Full-Stack Integration: React + Express + Supabase',
    description: 'Configuring API services in React, managing server loading and error states, and synchronizing optimistic updates.',
    estimatedMinutes: 90,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 31,
    tags: ['Full-Stack', 'Integration', 'Architecture'],
    orderIndex: 1
  },
  // Phase 4 - Mod 19
  {
    id: 'top-32',
    moduleId: 'mod-19',
    phaseId: 'phase-4',
    title: 'Cloud File Uploads with Supabase Storage',
    description: 'Creating storage buckets, file size and MIME-type client/server validations, public vs private URLs, and image avatars.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 32,
    tags: ['Storage', 'File Upload', 'Supabase'],
    orderIndex: 1
  },
  // Phase 4 - Mod 20
  {
    id: 'top-33',
    moduleId: 'mod-20',
    phaseId: 'phase-4',
    title: 'Production Deployment & Environment Variables',
    description: 'Deploying frontend on Vercel/Netlify, backend on Render, setting production env variables, and automated build checks.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 33,
    tags: ['Deployment', 'Vercel', 'DevOps'],
    orderIndex: 1
  },

  // Phase 5 - Mod 21 & 22
  {
    id: 'top-34',
    moduleId: 'mod-21',
    phaseId: 'phase-5',
    title: 'Data Structures: Arrays, HashMaps & Two Pointers',
    description: 'Time & space complexity analysis (Big-O), HashMap frequency counters, and solving Two Pointers interview problems.',
    estimatedMinutes: 90,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 34,
    tags: ['DSA', 'Arrays', 'Big-O'],
    orderIndex: 1
  },
  {
    id: 'top-35',
    moduleId: 'mod-21',
    phaseId: 'phase-5',
    title: 'Data Structures: Linked Lists, Stacks & Queues',
    description: 'Singly and doubly linked lists, reverse linked list, stack monotonic problems, and sliding window maximum with queues.',
    estimatedMinutes: 90,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 35,
    tags: ['DSA', 'Stacks', 'Queues'],
    orderIndex: 2
  },
  {
    id: 'top-36',
    moduleId: 'mod-22',
    phaseId: 'phase-5',
    title: 'Binary Trees, BFS, DFS & Binary Search Trees',
    description: 'Tree traversals (in-order, pre-order, level-order), tree depth, BST validation, and lowest common ancestor.',
    estimatedMinutes: 90,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 36,
    tags: ['DSA', 'Trees', 'BFS/DFS'],
    orderIndex: 1
  },
  // Phase 5 - Mod 23 & 24
  {
    id: 'top-37',
    moduleId: 'mod-23',
    phaseId: 'phase-5',
    title: 'System Design: Scalability, Caching & Load Balancing',
    description: 'Vertical vs horizontal scaling, Nginx/Cloudflare load balancing, Redis caching strategies, and CDN caching headers.',
    estimatedMinutes: 90,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 37,
    tags: ['System Design', 'Caching', 'Architecture'],
    orderIndex: 1
  },
  {
    id: 'top-38',
    moduleId: 'mod-24',
    phaseId: 'phase-5',
    title: 'Docker Containerization & GitHub Actions CI/CD',
    description: 'Writing Dockerfiles, multi-stage builds, docker-compose for local services, and automated CI tests with GitHub Actions.',
    estimatedMinutes: 75,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 38,
    tags: ['Docker', 'CI/CD', 'DevOps'],
    orderIndex: 1
  },

  // Phase 6 - Mod 25, 26, 27
  {
    id: 'top-39',
    moduleId: 'mod-25',
    phaseId: 'phase-6',
    title: 'Generative AI & Modern LLM Integration',
    description: 'Understanding LLM temperature, context windows, system prompts, few-shot prompting, and developer workflow acceleration.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 39,
    tags: ['GenAI', 'LLM', 'Prompting'],
    orderIndex: 1
  },
  {
    id: 'top-40',
    moduleId: 'mod-26',
    phaseId: 'phase-6',
    title: 'Integrating OpenAI & Gemini APIs with Streaming',
    description: 'Using official SDKs, handling streaming text chunks in React UI, structured JSON function calling, and token limits.',
    estimatedMinutes: 75,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 40,
    tags: ['AI APIs', 'Streaming', 'Full-Stack'],
    orderIndex: 1
  },
  {
    id: 'top-41',
    moduleId: 'mod-27',
    phaseId: 'phase-6',
    title: 'RAG Architectures & Vector Search with pgvector',
    description: 'Generating text embeddings, storing high-dimensional vectors in PostgreSQL using pgvector, similarity search, and RAG pipelines.',
    estimatedMinutes: 90,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 41,
    tags: ['RAG', 'Vector DB', 'pgvector'],
    orderIndex: 1
  },

  // Phase 7 - Projects
  {
    id: 'top-42',
    moduleId: 'mod-28',
    phaseId: 'phase-7',
    title: 'Capstone: Developer Portfolio Website',
    description: 'Build and deploy a responsive, high-performance portfolio featuring projects, skills, contact form, and dark mode.',
    estimatedMinutes: 120,
    difficulty: 'Beginner',
    isCompleted: true,
    completedAt: '2026-09-24T18:00:00Z',
    dayNumber: 42,
    tags: ['Project', 'Portfolio', 'Showcase'],
    orderIndex: 1
  },
  {
    id: 'top-43',
    moduleId: 'mod-29',
    phaseId: 'phase-7',
    title: 'Capstone: Full-Stack E-Commerce Platform',
    description: 'Build product catalog, shopping cart, authentication, checkout flow, order management, and admin dashboard.',
    estimatedMinutes: 180,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 43,
    tags: ['Project', 'E-Commerce', 'Full-Stack'],
    orderIndex: 1
  },
  {
    id: 'top-44',
    moduleId: 'mod-30',
    phaseId: 'phase-7',
    title: 'Capstone: AI Career Assistant & SaaS Platform',
    description: 'Build an interactive AI learning companion with custom roadmap generator, chat assistance, and Supabase database.',
    estimatedMinutes: 180,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 44,
    tags: ['Project', 'AI SaaS', 'Production'],
    orderIndex: 1
  },

  // Phase 8 - Job Prep
  {
    id: 'top-45',
    moduleId: 'mod-31',
    phaseId: 'phase-8',
    title: 'ATS Resume Engineering & Portfolio Audit',
    description: 'Craft high-impact bullet points with metrics (Action + Context + Result), pass ATS scanners, and showcase key tech.',
    estimatedMinutes: 90,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 45,
    tags: ['Resume', 'Career', 'ATS'],
    orderIndex: 1
  },
  {
    id: 'top-46',
    moduleId: 'mod-32',
    phaseId: 'phase-8',
    title: 'Technical Coding Interview Mastery',
    description: 'Master the 5-step technical interview framework: clarify, define examples, discuss brute force, optimize, and write bug-free code.',
    estimatedMinutes: 120,
    difficulty: 'Advanced',
    isCompleted: false,
    dayNumber: 46,
    tags: ['Interview', 'Live Coding', 'SDE'],
    orderIndex: 1
  },
  {
    id: 'top-47',
    moduleId: 'mod-33',
    phaseId: 'phase-8',
    title: 'Behavioral Interviews (STAR Method) & Offer Negotiation',
    description: 'Structure behavioral answers for leadership, conflict resolution, failure lessons, and evaluating compensation offers.',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    isCompleted: false,
    dayNumber: 47,
    tags: ['Behavioral', 'STAR', 'HR Round'],
    orderIndex: 1
  }
];

export const initialStudyMaterials: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Full-Stack Web Development Roadmap & Architecture Guide',
    description: 'Comprehensive 48-page visual reference manual covering client-server models, HTTP, REST APIs, and microservices.',
    category: 'Programming',
    type: 'PDF',
    difficulty: 'Beginner',
    estimatedMinutes: 45,
    resourceUrl: 'https://roadmap.sh/full-stack',
    isCompleted: true,
    phaseId: 'phase-1',
    authorOrProvider: 'CareerForge Engineering Team'
  },
  {
    id: 'mat-2',
    title: 'Modern JavaScript (ES6 to ES2024) Deep Dive Guide',
    description: 'In-depth reference covering closures, prototype inheritance, event loop, Promises, and memory management in V8.',
    category: 'Frontend',
    type: 'Documentation',
    difficulty: 'Intermediate',
    estimatedMinutes: 60,
    resourceUrl: 'https://javascript.info/',
    isCompleted: true,
    phaseId: 'phase-2',
    authorOrProvider: 'JavaScript.info & MDN Web Docs'
  },
  {
    id: 'mat-3',
    title: 'React 18 & 19 Complete Architecture & Hooks Blueprint',
    description: 'Interactive guide to understanding React concurrency, server components, custom hooks, and state lifecycles.',
    category: 'Frontend',
    type: 'Article',
    difficulty: 'Intermediate',
    estimatedMinutes: 50,
    resourceUrl: 'https://react.dev/learn',
    isCompleted: true,
    phaseId: 'phase-2',
    authorOrProvider: 'Official React Documentation'
  },
  {
    id: 'mat-4',
    title: 'Express.js Production Handbook: Patterns & Best Practices',
    description: 'Clean architectural patterns for Node.js, middleware layering, Zod validation, JWT security, and Docker packaging.',
    category: 'Backend',
    type: 'Documentation',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    resourceUrl: 'https://expressjs.com/en/starter/installing.html',
    isCompleted: false,
    phaseId: 'phase-3',
    authorOrProvider: 'Node/Express Core Foundation'
  },
  {
    id: 'mat-5',
    title: 'PostgreSQL & Supabase Row Level Security (RLS) Guide',
    description: 'Learn to write fine-grained database security policies, prevent data leaks, and optimize multi-tenant query speeds.',
    category: 'Database',
    type: 'Documentation',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    resourceUrl: 'https://supabase.com/docs/guides/auth/row-level-security',
    isCompleted: false,
    phaseId: 'phase-3',
    authorOrProvider: 'Supabase Engineering Docs'
  },
  {
    id: 'mat-6',
    title: 'Data Structures & Algorithms Interview Masterclass',
    description: 'Curated 75 essential LeetCode/Blind75 problem patterns with step-by-step visual explanations and space-time breakdowns.',
    category: 'DSA',
    type: 'Course',
    difficulty: 'Advanced',
    estimatedMinutes: 120,
    resourceUrl: 'https://neetcode.io/roadmap',
    isCompleted: false,
    phaseId: 'phase-5',
    authorOrProvider: 'NeetCode & TechLead'
  },
  {
    id: 'mat-7',
    title: 'System Design for Software Engineers Primer',
    description: 'How to design scalable web architectures: caching, CDN, sharding, replication, message queues, and load balancing.',
    category: 'System Design',
    type: 'GitHub Repository',
    difficulty: 'Advanced',
    estimatedMinutes: 90,
    resourceUrl: 'https://github.com/donnemartin/system-design-primer',
    isCompleted: false,
    phaseId: 'phase-5',
    authorOrProvider: 'Donne Martin'
  },
  {
    id: 'mat-8',
    title: 'Generative AI & LLM Engineering for Web Developers',
    description: 'Build production AI apps with OpenAI, Google Gemini, prompt chaining, function calling, and pgvector embeddings.',
    category: 'AI',
    type: 'Article',
    difficulty: 'Intermediate',
    estimatedMinutes: 45,
    resourceUrl: 'https://platform.openai.com/docs/guides/text-generation',
    isCompleted: false,
    phaseId: 'phase-6',
    authorOrProvider: 'DeepLearning.AI / OpenAI'
  },
  {
    id: 'mat-9',
    title: 'Git & GitHub Pro Workflow: Branching & Merge Conflicts',
    description: 'Interactive visual cheat sheet for git rebase, cherry-pick, stash, pull requests, and CI/CD status checks.',
    category: 'Git/GitHub',
    type: 'PDF',
    difficulty: 'Beginner',
    estimatedMinutes: 30,
    resourceUrl: 'https://git-scm.com/doc',
    isCompleted: true,
    phaseId: 'phase-1',
    authorOrProvider: 'GitHub Education'
  },
  {
    id: 'mat-10',
    title: 'Docker & Microservices Starter Kit for Full-Stack Developers',
    description: 'Hands-on guide to containerizing React frontends, Node backends, and Postgres databases with docker-compose.',
    category: 'DevOps',
    type: 'GitHub Repository',
    difficulty: 'Intermediate',
    estimatedMinutes: 60,
    resourceUrl: 'https://docs.docker.com/get-started/',
    isCompleted: false,
    phaseId: 'phase-5',
    authorOrProvider: 'Docker Community'
  },
  {
    id: 'mat-11',
    title: 'Software Engineer Resume Blueprint & ATS Review Checklist',
    description: 'Actionable template and 25-point checklist used by engineers landing interviews at Google, Microsoft, and Amazon.',
    category: 'Interview Preparation',
    type: 'PDF',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    resourceUrl: 'https://www.careercup.com/resume',
    isCompleted: false,
    phaseId: 'phase-8',
    authorOrProvider: 'Tech Interview Handbook'
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-js-basics',
    title: 'JavaScript Fundamentals & ES6+ Assessment',
    description: 'Test your understanding of scopes, closures, array methods, destructuring, and async control flow.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 70,
    completed: true,
    lastScore: 90,
    attemptedAt: '2026-09-22T17:00:00Z',
    questions: [
      {
        id: 'q1',
        question: 'What will be the output of `console.log(typeof NaN)` in JavaScript?',
        options: ['"undefined"', '"number"', '"NaN"', '"object"'],
        correctAnswer: 1,
        explanation: 'In JavaScript, NaN (Not-a-Number) is a numeric data type representing an unrepresentable value, so `typeof NaN === "number"`.',
        difficulty: 'Beginner'
      },
      {
        id: 'q2',
        question: 'Which method creates a new array with the results of calling a provided function on every element in the calling array?',
        options: ['forEach()', 'filter()', 'map()', 'reduce()'],
        correctAnswer: 2,
        explanation: '`map()` executes a callback on each element and returns a brand new array with transformed elements without mutating the source.',
        difficulty: 'Beginner'
      },
      {
        id: 'q3',
        question: 'What is a closure in JavaScript?',
        options: [
          'A method to close a browser tab or window',
          'A function bundled together with references to its surrounding lexical environment',
          'A syntax error that prevents a script from running',
          'An encrypted JSON object sent over HTTPS'
        ],
        correctAnswer: 1,
        explanation: 'A closure gives an inner function access to an outer function’s scope even after the outer function has executed.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q4',
        question: 'How do you prevent `Promise.all([p1, p2])` from rejecting immediately if one of the promises fails?',
        options: ['Use Promise.race()', 'Use Promise.allSettled()', 'Use Promise.any()', 'Use Promise.catch()'],
        correctAnswer: 1,
        explanation: '`Promise.allSettled()` waits for all input promises to either resolve or reject, returning an array of objects describing each result.',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'quiz-react-hooks',
    title: 'React Architecture & Hooks Mastery Quiz',
    description: 'Evaluate your knowledge of component lifecycles, useState, useEffect, dependencies, and performance hooks.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 75,
    completed: false,
    questions: [
      {
        id: 'rq1',
        question: 'What happens if you omit the dependency array in a `useEffect(fn)` call?',
        options: [
          'The effect runs only once after the initial render',
          'The effect never runs',
          'The effect runs after every single render of the component',
          'React throws a compilation error'
        ],
        correctAnswer: 2,
        explanation: 'Without a dependency array, React invokes the effect callback after every render cycle, which can cause severe performance issues or infinite loops if state is updated inside.',
        difficulty: 'Beginner'
      },
      {
        id: 'rq2',
        question: 'Why should you use `useCallback` when passing callbacks to optimized child components?',
        options: [
          'To make the function run asynchronously on another CPU thread',
          'To preserve the same function reference between renders and prevent unnecessary child re-renders',
          'To automatically catch uncaught JavaScript exceptions',
          'To convert regular functions into generator functions'
        ],
        correctAnswer: 1,
        explanation: '`useCallback` caches a function definition between renders, ensuring child components wrapped in `React.memo` do not re-render due to reference inequality.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rq3',
        question: 'Which of the following is TRUE about the Virtual DOM in React?',
        options: [
          'It is a lightweight JavaScript representation of the actual DOM',
          'It completely replaces the browser DOM and runs faster in hardware',
          'It is only used when server-side rendering is enabled',
          'It directly manipulates browser layout engine pipelines'
        ],
        correctAnswer: 0,
        explanation: 'React compares the previous Virtual DOM tree with the new one (diffing) and batches minimal real DOM updates.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rq4',
        question: 'What is the purpose of the `key` prop when rendering dynamic lists in React?',
        options: [
          'It sets the CSS class name for styling elements',
          'It helps React identify which items have changed, been added, or been removed',
          'It encrypts sensitive list data in the DOM',
          'It is required by HTML5 specification for accessibility'
        ],
        correctAnswer: 1,
        explanation: 'Keys give elements a stable identity across renders, preventing bugs and allowing React to preserve component state during reorders.',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'quiz-backend-sql',
    title: 'Node.js, Express & SQL Database Concepts',
    description: 'Test your understanding of REST status codes, SQL joins, database indexes, and JWT authentication.',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    passingScore: 70,
    completed: false,
    questions: [
      {
        id: 'bq1',
        question: 'Which HTTP status code is most appropriate when a client request lacks valid authentication credentials?',
        options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
        correctAnswer: 1,
        explanation: '401 Unauthorized indicates that the request requires user authentication credentials. 403 Forbidden indicates the user is known but lacks permissions.',
        difficulty: 'Beginner'
      },
      {
        id: 'bq2',
        question: 'What does an index do on a PostgreSQL database table?',
        options: [
          'It automatically deletes duplicate rows',
          'It encrypts all columns in the table',
          'It speeds up data retrieval queries (SELECT) at the cost of slight overhead on INSERT/UPDATE',
          'It converts SQL queries into JSON responses'
        ],
        correctAnswer: 2,
        explanation: 'Indexes create balanced tree (B-tree) lookup structures allowing quick searches without scanning every row in the table.',
        difficulty: 'Intermediate'
      },
      {
        id: 'bq3',
        question: 'What are the three parts of a JSON Web Token (JWT)?',
        options: [
          'Key, Value, Timestamp',
          'Header, Payload, Signature',
          'Origin, Protocol, Certificate',
          'Algorithm, Hash, Salt'
        ],
        correctAnswer: 1,
        explanation: 'A JWT is composed of Header (metadata & algorithm), Payload (claims/user data), and Signature (HMAC or RSA hash to verify authenticity).',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Modern Developer Portfolio & Showcase',
    description: 'High-performance personal website featuring dynamic project galleries, dark/light theme, interactive resume viewer, and contact form.',
    difficulty: 'Beginner',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    estimatedDuration: '10 Days',
    requirements: [
      'Responsive design across mobile, tablet, and widescreen desktop',
      'Dark and light theme toggle with smooth transition',
      'Showcase minimum 3 projects with live demo links and GitHub links',
      'Contact form with email integration or Supabase persistence',
      'Lighthouse score above 90 in Performance and Accessibility'
    ],
    githubUrl: 'https://github.com/pravinth-dev/portfolio-showcase',
    liveUrl: 'https://pravinth-portfolio.vercel.app',
    screenshots: [],
    progress: 100,
    status: 'Completed',
    category: 'Beginner'
  },
  {
    id: 'proj-2',
    title: 'Real-Time Task & Project Kanban Board',
    description: 'Collaborative task management application with drag-and-drop workflow columns, priority tags, search filters, and progress tracking.',
    difficulty: 'Intermediate',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    estimatedDuration: '14 Days',
    requirements: [
      'User authentication (Email/Password & OAuth)',
      'Multiple boards with To Do, In Progress, Review, and Done columns',
      'Optimistic UI drag-and-drop state synchronization',
      'Row Level Security policies protecting user-specific tasks'
    ],
    githubUrl: 'https://github.com/pravinth-dev/kanban-flow',
    liveUrl: 'https://kanban-flow-demo.vercel.app',
    screenshots: [],
    progress: 75,
    status: 'Development',
    category: 'Intermediate'
  },
  {
    id: 'proj-3',
    title: 'Full-Stack E-Commerce Store with Checkout',
    description: 'Production-ready online shop with product search, category filters, cart persistence, stripe payments, and order tracking.',
    difficulty: 'Intermediate',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe'],
    estimatedDuration: '21 Days',
    requirements: [
      'Product catalog with pagination, debounced search, and price filters',
      'Shopping cart state persisted in localStorage and synced to DB',
      'Secure payment processing using Stripe webhooks',
      'Admin portal for adding products and viewing customer orders'
    ],
    githubUrl: 'https://github.com/pravinth-dev/nexus-store',
    liveUrl: '',
    screenshots: [],
    progress: 40,
    status: 'Planning',
    category: 'Intermediate'
  },
  {
    id: 'proj-4',
    title: 'AI CareerForge & Intelligent Learning Assistant',
    description: 'Full-stack AI-powered learning management platform that generates personalized roadmaps, tracks daily study sessions, and provides interview prep.',
    difficulty: 'Advanced',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'OpenAI/Gemini APIs'],
    estimatedDuration: '28 Days',
    requirements: [
      'Dynamic roadmap generation tailored to student semester and daily hours',
      'Integrated Pomodoro study timer with automated session logging',
      'Context-aware AI career assistant answering roadmap questions',
      'Admin content management system for roadmaps, materials, and quizzes'
    ],
    githubUrl: 'https://github.com/pravinth-dev/career-forge',
    liveUrl: 'https://careerforge-demo.vercel.app',
    screenshots: [],
    progress: 85,
    status: 'Testing',
    category: 'Advanced'
  }
];

export const initialAITools: AITool[] = [
  {
    id: 'ai-tool-1',
    name: 'GitHub Copilot',
    description: 'AI pair programmer providing context-aware inline code suggestions, test generation, and pull request explanations directly inside your IDE.',
    category: 'Coding Assistants',
    useCases: ['Autocompleting boilerplate code', 'Generating unit tests', 'Explaining legacy functions'],
    website: 'https://github.com/features/copilot',
    isFree: false,
    pricing: 'Free for verified students via GitHub Student Developer Pack, otherwise $10/mo',
    recommendedSkillLevel: 'Beginner'
  },
  {
    id: 'ai-tool-2',
    name: 'Cursor Editor',
    description: 'Next-generation AI-first code editor built on VS Code with codebase indexing, intelligent multi-file diff edits, and terminal debugging.',
    category: 'Coding Assistants',
    useCases: ['Natural language repository search', 'Full-file refactoring', 'Automated bug resolution'],
    website: 'https://cursor.com',
    isFree: true,
    pricing: 'Free tier available (Pro $20/mo)',
    recommendedSkillLevel: 'Intermediate'
  },
  {
    id: 'ai-tool-3',
    name: 'v0 by Vercel',
    description: 'Generative AI system for frontend development. Generates accessible, responsive React components using Tailwind CSS and Lucide icons.',
    category: 'Design Tools',
    useCases: ['Prototyping SaaS dashboards', 'Generating UI components', 'Responsive mobile mockups'],
    website: 'https://v0.dev',
    isFree: true,
    pricing: 'Free credits monthly, premium upgrades available',
    recommendedSkillLevel: 'Beginner'
  },
  {
    id: 'ai-tool-4',
    name: 'Perplexity AI',
    description: 'AI search engine and research assistant citing verified sources, documentation, and technical benchmark comparisons.',
    category: 'Research Tools',
    useCases: ['Debugging framework discrepancies', 'Comparing library performance', 'Exploring technical RFCs'],
    website: 'https://perplexity.ai',
    isFree: true,
    pricing: 'Free tier available (Pro $20/mo)',
    recommendedSkillLevel: 'Beginner'
  },
  {
    id: 'ai-tool-5',
    name: 'Supabase AI & pgvector',
    description: 'Built-in database AI assistant for writing SQL queries, generating schema migrations, and indexing high-dimensional embeddings.',
    category: 'Productivity Tools',
    useCases: ['Writing complex SQL joins', 'Generating RLS policies', 'Vector search indexing'],
    website: 'https://supabase.com/docs/guides/ai',
    isFree: true,
    pricing: 'Included in Supabase Free tier',
    recommendedSkillLevel: 'Intermediate'
  },
  {
    id: 'ai-tool-6',
    name: 'Claude 3.7 Sonnet by Anthropic',
    description: 'High-capability reasoning and coding LLM with extended thinking mode, ideal for deep architectural reviews and complex debugging.',
    category: 'Coding Assistants',
    useCases: ['Complex algorithm design', 'Codebase architecture reviews', 'Full-stack debugging'],
    website: 'https://claude.ai',
    isFree: true,
    pricing: 'Free tier available (Pro $20/mo)',
    recommendedSkillLevel: 'Advanced'
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Step to Greatness',
    description: 'Completed your very first learning topic on CareerForge.',
    icon: '🏆',
    unlocked: true,
    unlockedAt: '2026-09-10T14:30:00Z',
    category: 'Milestone'
  },
  {
    id: 'ach-2',
    title: '7-Day Unstoppable Streak',
    description: 'Maintained a consecutive 7-day daily study streak.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2026-09-17T12:00:00Z',
    category: 'Consistency'
  },
  {
    id: 'ach-3',
    title: 'Code Crafter: First Project',
    description: 'Built and published your first portfolio project to GitHub.',
    icon: '💻',
    unlocked: true,
    unlockedAt: '2026-09-24T18:00:00Z',
    category: 'Projects'
  },
  {
    id: 'ach-4',
    title: 'React Practitioner',
    description: 'Completed the core React component & state architecture module.',
    icon: '⚛',
    unlocked: true,
    unlockedAt: '2026-09-25T15:20:00Z',
    category: 'Mastery'
  },
  {
    id: 'ach-5',
    title: '14-Day Consistency Master',
    description: 'Maintained an unbroken 14-day learning streak.',
    icon: '⚡',
    unlocked: false,
    category: 'Consistency',
    progress: 12,
    maxProgress: 14
  },
  {
    id: 'ach-6',
    title: 'DSA Explorer',
    description: 'Solve 25 Data Structure & Algorithm problem challenges.',
    icon: '🧠',
    unlocked: false,
    category: 'Mastery',
    progress: 18,
    maxProgress: 25
  },
  {
    id: 'ach-7',
    title: 'Full-Stack Vanguard',
    description: 'Deploy a full-stack web application with client, server, and database.',
    icon: '🌐',
    unlocked: false,
    category: 'Projects',
    progress: 2,
    maxProgress: 3
  },
  {
    id: 'ach-8',
    title: 'Career Job Ready',
    description: 'Achieve an overall Career Readiness Score above 80%.',
    icon: '🎯',
    unlocked: false,
    category: 'Milestone',
    progress: 58,
    maxProgress: 80
  }
];

export const defaultStudentProfile: StudentProfile = {
  id: 'profile-pravinth-001',
  userId: 'user-student-1',
  fullName: 'Pravinth',
  email: 'pravinth@careerforge.edu',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  college: 'College of Engineering, Anna University',
  degree: 'Bachelor of Engineering (B.E.)',
  department: 'Computer Science and Engineering',
  currentYear: '2nd Year',
  currentSemester: '3rd Semester',
  graduationYear: '2028',
  careerGoal: 'Full-Stack Developer + Software Engineer',
  currentSkillLevel: 'Intermediate',
  dailyAvailableStudyTime: 2.0,
  preferredLearningStyle: 'Hands-on Projects',
  githubUrl: 'https://github.com/pravinth-dev',
  linkedinUrl: 'https://linkedin.com/in/pravinth-dev',
  portfolioUrl: 'https://pravinth.dev',
  resumeUrl: 'https://careerforge.edu/resumes/pravinth_resume.pdf',
  resumeCompleted: true,
  interviewPrepCompleted: false,
  dsaProblemsSolved: 28
};

export const initialSkills: SkillProgress[] = [
  { skill: 'HTML & CSS', category: 'Frontend', percentage: 92, level: 'Advanced' },
  { skill: 'JavaScript (ES6+)', category: 'Frontend', percentage: 80, level: 'Advanced' },
  { skill: 'React & Ecosystem', category: 'Frontend', percentage: 65, level: 'Intermediate' },
  { skill: 'Node.js & Express', category: 'Backend', percentage: 50, level: 'Intermediate' },
  { skill: 'SQL & PostgreSQL', category: 'Database', percentage: 70, level: 'Intermediate' },
  { skill: 'Git & GitHub', category: 'DevOps', percentage: 90, level: 'Advanced' },
  { skill: 'Data Structures & Algorithms', category: 'CS Core', percentage: 48, level: 'Intermediate' },
  { skill: 'System Design Basics', category: 'CS Core', percentage: 40, level: 'Beginner' },
  { skill: 'AI & LLM Tools', category: 'AI', percentage: 55, level: 'Intermediate' }
];

export const initialStudySessions: StudySession[] = [
  { id: 'sess-1', userId: 'user-student-1', date: '2026-09-20', startTime: '10:00', endTime: '11:00', durationMinutes: 60, topic: 'ES6+ Destructuring & Rest Operators' },
  { id: 'sess-2', userId: 'user-student-1', date: '2026-09-21', startTime: '14:00', endTime: '15:15', durationMinutes: 75, topic: 'Closures & Event Loop Deep Dive' },
  { id: 'sess-3', userId: 'user-student-1', date: '2026-09-22', startTime: '16:00', endTime: '17:00', durationMinutes: 60, topic: 'Promises and Async/Await Patterns' },
  { id: 'sess-4', userId: 'user-student-1', date: '2026-09-23', startTime: '09:30', endTime: '10:30', durationMinutes: 60, topic: 'Fetch API & Consuming REST endpoints' },
  { id: 'sess-5', userId: 'user-student-1', date: '2026-09-24', startTime: '11:00', endTime: '12:15', durationMinutes: 75, topic: 'React Components, JSX & Props' },
  { id: 'sess-6', userId: 'user-student-1', date: '2026-09-25', startTime: '15:00', endTime: '16:00', durationMinutes: 60, topic: 'useState & State Lifting' },
  { id: 'sess-7', userId: 'user-student-1', date: '2026-09-26', startTime: '09:00', endTime: '09:50', durationMinutes: 50, topic: 'useEffect Lifecycle Hooks' }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: "Today's Study Goal Ready",
    message: "Day 17: Master useEffect lifecycle & data fetching in React.",
    type: 'task',
    read: false,
    createdAt: '2026-09-26T08:00:00Z'
  },
  {
    id: 'notif-2',
    title: '🔥 12-Day Streak Active!',
    message: "Keep the momentum going. Study today to reach 13 days.",
    type: 'streak',
    read: false,
    createdAt: '2026-09-26T07:30:00Z'
  },
  {
    id: 'notif-3',
    title: 'New Quiz Unlocked: React Hooks',
    message: 'Test your understanding of React component state and lifecycles.',
    type: 'quiz',
    read: true,
    createdAt: '2026-09-25T16:00:00Z'
  }
];
