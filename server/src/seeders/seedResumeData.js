import "dotenv/config";
import connectDatabase from "../config/db.js";
import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Achievement from "../models/Achievement.js";

const PROFILE_DATA = {
  fullName: "Priyanshu Midha",
  headline: "Software Development Engineer I",
  subheadline: "Backend Engineer @ BookMyShow",
  shortIntro:
    "SDE-1 at BookMyShow building high-scale backend systems, messaging pipelines, and payment workflows.",
  bio: "Software Development Engineer with hands-on experience building distributed backend systems, messaging architecture (Kafka, RabbitMQ), and large-scale event platforms at BookMyShow.",
  about:
    "B.Tech in Computer Science from KIIT (2021-2025, 8.69 CGPA). Currently working as an SDE-1 at BookMyShow on ticket transfer systems, BNPL workflows, and accreditation platforms used during large-scale IPL events.",
  location: "Bangalore, India",
  email: "priyanshumidha1212@gmail.com",
  phone: "+91 6206939600",
  heroDescription:
    "Building scalable backend systems and distributed architectures at BookMyShow.",
  aboutTitle: "About Me",
  aboutDescription:
    "I'm a backend-focused Software Development Engineer with experience across distributed systems, messaging queues, and payment workflows. I enjoy solving high-scale engineering problems and have contributed to platform features used by hundreds of thousands of users during large events.",
  yearsOfExperience: 1,
  currentRole: "Software Development Engineer I",
  currentCompany: "BookMyShow",
  githubUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  highlights: [
    "Designed a multi-ticket transfer system for transferring multiple tickets to multiple recipients in one operation",
    "Reduced BNPL backend processing time from 30 minutes to 10 minutes with 100% automated payment link generation",
    "Delivered accreditation platform features supporting 100,000+ ID cards during large-scale IPL events",
  ],
  specialties: [
    "Distributed Systems",
    "Kafka",
    "RabbitMQ",
    "Node.js",
    "System Design",
    "REST APIs",
  ],
  isPublished: true,
};

const EXPERIENCE_DATA = [
  {
    company: "BookMyShow",
    role: "Software Development Engineer I",
    startDate: new Date("2025-05-01"),
    endDate: null,
    isCurrent: true,
    location: "Bangalore, India",
    description:
      "Backend engineering across ticketing, payments, messaging infrastructure, and event accreditation platforms.",
    responsibilities: [
      "Designed and implemented a multi-ticket transfer system for sending multiple tickets to multiple recipients in a single operation",
      "Implemented Buy Now, Pay Later (BNPL) workflows and optimized mapped-category processing",
      "Worked on RabbitMQ and Kafka integration to improve messaging architecture reliability and observability",
      "Developed Zero Price Ticket Cancellation workflows automating seat release and inventory updates",
      "Delivered Accreditation platform features used during large-scale IPL events",
    ],
    achievements: [
      "Reduced backend processing time from 30 minutes to 10 minutes while enabling 100% automated payment link generation",
      "Supported secure generation and management of over 100,000 accreditation ID cards",
    ],
    techStack: ["Node.js", "Kafka", "RabbitMQ", "MongoDB", "REST APIs"],
    isPublished: true,
    displayOrder: 0,
  },
  {
    company: "Quinbay",
    role: "Software Development Intern",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-05-01"),
    isCurrent: false,
    location: "",
    description: "Built a shopping application with Vue.js frontend and Spring Boot backend.",
    responsibilities: [
      "Built a shopping application using Vue.js for frontend and Spring Boot for backend API development",
      "Implemented product listing, user interactions, backend API integration, and API-driven data flow",
      "Collaborated with the team to understand requirements, handle edge cases, and improve feature implementation",
    ],
    achievements: [],
    techStack: ["Vue.js", "Spring Boot"],
    isPublished: true,
    displayOrder: 1,
  },
  {
    company: "ProdSmiths",
    role: "Software Development Intern - Frontend Developer",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-07-01"),
    isCurrent: false,
    location: "Remote",
    description: "Frontend bug fixes and database schema collaboration.",
    responsibilities: [
      "Fixed front-end bugs to improve performance and user experience while collaborating on database schema design and integration",
      "Conducted testing to ensure application functionality, performance, and usability",
      "Created front-end workflow documentation and designed Entity-Relationship Diagrams for database structures",
    ],
    achievements: [],
    techStack: [],
    isPublished: true,
    displayOrder: 2,
  },
];

const EDUCATION_DATA = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Kalinga Institute of Industrial Technology",
    startYear: 2021,
    endYear: 2025,
    grade: "8.69/10 CGPA",
    description: "",
    coursework: ["Data Structures", "Algorithms", "OOP", "DBMS"],
    isPublished: true,
    displayOrder: 0,
  },
];

