import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/context/ThemeContext";
import {
  getStoredData,
  setStoredData,
  addActivity,
  INITIAL_PROJECTS,
  INITIAL_USERS,
  INITIAL_TEAMS,
  INITIAL_SPRINTS,
  INITIAL_ACTIVITIES
} from "@/data/dummyData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  Briefcase,
  Users as UsersIcon,
  Layers,
  Flag,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Clock,
  LayoutGrid,
  CheckCircle,
  Plus
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const Dashboard = () => {
  const { user, checkPermission } = useAuth();
  const { showToast } = useToast();
  const { theme, isDark } = useTheme();



  // Local storage state
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [activities, setActivities] = useState([]);

  // Modal open states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    priority: "Medium",
    manager: "Jane Doe",
    deadline: "",
    status: "Active"
  });

  const [teamForm, setTeamForm] = useState({
    project: "",
    team: ""
  });

  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    project: "",
    startDate: "",
    endDate: "",
    milestone: "Release 2.3",
    storyPoints: ""
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
    department: "Engineering",
    team: "Frontend Team",
    status: "Active"
  });

  // Load state from local storage on mount
  const loadData = () => {
    setProjects(getStoredData("neuroforge_projects", INITIAL_PROJECTS));
    setUsers(getStoredData("neuroforge_users", INITIAL_USERS));
    setTeams(getStoredData("neuroforge_teams", INITIAL_TEAMS));
    setSprints(getStoredData("neuroforge_sprints", INITIAL_SPRINTS));
    setActivities(getStoredData("neuroforge_activities", INITIAL_ACTIVITIES));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Action submissions
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.deadline) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    const newProject = {
      id: `p_${Date.now()}`,
      name: projectForm.name,
      manager: projectForm.manager,
      priority: projectForm.priority,
      status: projectForm.status,
      membersCount: 0,
      currentSprint: "N/A",
      deadline: projectForm.deadline,
      description: projectForm.description
    };

    const updatedProjects = [newProject, ...projects];
    setStoredData("neuroforge_projects", updatedProjects);
    addActivity(user.name, "created project", projectForm.name);
    
    showToast(`Project "${projectForm.name}" created!`, "success");
    setIsProjectModalOpen(false);
    
    // Reset form
    setProjectForm({
      name: "",
      description: "",
      priority: "Medium",
      manager: "Jane Doe",
      deadline: "",
      status: "Active"
    });
    
    loadData();
  };

  const handleAssignTeam = (e) => {
    e.preventDefault();
    if (!teamForm.project || !teamForm.team) {
      showToast("Please select a project and a team", "warning");
      return;
    }

    const updatedTeams = teams.map((team) => {
      if (team.name === teamForm.team) {
        // Add project if it's not already assigned
        const projectList = team.projects.includes(teamForm.project)
          ? team.projects
          : [...team.projects, teamForm.project];
        return { ...team, projects: projectList };
      }
      return team;
    });

    setStoredData("neuroforge_teams", updatedTeams);
    addActivity(user.name, "assigned team", `${teamForm.team} to ${teamForm.project}`);
    
    showToast(`Assigned ${teamForm.team} to "${teamForm.project}"!`, "success");
    setIsTeamModalOpen(false);
    
    // Reset form
    setTeamForm({ project: "", team: "" });
    loadData();
  };

  const handlePlanSprint = (e) => {
    e.preventDefault();
    if (!sprintForm.name || !sprintForm.goal || !sprintForm.project || !sprintForm.startDate || !sprintForm.endDate) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    const newSprint = {
      id: `s_${Date.now()}`,
      name: sprintForm.name,
      goal: sprintForm.goal,
      project: sprintForm.project,
      startDate: sprintForm.startDate,
      endDate: sprintForm.endDate,
      duration: `${sprintForm.startDate} to ${sprintForm.endDate}`,
      velocity: 0,
      status: "Planned",
      progress: 0,
      storyPoints: Number(sprintForm.storyPoints) || 0,
      milestone: sprintForm.milestone
    };

    const updatedSprints = [newSprint, ...sprints];
    setStoredData("neuroforge_sprints", updatedSprints);
    addActivity(user.name, "initialized sprint", sprintForm.name);
    
    showToast(`Sprint "${sprintForm.name}" planned!`, "success");
    setIsSprintModalOpen(false);
    
    // Reset form
    setSprintForm({
      name: "",
      goal: "",
      project: "",
      startDate: "",
      endDate: "",
      milestone: "Release 2.3",
      storyPoints: ""
    });
    loadData();
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.password) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      department: userForm.department,
      team: userForm.team,
      status: userForm.status
    };

    const updatedUsers = [newUser, ...users];
    setStoredData("neuroforge_users", updatedUsers);
    addActivity(user.name, "registered user", userForm.name);
    
    showToast(`Registered user "${userForm.name}"!`, "success");
    setIsUserModalOpen(false);
    
    // Reset form
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "Developer",
      department: "Engineering",
      team: "Frontend Team",
      status: "Active"
    });
    loadData();
  };



  // Form selections dropdown items
  const projectManagerList = ["Jane Doe", "Sarah Jenkins", "Bob Smith", "Emily Watson"];
  const departmentsList = ["Engineering", "Quality Assurance", "Operations", "Product Management", "Security"];
  const teamListDropdown = teams.map(t => t.name);
  const projectListDropdown = projects.map(p => p.name);

  // Check action restrictions
  const canCreateProject = checkPermission("CREATE_PROJECT");
  const canAssignTeam = checkPermission("ASSIGN_TEAM");
  const canPlanSprint = checkPermission("PLAN_SPRINT");
  const canRegisterUser = checkPermission("REGISTER_USER");

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-6">
      {/* Welcome & Metadata section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-border/85 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-[300px] h-[150px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.name || "Corporate User"}
            </h1>
            <Badge variant={user?.role}>{user?.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 select-none font-semibold">
            Tenant: NeuroForge Enterprise • {formattedDate}
          </p>
        </div>
        
        {/* Quick actions panel */}
        <div className="flex flex-wrap gap-2 z-10">
          <Tooltip content="Access Restricted" enabled={!canCreateProject}>
            <Button
              size="sm"
              icon={Plus}
              disabled={!canCreateProject}
              onClick={() => setIsProjectModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
            >
              Create Project
            </Button>
          </Tooltip>

          <Tooltip content="Access Restricted" enabled={!canAssignTeam}>
            <Button
              size="sm"
              icon={UsersIcon}
              variant="secondary"
              disabled={!canAssignTeam}
              onClick={() => setIsTeamModalOpen(true)}
              className="text-xs border border-zinc-800"
            >
              Assign Team
            </Button>
          </Tooltip>

          <Tooltip content="Access Restricted" enabled={!canPlanSprint}>
            <Button
              size="sm"
              icon={Calendar}
              variant="secondary"
              disabled={!canPlanSprint}
              onClick={() => setIsSprintModalOpen(true)}
              className="text-xs border border-zinc-800"
            >
              Plan Sprint
            </Button>
          </Tooltip>

          <Tooltip content="Access Restricted" enabled={!canRegisterUser}>
            <Button
              size="sm"
              icon={Plus}
              variant="secondary"
              disabled={!canRegisterUser}
              onClick={() => setIsUserModalOpen(true)}
              className="text-xs border border-zinc-800"
            >
              Register User
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Operational Counts Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Active Projects */}
        <Card hover className="p-4 bg-card border-border/80 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-primary/10 rounded-lg text-primary">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Active Projects</span>
          <span className="text-2xl font-black mt-1 block">247</span>
          <div className="flex items-center gap-1 mt-2.5 text-[10px] text-emerald-500 font-bold">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            <span>+12.4% vs last Q</span>
          </div>
        </Card>

        {/* Registered Users */}
        <Card hover className="p-4 bg-card border-border/80 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-primary/10 rounded-lg text-primary">
            <UsersIcon className="h-4 w-4" />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Registered Users</span>
          <span className="text-2xl font-black mt-1 block">2,847</span>
          <div className="flex items-center gap-1 mt-2.5 text-[10px] text-emerald-500 font-bold">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            <span>+84 accounts</span>
          </div>
        </Card>

        {/* Active Teams */}
        <Card hover className="p-4 bg-card border-border/80 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-primary/10 rounded-lg text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Active Teams</span>
          <span className="text-2xl font-black mt-1 block">47</span>
          <div className="flex items-center gap-1 mt-2.5 text-[10px] text-muted-foreground font-semibold">
            <span>Utilization: 86%</span>
          </div>
        </Card>

        {/* Current Sprint */}
        <Card hover className="p-4 bg-card border-border/80 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-primary/10 rounded-lg text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Current Sprint</span>
          <span className="text-2xl font-black mt-1 block">Sprint 12</span>
          <div className="flex items-center gap-1 mt-2.5 text-[10px] text-primary font-bold">
            <Sparkles className="h-3 w-3 shrink-0 animate-pulse" />
            <span>Active: Ends in 9d</span>
          </div>
        </Card>

        {/* Target Milestone */}
        <Card hover className="p-4 bg-card border-border/80 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-primary/10 rounded-lg text-primary">
            <Flag className="h-4 w-4" />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Milestone Target</span>
          <span className="text-2xl font-black mt-1 block">Release 2.3</span>
          <div className="flex items-center gap-1 mt-2.5 text-[10px] text-muted-foreground/80 font-semibold">
            <span>Due: 20-Jun-2026</span>
          </div>
        </Card>
      </div>

      {/* Main Charts & Timeline layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* RBAC & Team Setup Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RBAC Rules Matrix */}
            <Card className="bg-card border-border/85">
              <CardHeader className="p-4 border-b border-border/55">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">Role-Based Access Control (RBAC)</CardTitle>
                <CardDescription className="text-[10px]">Access privileges for tenant roles</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs font-semibold">
                <div className="space-y-3">
                  <div className="flex items-start justify-between pb-2 border-b border-border/40">
                    <div>
                      <span className="font-bold text-foreground">Admin</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Full environment administration and IAM management.</p>
                    </div>
                    <Badge variant="Admin">All Actions</Badge>
                  </div>
                  <div className="flex items-start justify-between pb-2 border-b border-border/40">
                    <div>
                      <span className="font-bold text-foreground">Project Manager</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Create projects, assign teams, and plan sprints.</p>
                    </div>
                    <Badge variant="Project Manager">Manage</Badge>
                  </div>
                  <div className="flex items-start justify-between pb-2 border-b border-border/40">
                    <div>
                      <span className="font-bold text-foreground">Developer</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">View workspace, contribute, and track sprints.</p>
                    </div>
                    <Badge variant="Developer">Contribute</Badge>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-foreground">DevOps Engineer</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Configure environments and deploy builds.</p>
                    </div>
                    <Badge variant="DevOps Engineer">Deploy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Integration Summary */}
            <Card className="bg-card border-border/85">
              <CardHeader className="p-4 border-b border-border/55">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">Milestone 1 Deliverables</CardTitle>
                <CardDescription className="text-[10px]">Setup checklist & platform indicators</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5">
                <div className="flex items-center justify-between p-2.5 bg-secondary/20 border border-border/40 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-foreground">IAM Identity Directory</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-secondary/20 border border-border/40 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-foreground">LocalStorage DB Cache</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">INITIALIZED</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-secondary/20 border border-border/40 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-foreground">Scrum Velocity Engine</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">READY</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Timeline */}
          <Card className="bg-card border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent System Activity
              </CardTitle>
              <CardDescription className="text-[10px]">Audited actions on tenant SDLC environments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border/80 pl-4 ml-2 space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-card border-2 border-primary group-hover:bg-indigo-400 transition-colors" />
                    
                    <div className="text-xs text-foreground/80">
                      <span className="font-bold text-foreground">{act.user}</span>{" "}
                      <span className="text-muted-foreground font-medium">{act.action}</span>{" "}
                      <span className="font-bold text-primary">{act.target}</span>
                      <span className="text-[9px] text-muted-foreground/60 block mt-1">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Panel Section */}
        <div className="space-y-6">
          <Card className="glow-indigo border-primary/20 bg-card">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-foreground">FinCore Nexus</CardTitle>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <CardDescription className="text-[10px] text-muted-foreground mt-0.5">Enterprise Banking Engine</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-4 text-xs font-semibold">
              {/* Grid detail entries */}
              <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Assigned Team</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">12 Technical Members</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Security Status</span>
                  <span className="text-xs font-bold text-emerald-500 mt-0.5 block flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Keycloak Ready
                  </span>
                </div>
              </div>

              {/* Members Breakdown */}
              <div className="border-b border-border/60 pb-4">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block mb-2">IAM User Allocations</span>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">1 Admin</Badge>
                  <Badge variant="secondary">1 PM</Badge>
                  <Badge variant="secondary">5 Devs</Badge>
                  <Badge variant="secondary">3 QAs</Badge>
                  <Badge variant="secondary">2 DevOps</Badge>
                </div>
              </div>

              {/* Sprint info */}
              <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Current Cycle</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">Sprint 12</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Active Workload</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">23 Tasks / 67 SP</span>
                </div>
              </div>

              {/* Milestone Details */}
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Milestone Target</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">Release 2.3</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold block">Target Due Date</span>
                  <span className="text-xs font-bold text-primary mt-0.5 block">20 June 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}
      {/* 1. Create Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
        description="Initialize a new enterprise SDLC project entry in LocalStorage"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Core Banking Core"
            value={projectForm.name}
            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Introduce the purpose of the platform service..."
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={["Low", "Medium", "High"]}
              value={projectForm.priority}
              onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
            />
            <Select
              label="Project Manager"
              options={projectManagerList}
              value={projectForm.manager}
              onChange={(e) => setProjectForm({ ...projectForm, manager: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deadline"
              type="date"
              value={projectForm.deadline}
              onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
              required
            />
            <Select
              label="Status"
              options={["Planning", "Active", "Completed"]}
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Assign Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Assign Team to Project"
        description="Link a functional tech team with an active development project"
      >
        <form onSubmit={handleAssignTeam} className="space-y-4">
          <Select
            label="Select Active Project"
            options={projectListDropdown}
            value={teamForm.project}
            onChange={(e) => setTeamForm({ ...teamForm, project: e.target.value })}
            placeholder="Select a project"
            required
          />
          <Select
            label="Select Assigned Team"
            options={teamListDropdown}
            value={teamForm.team}
            onChange={(e) => setTeamForm({ ...teamForm, team: e.target.value })}
            placeholder="Select a team"
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsTeamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
              Assign Team
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Plan Sprint Modal */}
      <Modal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        title="Plan Foundational Sprint"
        description="Initialize a new sprint lifecycle mapped to a project and release milestone"
      >
        <form onSubmit={handlePlanSprint} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sprint Name"
              placeholder="e.g. Sprint 13"
              value={sprintForm.name}
              onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
              required
            />
            <Select
              label="Associated Project"
              options={projectListDropdown}
              value={sprintForm.project}
              onChange={(e) => setSprintForm({ ...sprintForm, project: e.target.value })}
              placeholder="Select project"
              required
            />
          </div>
          <Input
            label="Sprint Objective Goal"
            placeholder="e.g. Implement SonarQube quality gates"
            value={sprintForm.goal}
            onChange={(e) => setSprintForm({ ...sprintForm, goal: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={sprintForm.startDate}
              onChange={(e) => setSprintForm({ ...sprintForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={sprintForm.endDate}
              onChange={(e) => setSprintForm({ ...sprintForm, endDate: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Milestone"
              placeholder="e.g. Release 2.3"
              value={sprintForm.milestone}
              onChange={(e) => setSprintForm({ ...sprintForm, milestone: e.target.value })}
              required
            />
            <Input
              label="Target Story Points"
              type="number"
              placeholder="e.g. 70"
              value={sprintForm.storyPoints}
              onChange={(e) => setSprintForm({ ...sprintForm, storyPoints: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsSprintModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
              Initialize Cycle
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Register User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Register IAM Platform User"
        description="Add a new corporate account with custom access roles"
      >
        <form onSubmit={handleRegisterUser} className="space-y-4">
          <Input
            label="Full User Name"
            placeholder="e.g. Alice Cooper"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
          <Input
            label="Corporate Email Address"
            placeholder="e.g. alice@neuroforge.com"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
          <Input
            label="Temporary Security Password"
            placeholder="••••••••"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Access Control Role"
              options={["Admin", "Project Manager", "Developer", "Tester", "DevOps Engineer"]}
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            />
            <Select
              label="Functional Department"
              options={departmentsList}
              value={userForm.department}
              onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Team"
              options={["N/A", ...teamListDropdown]}
              value={userForm.team}
              onChange={(e) => setUserForm({ ...userForm, team: e.target.value })}
            />
            <Select
              label="Status"
              options={["Active", "Suspended"]}
              value={userForm.status}
              onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
              Register User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
