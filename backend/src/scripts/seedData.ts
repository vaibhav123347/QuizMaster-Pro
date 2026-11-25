import { QuestionDifficulty } from '../models/Question';
import { QuizDifficulty } from '../models/Quiz';

export interface SeedQuestionItem {
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: QuestionDifficulty;
  marks: number;
}

export interface SeedCategoryQuizBundle {
  category: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
  };
  quiz: {
    title: string;
    slug: string;
    description: string;
    difficulty: QuizDifficulty;
    durationMinutes: number;
    passingPercentage: number;
  };
  questions: SeedQuestionItem[];
}

export const SEED_BUNDLES: SeedCategoryQuizBundle[] = [
  {
    category: {
      name: 'HTML',
      slug: 'html',
      description: 'Semantic markup, accessibility, forms, media, and modern HTML5 APIs.',
      icon: 'FileCode2',
      color: '#f97316',
    },
    quiz: {
      title: 'HTML5 Semantics & Web Accessibility Assessment',
      slug: 'html5-semantics-accessibility',
      description:
        'Evaluate your command of semantic HTML5 elements, ARIA roles, form validation attributes, and document structure.',
      difficulty: 'beginner',
      durationMinutes: 10,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'Which HTML5 element is semantically intended to wrap the dominant, unique content of a document body?',
        options: ['<section>', '<main>', '<article>', '<div role="wrapper">'],
        correctOptionIndex: 1,
        explanation:
          'The <main> element represents the primary, unique content of the <body>, excluding repeated headers, sidebars, and footers.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What is the effect of placing the "defer" attribute on an external <script> tag in the <head>?',
        options: [
          'It blocks HTML parsing until the script downloads and executes',
          'It downloads in parallel and executes in document order after HTML parsing completes',
          'It executes immediately as soon as download finishes, interrupting parsing',
          'It prevents the script from accessing the DOM',
        ],
        correctOptionIndex: 1,
        explanation:
          'Scripts with defer fetch asynchronously while HTML parsing continues and execute in order right before DOMContentLoaded.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Which attribute binds a <label> element explicitly to an <input> element for screen readers and click focus?',
        options: ['name', 'aria-target', 'for', 'labelledby'],
        correctOptionIndex: 2,
        explanation:
          'The "for" attribute on <label> must match the "id" attribute of the corresponding form control.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which HTTP-related attribute on <a target="_blank"> prevents the newly opened tab from accessing window.opener?',
        options: ['rel="noopener"', 'sandbox="strict"', 'crossorigin="anonymous"', 'referrerpolicy="none"'],
        correctOptionIndex: 0,
        explanation:
          'Adding rel="noopener" blocks reverse tabnabbing by ensuring window.opener is null in the opened browsing context.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'When is the <article> element preferred over <section>?',
        options: [
          'Only when wrapping navigation menus',
          'When content is self-contained and could be syndicated or reused independently',
          'Whenever a background color needs to be applied',
          'Only inside a <footer> element',
        ],
        correctOptionIndex: 1,
        explanation:
          '<article> represents an independent, self-contained composition (such as a blog post or news item) suitable for standalone distribution.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which <input> attribute enforces a client-side regular expression check before form submission?',
        options: ['regex', 'validate', 'pattern', 'match'],
        correctOptionIndex: 2,
        explanation:
          'The "pattern" attribute specifies a regular expression that the input value must match on form submission.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What does the srcset attribute on an <img> element allow the browser to do?',
        options: [
          'Embed SVG code directly inside an img tag',
          'Select the most appropriate image resolution or size based on viewport and pixel density',
          'Lazy-load JavaScript bundles along with the image',
          'Encrypt the image URL against hotlinking',
        ],
        correctOptionIndex: 1,
        explanation:
          'srcset provides a list of candidate image sources with width or density descriptors so the browser picks the optimal asset.',
        difficulty: 'medium',
        marks: 2,
      },
    ],
  },
  {
    category: {
      name: 'CSS',
      slug: 'css',
      description: 'Flexbox, CSS Grid, specificity, custom properties, and responsive architecture.',
      icon: 'Palette',
      color: '#06b6d4',
    },
    quiz: {
      title: 'Modern CSS3 Layout & Specificity Mastery',
      slug: 'modern-css3-layout-specificity',
      description:
        'Test your understanding of CSS Grid, Flexbox alignment, cascade specificity, stacking contexts, and responsive units.',
      difficulty: 'beginner',
      durationMinutes: 10,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'Which selector has the highest CSS specificity among the following?',
        options: ['#nav .item a:hover', '.nav .menu .item a', 'ul#nav li a', 'body main section a'],
        correctOptionIndex: 0,
        explanation:
          '#nav .item a:hover has specificity (1, 2, 1) — one ID, two classes/pseudo-classes, and one element — beating (0, 3, 1) and (1, 0, 3).',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'In CSS Flexbox, which property aligns flex items along the cross axis?',
        options: ['justify-content', 'align-items', 'flex-direction', 'place-justify'],
        correctOptionIndex: 1,
        explanation:
          'align-items controls alignment perpendicular to the main axis (the cross axis), while justify-content aligns along the main axis.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What does "box-sizing: border-box" change about an element’s width and height calculation?',
        options: [
          'Margins are included inside the declared width',
          'Padding and border are included within the declared width and height',
          'Only border thickness is subtracted from margin',
          'The element automatically switches to display: flex',
        ],
        correctOptionIndex: 1,
        explanation:
          'With border-box, the declared width and height encompass content, padding, and border, preventing unexpected overflow.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which CSS Grid declaration creates responsive columns that automatically wrap and stay at least 260px wide?',
        options: [
          'grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))',
          'grid-template-columns: flex(260px, 1fr)',
          'grid-auto-columns: wrap(260px)',
          'grid-template-areas: repeat(auto, 260px)',
        ],
        correctOptionIndex: 0,
        explanation:
          'repeat(auto-fit, minmax(260px, 1fr)) fits as many 260px+ tracks as possible and distributes leftover space evenly.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Relative to what is the "rem" CSS unit calculated?',
        options: [
          'The font-size of the immediate parent element',
          'The width of the viewport',
          'The font-size of the root <html> element',
          'The line-height of the <body> element',
        ],
        correctOptionIndex: 2,
        explanation:
          '1rem always equals the computed font-size of the root element (<html>), unlike em which scales relative to the parent.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which CSS property-value pair creates a new stacking context even without z-index set?',
        options: ['overflow: hidden', 'opacity: 0.99', 'display: block', 'visibility: visible'],
        correctOptionIndex: 1,
        explanation:
          'An element with an opacity value less than 1 creates a new stacking context according to the CSS Color specification.',
        difficulty: 'hard',
        marks: 2,
      },
      {
        text: 'How do you provide a fallback value when reading a CSS custom property?',
        options: [
          'var(--accent || #3b82f6)',
          'var(--accent, #3b82f6)',
          'env(--accent, #3b82f6)',
          'default(--accent, #3b82f6)',
        ],
        correctOptionIndex: 1,
        explanation:
          'The var() function accepts a second comma-separated argument used if the custom property is undefined.',
        difficulty: 'easy',
        marks: 1,
      },
    ],
  },
  {
    category: {
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Event loop, closures, promises, async/await, prototypes, and ES2023+ patterns.',
      icon: 'Braces',
      color: '#eab308',
    },
    quiz: {
      title: 'JavaScript Engine, Async & Closures Challenge',
      slug: 'javascript-async-closures-challenge',
      description:
        'Assess deep knowledge of the JavaScript event loop, lexical closures, microtasks, immutability, and ES6+ semantics.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'Which queue has higher execution priority in the JavaScript event loop after the call stack empties?',
        options: [
          'The macrotask queue (setTimeout)',
          'The microtask queue (Promise.then / queueMicrotask)',
          'The animation frame queue (requestAnimationFrame)',
          'The I/O polling queue',
        ],
        correctOptionIndex: 1,
        explanation:
          'The JavaScript runtime drains all pending microtasks completely before picking up the next macrotask.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What is a closure in JavaScript?',
        options: [
          'A syntax block that automatically garbage-collects local variables',
          'A function bundled together with references to its surrounding lexical environment',
          'A strict-mode directive that seals object properties',
          'An asynchronous generator loop',
        ],
        correctOptionIndex: 1,
        explanation:
          'A closure allows an inner function to retain access to variables in its outer lexical scope even after the outer function has returned.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which Promise combinator settles as soon as ANY input promise fulfills, ignoring rejections unless all reject?',
        options: ['Promise.all', 'Promise.race', 'Promise.any', 'Promise.allSettled'],
        correctOptionIndex: 2,
        explanation:
          'Promise.any resolves with the first fulfilled promise and only rejects with an AggregateError if every input promise rejects.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What does the nullish coalescing operator (??) evaluate as its trigger to use the right-hand operand?',
        options: [
          'Any falsy value (0, "", false, null, undefined)',
          'Only null or undefined',
          'Only NaN or undefined',
          'Any empty object or array',
        ],
        correctOptionIndex: 1,
        explanation:
          'Unlike logical OR (||), ?? only falls back to the right-hand expression when the left side is null or undefined, preserving 0 and "".',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What is the key difference between Array.prototype.map and Array.prototype.forEach?',
        options: [
          'map mutates the original array in place',
          'map returns a new transformed array of the same length, whereas forEach returns undefined',
          'forEach supports async/await sequentially while map does not',
          'forEach cannot iterate over sparse arrays',
        ],
        correctOptionIndex: 1,
        explanation:
          'map creates and returns a new array populated with the results of calling the callback on every element; forEach always returns undefined.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Why does Object.freeze(obj) not prevent mutating a nested object inside obj?',
        options: [
          'Object.freeze only works on arrays',
          'Object.freeze performs a shallow freeze on top-level properties only',
          'Object.freeze only prevents adding new keys, not modifying existing values',
          'JavaScript engines ignore Object.freeze in non-strict mode',
        ],
        correctOptionIndex: 1,
        explanation:
          'Object.freeze makes own properties of the target object non-writable and non-configurable, but nested object references remain mutable unless recursively frozen.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What is the output type of `typeof null` in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"symbol"'],
        correctOptionIndex: 2,
        explanation:
          'Due to a historical representation quirk from the first JS implementation, typeof null returns "object".',
        difficulty: 'easy',
        marks: 1,
      },
    ],
  },
  {
    category: {
      name: 'React.js',
      slug: 'reactjs',
      description: 'Hooks, rendering lifecycle, state management, reconciliation, and performance.',
      icon: 'Atom',
      color: '#38bdf8',
    },
    quiz: {
      title: 'React.js Hooks & Component Architecture Exam',
      slug: 'reactjs-hooks-architecture-exam',
      description:
        'Test practical expertise in React hooks, dependency arrays, controlled forms, key reconciliation, and memoization.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'Why should React list items use stable unique IDs for the "key" prop rather than array indexes when items can be reordered or deleted?',
        options: [
          'Array indexes cause TypeScript compilation errors',
          'Using indexes can mismatch component state and DOM nodes with shifted elements during reconciliation',
          'React refuses to render lists with numeric keys',
          'Unique IDs automatically persist list state to localStorage',
        ],
        correctOptionIndex: 1,
        explanation:
          'React relies on keys to match elements across renders; shifting indexes causes React to reuse stale state on the wrong item.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'When does the cleanup function returned from a useEffect hook execute?',
        options: [
          'Only when the browser tab closes',
          'Before the effect re-runs due to dependency changes and when the component unmounts',
          'Immediately after the first state setter call inside the component',
          'Only in React.StrictMode development builds',
        ],
        correctOptionIndex: 1,
        explanation:
          'React runs the previous effect cleanup before executing the next effect with updated dependencies and upon component unmount.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which hook lets you persist a mutable value across renders WITHOUT triggering a re-render when updated?',
        options: ['useState', 'useReducer', 'useRef', 'useMemo'],
        correctOptionIndex: 2,
        explanation:
          'Mutating ref.current preserves the value between renders without scheduling a component re-render.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Why is calling `setCount(count + 1)` twice inside a single event handler problematic compared to `setCount(prev => prev + 1)`?',
        options: [
          'Functional updaters run on a background Web Worker',
          'Both calls read the same stale closure value of `count`, incrementing only once instead of twice',
          'React throws an infinite loop error if setCount is called twice',
          'Functional updaters bypass React batching',
        ],
        correctOptionIndex: 1,
        explanation:
          'State variables remain constant within a single render snapshot; passing an updater function receives the latest queued state.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What is the primary purpose of React.Context?',
        options: [
          'Replacing all server API calls',
          'Sharing state or configuration across deeply nested components without prop drilling',
          'Validating form fields against a Zod schema',
          'Compiling JSX into WebAssembly',
        ],
        correctOptionIndex: 1,
        explanation:
          'Context passes data down the component tree without manually threading props through every intermediate level.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which hook caches the result of an expensive computation between renders unless its dependencies change?',
        options: ['useEffect', 'useMemo', 'useLayoutEffect', 'useId'],
        correctOptionIndex: 1,
        explanation:
          'useMemo memoizes the computed return value of a function and recomputes only when a dependency in its array changes.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'In React Router v6, which component renders matched child route elements inside a parent layout route?',
        options: ['<Switch />', '<Outlet />', '<Slot />', '<Children />'],
        correctOptionIndex: 1,
        explanation:
          '<Outlet /> acts as a placeholder inside a parent route component where nested child routes are rendered.',
        difficulty: 'medium',
        marks: 2,
      },
    ],
  },
  {
    category: {
      name: 'TypeScript',
      slug: 'typescript',
      description: 'Static typing, generics, discriminated unions, type narrowing, and utility types.',
      icon: 'Code2',
      color: '#3b82f6',
    },
    quiz: {
      title: 'TypeScript Type System & Generics Assessment',
      slug: 'typescript-type-system-generics',
      description:
        'Verify mastery of TypeScript strict mode, unknown vs any, utility types, generics, and type guards.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'Why is the `unknown` type safer than `any` for handling untrusted input like parsed JSON or caught errors?',
        options: [
          'unknown automatically validates data at runtime',
          'unknown forces type narrowing or checking before performing operations on the value',
          'unknown strips all null values at compile time',
          'any is deprecated in TypeScript 5',
        ],
        correctOptionIndex: 1,
        explanation:
          'Unlike any, which disables type checking, unknown requires explicit narrowing (via typeof, instanceof, or type guards) before accessing properties.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
        options: ['Required<T>', 'Partial<T>', 'Pick<T, K>', 'Record<K, T>'],
        correctOptionIndex: 1,
        explanation:
          'Partial<T> maps every property of T to be optional, which is widely used for PATCH/update DTO payloads.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What does the `never` return type signify on a TypeScript function?',
        options: [
          'The function returns null',
          'The function never completes normally (e.g., always throws an error or loops infinitely)',
          'The function accepts zero arguments',
          'The function can only run in development mode',
        ],
        correctOptionIndex: 1,
        explanation:
          'never represents values that never occur; functions that always throw or never terminate have return type never.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Which utility type removes specific keys K from an object type T?',
        options: ['Exclude<T, K>', 'Omit<T, K>', 'Extract<T, K>', 'NonNullable<T>'],
        correctOptionIndex: 1,
        explanation:
          'Omit<T, K> constructs an object type excluding properties K from T, whereas Exclude operates on union members.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'How do discriminated unions simplify type narrowing in TypeScript?',
        options: [
          'They convert interfaces into JavaScript classes at runtime',
          'A shared literal property (discriminant) lets TypeScript narrow the exact union member automatically',
          'They remove the need for return statements',
          'They bypass strictNullChecks',
        ],
        correctOptionIndex: 1,
        explanation:
          'Checking a common literal field like `status: "loading" | "success" | "error"` narrows the remaining properties safely.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What is the purpose of a generic constraint like `<T extends { id: string }>`?',
        options: [
          'It restricts T to only the exact object `{ id: string }` with no extra fields',
          'It guarantees that any type argument passed for T has at least an `id: string` property',
          'It converts T into a class extending String',
          'It prevents T from being used inside arrays',
        ],
        correctOptionIndex: 1,
        explanation:
          'Generic constraints enforce minimum structural requirements on type parameters while preserving full subtype flexibility.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What does enabling `"strict": true` in tsconfig.json automatically activate?',
        options: [
          'Automatic minification of output JavaScript',
          'A family of strict checks including strictNullChecks and noImplicitAny',
          'Runtime schema validation on Express routes',
          'Disabling ES module imports',
        ],
        correctOptionIndex: 1,
        explanation:
          'The strict flag enables strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, and related safety checks.',
        difficulty: 'easy',
        marks: 1,
      },
    ],
  },
  {
    category: {
      name: 'Node.js',
      slug: 'nodejs',
      description: 'Express middleware, REST architecture, streams, process lifecycle, and error handling.',
      icon: 'Server',
      color: '#22c55e',
    },
    quiz: {
      title: 'Node.js & Express REST Architecture Evaluation',
      slug: 'nodejs-express-rest-evaluation',
      description:
        'Assess your backend engineering skills in Express middleware pipelines, HTTP status codes, async error handling, and security headers.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'How does Express identify an error-handling middleware function?',
        options: [
          'By naming the function handleError',
          'By having exactly four parameters: (err, req, res, next)',
          'By registering it with app.catch()',
          'By placing it before express.json()',
        ],
        correctOptionIndex: 1,
        explanation:
          'Express inspects Function.length and treats middleware with four arguments (err, req, res, next) as centralized error handlers.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which HTTP status code is most appropriate when a client attempts to register an email that already exists?',
        options: ['400 Bad Request', '401 Unauthorized', '409 Conflict', '500 Internal Server Error'],
        correctOptionIndex: 2,
        explanation:
          '409 Conflict indicates that the request could not be completed due to a conflict with the current state of the resource (duplicate unique key).',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Why is `app.set("trust proxy", 1)` important when deploying an Express app with express-rate-limit behind Render or Nginx?',
        options: [
          'It disables TLS encryption for faster routing',
          'It allows Express to read the client IP from X-Forwarded-For instead of rate-limiting the proxy IP',
          'It caches all GET responses in memory',
          'It allows CORS requests from every domain',
        ],
        correctOptionIndex: 1,
        explanation:
          'Behind a reverse proxy, req.ip defaults to the proxy address unless trust proxy is enabled, which would cause all users to share one rate-limit bucket.',
        difficulty: 'hard',
        marks: 2,
      },
      {
        text: 'What is the difference between 401 Unauthorized and 403 Forbidden in REST APIs?',
        options: [
          '401 means missing or invalid authentication; 403 means authenticated but lacking permission',
          '403 means token expired; 401 means server crashed',
          'They are identical and interchangeable',
          '401 is only for GET requests and 403 is only for POST requests',
        ],
        correctOptionIndex: 0,
        explanation:
          '401 indicates unauthenticated access (no valid credentials), whereas 403 indicates the authenticated identity lacks authorization for that resource.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Why should synchronous CPU-heavy loops or `bcrypt.hashSync` be avoided inside high-concurrency Express request handlers?',
        options: [
          'They consume extra MongoDB connections',
          'They block Node.js’s single-threaded event loop, stalling all concurrent requests',
          'They automatically crash TypeScript compilation',
          'They bypass Helmet headers',
        ],
        correctOptionIndex: 1,
        explanation:
          'Synchronous CPU work blocks the single JavaScript main thread; async bcrypt delegates hashing to the libuv thread pool.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What does `express.json({ limit: "100kb" })` protect an API against?',
        options: [
          'SQL injection in query strings',
          'Denial-of-service attacks sending oversized JSON payloads to exhaust server memory',
          'Expired JWT signatures',
          'Cross-site scripting inside CSS files',
        ],
        correctOptionIndex: 1,
        explanation:
          'Capping body parser payload size prevents attackers from exhausting process memory with multi-megabyte JSON bodies.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Why should Node.js servers handle SIGTERM gracefully during cloud deployments?',
        options: [
          'To delete the database before restarting',
          'To stop accepting new connections, finish in-flight requests, and close database pools cleanly',
          'To recompile TypeScript automatically',
          'To reset all user passwords',
        ],
        correctOptionIndex: 1,
        explanation:
          'Handling SIGTERM allows active HTTP requests to complete and Mongoose connections to close cleanly before the container exits.',
        difficulty: 'medium',
        marks: 2,
      },
    ],
  },
  {
    category: {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'OWASP Top 10, authentication security, cryptography, password hashing, and access control.',
      icon: 'ShieldCheck',
      color: '#ef4444',
    },
    quiz: {
      title: 'Application Security & OWASP Top 10 Assessment',
      slug: 'application-security-owasp-top10',
      description:
        'Challenge your security engineering instincts across password hashing, JWT pitfalls, NoSQL injection, IDOR, and XSS defenses.',
      difficulty: 'advanced',
      durationMinutes: 15,
      passingPercentage: 65,
    },
    questions: [
      {
        text: 'Why is bcrypt preferred over fast cryptographic hashes like SHA-256 for storing user passwords?',
        options: [
          'bcrypt is reversible so admins can recover forgotten passwords',
          'bcrypt includes a per-password random salt and an adjustable work factor that slows brute-force cracking',
          'SHA-256 cannot hash strings longer than 16 characters',
          'bcrypt encrypts the entire MongoDB collection automatically',
        ],
        correctOptionIndex: 1,
        explanation:
          'Fast hashes like SHA-256 can be brute-forced at billions of guesses per second on GPUs; bcrypt adds unique salts and intentional computational cost.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'A student modifies a request payload to include `{ "role": "admin" }` during registration or `{ "scoredMarks": 100 }` during quiz submission. What vulnerability occurs if the server trusts those fields?',
        options: [
          'Clickjacking',
          'Mass Assignment / Broken Object-Level & Business Logic Authorization',
          'DNS Cache Poisoning',
          'Buffer Underflow',
        ],
        correctOptionIndex: 1,
        explanation:
          'Accepting client-supplied privilege or score fields without strict server-side allowlists and server-side grading leads to privilege escalation and score tampering.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'What is an Insecure Direct Object Reference (IDOR) in a quiz platform?',
        options: [
          'Exposing TypeScript source maps in development',
          'Allowing Student A to view or submit Student B’s quiz attempt merely by changing the attemptId in the URL',
          'Using UUIDs instead of sequential numbers',
          'Compressing API responses with gzip',
        ],
        correctOptionIndex: 1,
        explanation:
          'IDOR happens when an endpoint retrieves a database record by ID without verifying that the authenticated user owns or is authorized to access it.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'How can an attacker exploit unvalidated JSON input in a MongoDB/Mongoose login query `User.findOne({ email: req.body.email })`?',
        options: [
          'By sending `{ "$ne": null }` to perform NoSQL operator injection if input types are not validated',
          'By overflowing the BSON integer limit',
          'By injecting CSS variables into the database',
          'By triggering a CORS preflight request',
        ],
        correctOptionIndex: 0,
        explanation:
          'If req.body.email is an object containing query operators like $ne or $gt instead of a validated string, MongoDB evaluates the operator.',
        difficulty: 'hard',
        marks: 2,
      },
      {
        text: 'Which Helmet security header mitigates Clickjacking attacks by controlling whether the site can be embedded in an <iframe>?',
        options: ['X-Content-Type-Options', 'X-Frame-Options / CSP frame-ancestors', 'Strict-Transport-Security', 'X-DNS-Prefetch-Control'],
        correctOptionIndex: 1,
        explanation:
          'X-Frame-Options (DENY/SAMEORIGIN) and Content-Security-Policy frame-ancestors prevent malicious sites from framing your app to hijack clicks.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Why must a JWT payload never store sensitive secrets like passwords or private keys?',
        options: [
          'JWT headers automatically delete password fields',
          'Standard JWT payloads are only Base64Url-encoded, not encrypted, so anyone with the token can decode them',
          'JWTs are stored in DNS TXT records',
          'HS256 truncates payloads larger than 32 bytes',
        ],
        correctOptionIndex: 1,
        explanation:
          'A signed JWS token guarantees integrity and authenticity via its signature, but its header and payload are plaintext Base64Url-encoded.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Why should an application never reveal whether a failed login was due to an unknown email vs. an incorrect password?',
        options: [
          'To reduce JSON payload size',
          'To prevent user enumeration attacks that discover valid registered accounts',
          'Because bcrypt cannot distinguish missing users',
          'To satisfy CORS preflight checks',
        ],
        correctOptionIndex: 1,
        explanation:
          'Returning a generic "Invalid email or password" message prevents attackers from harvesting valid account emails.',
        difficulty: 'easy',
        marks: 1,
      },
    ],
  },
  {
    category: {
      name: 'Network Security',
      slug: 'network-security',
      description: 'TLS/HTTPS, firewalls, DNS security, VPNs, TCP/IP hardening, and zero-trust principles.',
      icon: 'Network',
      color: '#8b5cf6',
    },
    quiz: {
      title: 'Network Security, TLS & Perimeter Defense Quiz',
      slug: 'network-security-tls-perimeter',
      description:
        'Test your grasp of TLS handshakes, HSTS, CORS enforcement, DDoS mitigation, and secure network protocols.',
      difficulty: 'advanced',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'What security guarantee does TLS (HTTPS) provide for API traffic between a browser and server?',
        options: [
          'Automatic SQL injection prevention',
          'Confidentiality (encryption), integrity (tamper detection), and server authentication via certificates',
          'Elimination of server-side rate limiting needs',
          'Client-side password hashing',
        ],
        correctOptionIndex: 1,
        explanation:
          'TLS encrypts traffic in transit, protects against tampering via MACs/AEAD, and authenticates the server through X.509 certificates.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What is the role of the HTTP Strict-Transport-Security (HSTS) header?',
        options: [
          'It instructs browsers to exclusively connect over HTTPS for a specified duration, preventing SSL-stripping',
          'It blocks all WebSocket connections',
          'It forces APIs to use HTTP/1.0',
          'It disables browser caching of JSON responses',
        ],
        correctOptionIndex: 0,
        explanation:
          'HSTS tells user agents to automatically upgrade any HTTP requests to HTTPS and refuse insecure certificate bypasses.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Which protocol secures DNS lookups against eavesdropping and manipulation over HTTPS?',
        options: ['DHCPv6', 'DoH (DNS over HTTPS)', 'SNMPv1', 'Telnet'],
        correctOptionIndex: 1,
        explanation:
          'DNS over HTTPS (DoH) encapsulates DNS resolution queries inside encrypted HTTPS traffic on port 443.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'What is a key limitation of relying solely on CORS for backend API security?',
        options: [
          'CORS only works on port 80',
          'CORS is enforced by web browsers, not by curl, Postman, or malicious scripts—so authentication and authorization are still mandatory',
          'CORS encrypts the JWT token',
          'CORS blocks all POST requests by default',
        ],
        correctOptionIndex: 1,
        explanation:
          'CORS restricts cross-origin reads in compliant browsers, but non-browser HTTP clients ignore CORS headers entirely.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Which attack overwhelms a target server’s TCP connection table by sending numerous SYN packets without completing the 3-way handshake?',
        options: ['ARP Spoofing', 'SYN Flood', 'XSS Injection', 'BGP Hijacking'],
        correctOptionIndex: 1,
        explanation:
          'A SYN flood leaves half-open TCP connections waiting for final ACKs, exhausting server connection backlogs; SYN cookies help mitigate it.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'In a Zero Trust network architecture, what is the core guiding principle?',
        options: [
          'Trust all traffic originating inside the corporate LAN by default',
          'Never trust implicitly based on network location; continuously verify identity, device posture, and least-privilege access',
          'Replace firewalls with static IP whitelists only',
          'Allow shared root credentials for internal microservices',
        ],
        correctOptionIndex: 1,
        explanation:
          'Zero Trust eliminates implicit network trust and enforces strict authentication and authorization on every request regardless of origin.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which port and protocol combination is standard for encrypted SSH remote administration?',
        options: ['Port 23 / TCP', 'Port 22 / TCP', 'Port 21 / UDP', 'Port 3389 / UDP'],
        correctOptionIndex: 1,
        explanation:
          'Secure Shell (SSH) operates by default over TCP port 22, replacing unencrypted Telnet (port 23).',
        difficulty: 'easy',
        marks: 1,
      },
    ],
  },
  {
    category: {
      name: 'DBMS',
      slug: 'dbms',
      description: 'Database design, normalization, ACID properties, indexing, and MongoDB aggregation.',
      icon: 'Database',
      color: '#10b981',
    },
    quiz: {
      title: 'Database Systems, Indexing & MongoDB Mastery',
      slug: 'database-systems-indexing-mongodb',
      description:
        'Measure your understanding of ACID transactions, B-tree indexes, compound indexing, normalization, and aggregation pipelines.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      passingPercentage: 60,
    },
    questions: [
      {
        text: 'What do the four letters in ACID database transactions stand for?',
        options: [
          'Access, Consistency, Integrity, Distribution',
          'Atomicity, Consistency, Isolation, Durability',
          'Authentication, Concurrency, Indexing, Durability',
          'Atomicity, Caching, Isolation, Delegation',
        ],
        correctOptionIndex: 1,
        explanation:
          'ACID guarantees all-or-nothing execution (Atomicity), valid state transitions (Consistency), concurrent independence (Isolation), and persistence (Durability).',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'In MongoDB, given a compound index `{ user: 1, quiz: 1, status: 1 }`, which query can efficiently use the index prefix?',
        options: [
          'Query filtering only by `{ status: "submitted" }`',
          'Query filtering by `{ user: userId, quiz: quizId }`',
          'Query filtering only by `{ quiz: quizId }`',
          'Regex search on an unrelated text field',
        ],
        correctOptionIndex: 1,
        explanation:
          'Compound indexes follow the ESR / leftmost-prefix rule: queries filtering on the leading prefix (`user` or `user + quiz`) leverage the index.',
        difficulty: 'hard',
        marks: 2,
      },
      {
        text: 'What is the trade-off of creating too many indexes on a write-heavy database collection?',
        options: [
          'Read queries become slower',
          'Every insert, update, or delete must also update each index, increasing write latency and storage overhead',
          'Unique constraints stop functioning',
          'MongoDB disables ObjectId generation',
        ],
        correctOptionIndex: 1,
        explanation:
          'Indexes dramatically accelerate reads and sorting, but each write operation incurs extra CPU and I/O cost to maintain index B-trees.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'In MongoDB’s aggregation framework, which stage performs a left outer join to another collection in the same database?',
        options: ['$match', '$unwind', '$lookup', '$project'],
        correctOptionIndex: 2,
        explanation:
          '$lookup joins documents from another collection by matching localField and foreignField values.',
        difficulty: 'easy',
        marks: 1,
      },
      {
        text: 'Which relational normal form eliminates transitive dependencies of non-key attributes on candidate keys?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Unnormalized Form'],
        correctOptionIndex: 2,
        explanation:
          '3NF requires the table to be in 2NF and ensures every non-prime attribute depends directly on the primary key, not on another non-prime attribute.',
        difficulty: 'medium',
        marks: 2,
      },
      {
        text: 'Why is a unique index at the database level still required even when application code checks `findOne` before `create`?',
        options: [
          'Application code cannot read emails',
          'Concurrent requests can both pass the `findOne` check simultaneously (race condition), whereas a DB unique index guarantees atomicity',
          'Mongoose ignores validation rules without indexes',
          'Unique indexes encrypt stored strings',
        ],
        correctOptionIndex: 1,
        explanation:
          'Check-then-insert suffers from TOCTOU race conditions under concurrency; a database-level unique index enforces uniqueness atomically.',
        difficulty: 'hard',
        marks: 2,
      },
      {
        text: 'In Mongoose, what does calling `.lean()` on a find query accomplish?',
        options: [
          'Deletes unused fields from MongoDB',
          'Returns plain JavaScript objects instead of full hydrated Mongoose Document instances, improving read performance',
          'Encrypts the returned fields',
          'Limits results to 10 documents automatically',
        ],
        correctOptionIndex: 1,
        explanation:
          '.lean() skips Mongoose change-tracking and virtual/method hydration, reducing memory and CPU overhead for read-only API responses.',
        difficulty: 'medium',
        marks: 2,
      },
    ],
  },
];