const PROJECT_DATA = [
  {
    title: "Repair Management System",
    slug: "repair-management-system",
    shortDescription:
      "A repair management platform to manage repair orders, customer details, product status, and operational workflows.",
    longDescription:
      "Full-stack repair management platform with MongoDB-based persistence for creating, updating, and tracking repair records, including admin workflow support for managing records and tracking repair status.",
    problemSolved:
      "Streamlines tracking of repair orders, customer details, and product status for repair operations.",
    techStack: ["MongoDB", "Node.js", "Capacitor"],
    features: [
      "Create, update, and track repair records",
      "Admin workflow for managing records and repair status",
      "Android packaging using Capacitor",
    ],
    githubUrl: "",
    liveUrl: "",
    category: "Full Stack",
    status: "Live",
    isFeatured: true,
    isPublished: true,
    displayOrder: 0,
  },
  {
    title: "Focus Desk",
    slug: "focus-desk",
    shortDescription:
      "A productivity application to create, manage, and track daily tasks efficiently.",
    longDescription:
      "Productivity app supporting task creation, status updates, local persistence, and smooth user interactions, designed to support daily task tracking and personal workflow management.",
    problemSolved: "Helps track daily tasks and improve personal workflow management.",
    techStack: ["React", "JavaScript"],
    features: ["Task creation", "Status updates", "Local persistence"],
    githubUrl: "",
    liveUrl: "",
    category: "Frontend",
    status: "Live",
    isFeatured: false,
    isPublished: true,
    displayOrder: 1,
  },
];

const SKILL_DATA = [
  ["Languages", ["Java", "C++", "Go", "JavaScript", "SQL"]],
  ["Backend", ["Node.js", "REST APIs", "API Integration", "Kafka", "RabbitMQ"]],
  ["Frontend", ["React", "Vue.js", "Tailwind CSS", "HTML", "CSS"]],
  ["Databases", ["MongoDB", "SQL"]],
  [
    "Core Computer Science",
    ["Data Structures", "Algorithms", "Object-Oriented Programming", "DBMS"],
  ],
  [
    "System Design",
    [
      "Distributed Systems",
      "Scalability",
      "Concurrency",
      "Message Queues",
      "Fault Tolerance",
      "System Design",
      "High Availability",
    ],
  ],
  ["Developer Tools", ["Git", "GitHub", "Swagger", "VS Code", "Render", "Generative AI"]],
].flatMap(([category, names], categoryIndex) =>
  names.map((name, i) => ({
    name,
    category,
    level: "",
    icon: "",
    isPublished: true,
    displayOrder: categoryIndex * 100 + i,
  }))
);

const ACHIEVEMENT_DATA = [
  {
    title: 'Won 1st prize in "INNOCENCE 1.0" pitch competition',
    category: "Competition",
    description: "1st prize in the pitch competition INNOCENCE 1.0, and 2nd prize in BEST MANAGER.",
    impact: "",
    isFeatured: true,
    isPublished: true,
    displayOrder: 0,
  },
  {
    title: "NSS-SCE Project Representative & Debating Society Coordinator",
    category: "Leadership",
    description: "Served as NSS-SCE Project Representative and Coordinator of the debating society in college.",
    impact: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 1,
  },
  {
    title: "4th Best Adjudicator, IIT BBSR Debating Competition",
    category: "Debate",
    description: "Ranked as the 4th Best Adjudicator in the IIT BBSR Debating Competition.",
    impact: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 2,
  },
  {
    title: "Organized 10+ college events",
    category: "Leadership",
    description: "Organized 10+ college events and served as event lead for 2, demonstrating leadership and organizational skills.",
    impact: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 3,
  },
];

const seedResumeData = async () => {
  await connectDatabase();

  await Profile.findOneAndUpdate({}, PROFILE_DATA, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log("Profile upserted");

  for (const exp of EXPERIENCE_DATA) {
    await Experience.findOneAndUpdate(
      { company: exp.company, role: exp.role },
      exp,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Experience upserted (${EXPERIENCE_DATA.length})`);

  for (const edu of EDUCATION_DATA) {
    await Education.findOneAndUpdate(
      { institution: edu.institution, degree: edu.degree },
      edu,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Education upserted (${EDUCATION_DATA.length})`);

  for (const project of PROJECT_DATA) {
    await Project.findOneAndUpdate(
      { slug: project.slug },
      project,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Projects upserted (${PROJECT_DATA.length})`);

  for (const skill of SKILL_DATA) {
    await Skill.findOneAndUpdate(
      { name: skill.name, category: skill.category },
      skill,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Skills upserted (${SKILL_DATA.length})`);

  for (const achievement of ACHIEVEMENT_DATA) {
    await Achievement.findOneAndUpdate(
      { title: achievement.title },
      achievement,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Achievements upserted (${ACHIEVEMENT_DATA.length})`);

  console.log("Resume data seed complete");
  process.exit(0);
};

seedResumeData().catch((error) => {
  console.error("Failed to seed resume data", error);
  process.exit(1);
});
