import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  getStoredData,
  setStoredData,
  addActivity,
  INITIAL_SPRINTS,
  INITIAL_PROJECTS
} from "@/data/dummyData";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  CalendarDays,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  FolderDot,
  Clock,
  Goal,
  CheckCircle,
  Plus
} from "lucide-react";

export const SprintPlanning = () => {
  const { user, checkPermission } = useAuth();
  const { showToast } = useToast();

  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    project: "",
    startDate: "",
    endDate: "",
    milestone: "Release 2.3",
    storyPoints: ""
  });

  const loadSprints = () => {
    setSprints(getStoredData("neuroforge_sprints", INITIAL_SPRINTS));
    setProjects(getStoredData("neuroforge_projects", INITIAL_PROJECTS));
  };

  useEffect(() => {
    loadSprints();
  }, []);

  const canPlanSprint = checkPermission("PLAN_SPRINT");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sprintForm.name || !sprintForm.goal || !sprintForm.project || !sprintForm.startDate || !sprintForm.endDate) {
      showToast("Please fill all required inputs", "warning");
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

    // Also update project current sprint name in local storage
    const updatedProjects = projects.map((p) => {
      if (p.name === sprintForm.project) {
        return { ...p, currentSprint: sprintForm.name };
      }
      return p;
    });

    const updatedSprints = [newSprint, ...sprints];
    setStoredData("neuroforge_sprints", updatedSprints);
    setStoredData("neuroforge_projects", updatedProjects);
    addActivity(user.name, "planned sprint", sprintForm.name);

    showToast(`Sprint "${sprintForm.name}" created successfully!`, "success");
    setIsModalOpen(false);
    
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
    
    loadSprints();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Completed": return "secondary";
      case "Planned": return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Sprint & Agile Planning
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Initialize software sprint cycles, define goals, set workloads, and assign deliverables
          </p>
        </div>

        <Tooltip content="Access Restricted" enabled={!canPlanSprint}>
          <Button
            size="sm"
            icon={Plus}
            disabled={!canPlanSprint}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground font-bold text-xs"
          >
            Plan Sprint
          </Button>
        </Tooltip>
      </div>

      {/* Sprints list view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => (
          <Card
            key={sprint.id}
            hover
            className={`bg-card border-border/80 flex flex-col justify-between p-5 relative overflow-hidden
              ${sprint.status === "Active" ? "glow-indigo border-primary/20" : ""}
            `}
          >
            {sprint.status === "Active" && (
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-primary to-primary/80" />
            )}

            <div>
              {/* Header card */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-foreground">{sprint.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">
                    <FolderDot className="h-3 w-3" />
                    <span>Project: {sprint.project}</span>
                  </div>
                </div>
                <Badge variant={getStatusBadge(sprint.status)}>{sprint.status}</Badge>
              </div>

              {/* Goal section */}
              <div className="mt-4 p-3 bg-secondary/40 border border-border/60 rounded-lg">
                <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block flex items-center gap-1.5">
                  <Goal className="h-3 w-3 text-primary" /> Sprint Goal
                </span>
                <p className="text-xs text-foreground font-medium mt-1 leading-relaxed">
                  {sprint.goal}
                </p>
              </div>

              {/* Metrics stack */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-secondary rounded-lg text-primary shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">Workload</span>
                    <span className="text-xs font-semibold text-foreground/90">{sprint.storyPoints} Story Points</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-secondary rounded-lg text-emerald-500 shrink-0">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">Milestone</span>
                    <span className="text-xs font-semibold text-foreground/90">{sprint.milestone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-border/60">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {sprint.duration}
                </span>
                <span>{sprint.progress}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500
                    ${sprint.status === "Active" ? "bg-primary" : ""}
                    ${sprint.status === "Completed" ? "bg-emerald-500" : ""}
                    ${sprint.status === "Planned" ? "bg-muted" : ""}
                  `}
                  style={{ width: `${sprint.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Sprint Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Plan Product Sprint Cycle"
        description="Initialize a new Scrum sprint cycle, allocate capacity, and outline priorities"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              options={projects.map((p) => p.name)}
              value={sprintForm.project}
              onChange={(e) => setSprintForm({ ...sprintForm, project: e.target.value })}
              placeholder="Select project..."
              required
            />
          </div>

          <Input
            label="Sprint Goal / Objective"
            placeholder="e.g. Integrate PostgreSQL DB schemas and Keycloak SSO flows"
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
              label="Total Story Points"
              type="number"
              placeholder="e.g. 80"
              value={sprintForm.storyPoints}
              onChange={(e) => setSprintForm({ ...sprintForm, storyPoints: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-bold">
              Plan Sprint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SprintPlanning;
