// Initial seed data for NeuroForge Nexus
export const INITIAL_PROJECTS = [
  {
    id: "p1",
    name: "FinCore Nexus",
    manager: "Jane Doe",
    priority: "High",
    status: "Active",
    membersCount: 12,
    currentSprint: "Sprint 12",
    deadline: "2026-06-20",
    description: "Cloud-native core financial transaction and processing pipeline with sub-millisecond latencies."
  },
  {
    id: "p2",
    name: "AuthShield Secure",
    manager: "Jane Doe",
    priority: "Medium",
    status: "Planning",
    membersCount: 6,
    currentSprint: "Sprint 11",
    deadline: "2026-08-15",
    description: "IAM integration layer leveraging Keycloak for enterprise-grade authentication and single sign-on."
  },
  {
    id: "p3",
    name: "LogiRoute Optimise",
    manager: "Sarah Jenkins",
    priority: "Low",
    status: "Completed",
    membersCount: 8,
    currentSprint: "Sprint 10",
    deadline: "2026-04-10",
    description: "AI-driven route planning and fleet management service running on AWS Elastic Kubernetes Service."
  }
];

export const INITIAL_USERS = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@neuroforge.com",
    role: "Admin",
    department: "IT Security",
    team: "N/A",
    status: "Active"
  },
  {
    id: "u2",
    name: "Jane Doe",
    email: "pm@neuroforge.com",
    role: "Project Manager",
    department: "Product",
    team: "Management Team",
    status: "Active"
  },
  {
    id: "u3",
    name: "John Developer",
    email: "developer@neuroforge.com",
    role: "Developer",
    department: "Engineering",
    team: "Frontend Team",
    status: "Active"
  },
  {
    id: "u4",
    name: "Sarah Tester",
    email: "tester@neuroforge.com",
    role: "Tester",
    department: "Quality Assurance",
    team: "QA Team",
    status: "Active"
  },
  {
    id: "u5",
    name: "David DevOps",
    email: "devops@neuroforge.com",
    role: "DevOps Engineer",
    department: "Operations",
    team: "DevOps Team",
    status: "Active"
  }
];

export const INITIAL_TEAMS = [
  {
    id: "t1",
    name: "Frontend Team",
    lead: "John Developer",
    members: ["John Developer", "Alice Cooper", "Bob Vance", "Charlie Brown"],
    projects: ["FinCore Nexus", "AuthShield Secure"],
    capacity: "90%"
  },
  {
    id: "t2",
    name: "Backend Team",
    lead: "Jane Doe",
    members: ["Jane Doe", "Dev Patel", "Emily Watson", "Frank Zhang", "Grace Hopper"],
    projects: ["FinCore Nexus"],
    capacity: "85%"
  },
  {
    id: "t3",
    name: "QA Team",
    lead: "Sarah Tester",
    members: ["Sarah Tester", "Henry Ford", "Ivy League"],
    projects: ["FinCore Nexus", "LogiRoute Optimise"],
    capacity: "95%"
  },
  {
    id: "t4",
    name: "DevOps Team",
    lead: "David DevOps",
    members: ["David DevOps", "Ian Malcolm", "Jack Ryan"],
    projects: ["FinCore Nexus"],
    capacity: "80%"
  }
];

export const INITIAL_SPRINTS = [
  {
    id: "s1",
    name: "Sprint 12",
    goal: "Payment Service Integration & Kafka events setup",
    project: "FinCore Nexus",
    startDate: "2026-06-01",
    endDate: "2026-06-15",
    duration: "2026-06-01 to 2026-06-15",
    velocity: 67,
    status: "Active",
    progress: 75,
    storyPoints: 67,
    milestone: "Release 2.3"
  },
  {
    id: "s2",
    name: "Sprint 11",
    goal: "OAuth2 Keycloak Authentication Flow implementation",
    project: "AuthShield Secure",
    startDate: "2026-05-15",
    endDate: "2026-05-30",
    duration: "2026-05-15 to 2026-05-30",
    velocity: 45,
    status: "Completed",
    progress: 100,
    storyPoints: 50,
    milestone: "Release 2.2"
  },
  {
    id: "s3",
    name: "Sprint 13",
    goal: "Reporting Service Analytics Engine configuration",
    project: "FinCore Nexus",
    startDate: "2026-06-16",
    endDate: "2026-06-30",
    duration: "2026-06-16 to 2026-06-30",
    velocity: 0,
    status: "Planned",
    progress: 0,
    storyPoints: 80,
    milestone: "Release 2.3"
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: "a1",
    user: "John Developer",
    action: "created project",
    target: "FinCore Nexus",
    timestamp: "2 hours ago"
  },
  {
    id: "a2",
    user: "Jane Doe",
    action: "started",
    target: "Sprint 12",
    timestamp: "5 hours ago"
  },
  {
    id: "a3",
    user: "Sarah Tester",
    action: "assigned team",
    target: "QA Team",
    timestamp: "1 day ago"
  },
  {
    id: "a4",
    user: "Admin User",
    action: "registered user",
    target: "David DevOps",
    timestamp: "2 days ago"
  },
  {
    id: "a5",
    user: "Jane Doe",
    action: "updated",
    target: "Project FinCore Nexus",
    timestamp: "3 days ago"
  }
];

// Initialize local storage database
export const initLocalStorage = () => {
  if (!localStorage.getItem("neuroforge_projects")) {
    localStorage.setItem("neuroforge_projects", JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem("neuroforge_users")) {
    localStorage.setItem("neuroforge_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("neuroforge_teams")) {
    localStorage.setItem("neuroforge_teams", JSON.stringify(INITIAL_TEAMS));
  }
  if (!localStorage.getItem("neuroforge_sprints")) {
    localStorage.setItem("neuroforge_sprints", JSON.stringify(INITIAL_SPRINTS));
  }
  if (!localStorage.getItem("neuroforge_activities")) {
    localStorage.setItem("neuroforge_activities", JSON.stringify(INITIAL_ACTIVITIES));
  }
};

// Local storage helper functions
export const getStoredData = (key, fallback) => {
  initLocalStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

export const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const addActivity = (user, action, target) => {
  const activities = getStoredData("neuroforge_activities", INITIAL_ACTIVITIES);
  const newActivity = {
    id: `a_${Date.now()}`,
    user,
    action,
    target,
    timestamp: "Just now"
  };
  setStoredData("neuroforge_activities", [newActivity, ...activities].slice(0, 20)); // Limit to 20
};
