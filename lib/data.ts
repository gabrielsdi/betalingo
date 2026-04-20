export interface Word {
  term: string;
  definition: string;
  example: string;
  pronunciation?: string;
}

export interface InterviewPhrase {
  id: string;
  spanish: string;
  english: string;
  culturalNote?: string;
  context: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  words?: Word[];
  phrases?: InterviewPhrase[];
  type: 'vocabulary' | 'phrases';
}

export const lessons: Lesson[] = [
  {
    id: 'basics',
    title: 'Basic Web Development Terms',
    description: 'Essential vocabulary for web development interviews',
    type: 'vocabulary',
    words: [
      {
        term: 'HTML',
        definition: 'HyperText Markup Language - the standard markup language for creating web pages',
        example: 'HTML provides the structure of a webpage using elements like <div> and <p>.'
      },
      {
        term: 'CSS',
        definition: 'Cascading Style Sheets - used to describe the presentation of a document',
        example: 'CSS controls the layout, colors, and fonts of HTML elements.'
      },
      {
        term: 'JavaScript',
        definition: 'A programming language that enables interactive web pages',
        example: 'JavaScript allows you to add dynamic behavior to websites.'
      },
      {
        term: 'DOM',
        definition: 'Document Object Model - a programming interface for HTML and XML documents',
        example: 'The DOM represents the page so that programs can change the document structure.'
      },
      {
        term: 'API',
        definition: 'Application Programming Interface - a set of rules for accessing a software application',
        example: 'REST APIs allow different applications to communicate with each other.'
      },
      {
        term: 'HTTP',
        definition: 'HyperText Transfer Protocol - the foundation of data communication on the web',
        example: 'HTTP defines how messages are formatted and transmitted between browsers and servers.'
      },
      {
        term: 'Browser',
        definition: 'A software application for accessing information on the World Wide Web',
        example: 'Chrome, Firefox, and Safari are popular web browsers.'
      },
      {
        term: 'Server',
        definition: 'A computer program that provides functionality to other programs or devices',
        example: 'Web servers host websites and serve content to browsers.'
      }
    ]
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Libraries',
    description: 'Popular frameworks and their concepts',
    type: 'vocabulary',
    words: [
      {
        term: 'React',
        definition: 'A JavaScript library for building user interfaces',
        example: 'React uses components to create reusable UI elements.'
      },
      {
        term: 'Vue',
        definition: 'A progressive JavaScript framework for building user interfaces',
        example: 'Vue is known for its simplicity and ease of integration.'
      },
      {
        term: 'Angular',
        definition: 'A platform for building mobile and desktop web applications',
        example: 'Angular provides a complete framework with TypeScript support.'
      },
      {
        term: 'Node.js',
        definition: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        example: 'Node.js allows you to run JavaScript on the server side.'
      },
      {
        term: 'Express',
        definition: 'A minimal and flexible Node.js web application framework',
        example: 'Express provides robust features for web and mobile applications.'
      },
      {
        term: 'Next.js',
        definition: 'A React framework for production with server-side rendering',
        example: 'Next.js enables features like static site generation and API routes.'
      },
      {
        term: 'Tailwind',
        definition: 'A utility-first CSS framework for rapidly building custom designs',
        example: 'Tailwind uses classes like bg-blue-500 for styling elements.'
      }
    ]
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    description: 'Key terms for algorithmic questions',
    type: 'vocabulary',
    words: [
      {
        term: 'Array',
        definition: 'A data structure consisting of a collection of elements of the same type',
        example: 'Arrays provide O(1) access time to elements by index.'
      },
      {
        term: 'Linked List',
        definition: 'A linear data structure where elements are stored in nodes',
        example: 'Linked lists allow efficient insertion and deletion operations.'
      },
      {
        term: 'Stack',
        definition: 'A linear data structure that follows the Last In First Out (LIFO) principle',
        example: 'Stacks are used for function call management and undo operations.'
      },
      {
        term: 'Queue',
        definition: 'A linear data structure that follows the First In First Out (FIFO) principle',
        example: 'Queues are used in breadth-first search and task scheduling.'
      },
      {
        term: 'Hash Table',
        definition: 'A data structure that implements an associative array',
        example: 'Hash tables provide average O(1) lookup time.'
      },
      {
        term: 'Tree',
        definition: 'A hierarchical data structure with a root node and child nodes',
        example: 'Binary trees are commonly used in search algorithms.'
      },
      {
        term: 'Graph',
        definition: 'A data structure consisting of vertices connected by edges',
        example: 'Graphs represent relationships between objects.'
      }
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Database concepts and technologies',
    type: 'vocabulary',
    words: [
      {
        term: 'SQL',
        definition: 'Structured Query Language - used to communicate with relational databases',
        example: 'SQL allows you to query, insert, update, and delete data in databases.'
      },
      {
        term: 'NoSQL',
        definition: 'A category of database management systems that do not use SQL',
        example: 'NoSQL databases are designed for large-scale data storage.'
      },
      {
        term: 'MongoDB',
        definition: 'A document-oriented NoSQL database',
        example: 'MongoDB stores data in flexible, JSON-like documents.'
      },
      {
        term: 'PostgreSQL',
        definition: 'An advanced open-source relational database',
        example: 'PostgreSQL supports both SQL and JSON querying.'
      },
      {
        term: 'Redis',
        definition: 'An in-memory data structure store used as a database',
        example: 'Redis is commonly used for caching and session management.'
      },
      {
        term: 'ORM',
        definition: 'Object-Relational Mapping - a technique to convert data between incompatible systems',
        example: 'ORMs like Prisma allow you to interact with databases using code.'
      },
      {
        term: 'Migration',
        definition: 'The process of moving data from one system to another',
        example: 'Database migrations update the schema without losing data.'
      }
    ]
  },
  {
    id: 'interview-phrases',
    title: 'Interview Communication',
    description: 'Professional phrases and cultural differences for tech interviews',
    type: 'phrases',
    phrases: [
      {
        id: 'schedule-meeting',
        spanish: 'Agendo una reunión para la tarde',
        english: 'I\'ll schedule a meeting for this afternoon',
        culturalNote: 'In US business culture, "schedule" is more common than "agenda" for meetings',
        context: 'When coordinating with your team about project timelines',
        difficulty: 'beginner'
      },
      {
        id: 'team-collaboration',
        spanish: 'Trabajo en equipo con el grupo',
        english: 'I collaborate with the team',
        culturalNote: 'US workplaces emphasize "team player" mentality and cross-functional collaboration',
        context: 'Describing your work style in interviews',
        difficulty: 'beginner'
      },
      {
        id: 'project-deadline',
        spanish: 'La fecha límite del proyecto es mañana',
        english: 'The project deadline is tomorrow',
        culturalNote: 'US business uses "deadline" frequently; be prepared to discuss time management',
        context: 'When discussing project management experience',
        difficulty: 'intermediate'
      },
      {
        id: 'code-review',
        spanish: 'Revisé el código del compañero',
        english: 'I reviewed my colleague\'s code',
        culturalNote: 'Code reviews are standard in US tech companies; emphasize constructive feedback',
        context: 'Talking about development workflow',
        difficulty: 'intermediate'
      },
      {
        id: 'stakeholder-meeting',
        spanish: 'Tuve una reunión con los interesados',
        english: 'I had a meeting with stakeholders',
        culturalNote: 'US business frequently uses "stakeholders" instead of "interested parties"',
        context: 'When discussing client or management interactions',
        difficulty: 'advanced'
      },
      {
        id: 'agile-methodology',
        spanish: 'Trabajamos con metodología ágil',
        english: 'We work with agile methodology',
        culturalNote: 'Agile/Scrum is very common in US tech; be familiar with terms like sprint, backlog, standup',
        context: 'Describing development processes',
        difficulty: 'advanced'
      },
      {
        id: 'performance-review',
        spanish: 'Hice la evaluación de desempeño',
        english: 'I conducted the performance review',
        culturalNote: 'US companies do formal performance reviews; focus on constructive feedback and growth',
        context: 'Management or leadership experience',
        difficulty: 'advanced'
      },
      {
        id: 'remote-work',
        spanish: 'Trabajo desde casa los viernes',
        english: 'I work from home on Fridays',
        culturalNote: 'Remote/hybrid work is common in US tech; discuss tools like Slack, Zoom, Notion',
        context: 'Work-life balance and flexibility',
        difficulty: 'intermediate'
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}