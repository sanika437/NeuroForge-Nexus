import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  getStoredData,
  setStoredData,
  addActivity,
  INITIAL_TEAMS,
  INITIAL_PROJECTS
} from "@/data/dummyData";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  UserCheck,
  Percent,
  X,
  Plus
} from "lucide-react";

export const Teams = () => {
  const { user, checkPermission } = useAuth();
  const { showToast } = useToast();

  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [assignForm, setAssignForm] = useState({
    project: "",
    team: ""
  });

  const loadTeams = () => {
    setTeams(getStoredData("neuroforge_teams", INITIAL_TEAMS));
    setProjects(getStoredData("neuroforge_projects", INITIAL_PROJECTS));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const canAssignTeam = checkPermission("ASSIGN_TEAM");

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.project || !assignForm.team) {
      showToast("Please fill all required selections", "warning");
      return;
    }

    // Update teams list in local storage
    const updatedTeams = teams.map((t) => {
      if (t.name === assignForm.team) {
        const projectList = t.projects.includes(assignForm.project)
          ? t.projects
          : [...t.projects, assignForm.project];
        return { ...t, projects: projectList };
      }
      return t;
    });

    // Also update project members count in local storage (simulated update)
    const updatedProjects = projects.map((p) => {
      if (p.name === assignForm.project) {
        // Find assigned team member size and add to project member count
        const matchedTeam = teams.find((t) => t.name === assignForm.team);
        const addedCount = matchedTeam ? matchedTeam.members.length : 0;
        return { ...p, membersCount: p.membersCount + addedCount };
      }
      return p;
    });

    setStoredData("neuroforge_teams", updatedTeams);
    setStoredData("neuroforge_projects", updatedProjects);
    addActivity(user.name, "assigned team", `${assignForm.team} to ${assignForm.project}`);

    showToast(`Successfully assigned "${assignForm.team}" to "${assignForm.project}"!`, "success");
    setIsAssignModalOpen(false);
    setAssignForm({ project: "", team: "" });
    loadTeams();

    // If currently viewing the assigned team, update the details drawer too
    if (selectedTeam && selectedTeam.name === assignForm.team) {
      setSelectedTeam(updatedTeams.find((t) => t.name === assignForm.team));
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Engineering Teams
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse corporate squads, view members, capacities, and align them to SDLC projects
          </p>
        </div>

        <Tooltip content="Access Restricted" enabled={!canAssignTeam}>
          <Button
            size="sm"
            icon={UserCheck}
            disabled={!canAssignTeam}
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-primary text-primary-foreground font-bold text-xs"
          >
            Assign Team
          </Button>
        </Tooltip>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Card
            key={team.id}
            hover
            onClick={() => setSelectedTeam(team)}
            className="cursor-pointer bg-card border-border/80 hover:border-border p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-foreground text-base group-hover:text-primary truncate max-w-[150px]">
                  {team.name}
                </h3>
                <Badge variant="primary">{team.capacity} Cap</Badge>
              </div>

              <div className="mt-4 space-y-2.5">
                {/* Lead info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground/60" shrink-0="true" />
                  <span>Lead: <strong className="text-foreground/90 font-bold">{team.lead}</strong></span>
                </div>
                
                {/* Members count */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/60" shrink-0="true" />
                  <span>Members: <strong className="text-foreground/90 font-bold">{team.members.length}</strong></span>
                </div>

                {/* Projects count */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground/60" shrink-0="true" />
                  <span className="truncate">
                    Projects: <strong className="text-foreground/90 font-bold">{team.projects.length}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-primary font-bold">
              <span>View squad details</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </div>
          </Card>
        ))}
      </div>

      {/* ANIMATED SLIDE DRAWER (Framer Motion) */}
      <AnimatePresence>
        {selectedTeam && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border p-6 z-50 overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-border/60">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedTeam.name}</h2>
                    <span className="text-xs text-muted-foreground">Squad Directory & Allocations</span>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Team Details grid */}
                <div className="grid grid-cols-2 gap-4 py-6 border-b border-border/60">
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold block flex items-center gap-1.5">
                      <UserCheck className="h-3 w-3" /> Lead engineer
                    </span>
                    <span className="text-sm font-bold text-foreground mt-1 block truncate">
                      {selectedTeam.lead}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold block flex items-center gap-1.5">
                      <Percent className="h-3 w-3" /> Capacity
                    </span>
                    <span className="text-sm font-bold text-foreground mt-1 block">
                      {selectedTeam.capacity}
                    </span>
                  </div>
                </div>

                {/* Members List */}
                <div className="py-6 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Squad Members ({selectedTeam.members.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {selectedTeam.members.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border/60 bg-secondary/20 text-xs"
                      >
                        <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                          {member.charAt(0)}
                        </div>
                        <span className="font-bold text-foreground">{member}</span>
                        {member === selectedTeam.lead && (
                          <Badge variant="primary" className="ml-auto text-[8px] px-1 py-0 select-none">Lead</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="py-6">
                  <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Assigned SDLC Projects ({selectedTeam.projects.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedTeam.projects.length > 0 ? (
                      selectedTeam.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-secondary/20 text-xs font-semibold text-foreground"
                        >
                          <span>{proj}</span>
                          <span className="text-[10px] text-muted-foreground/60 font-bold uppercase select-none">Aligned</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No projects currently assigned to this team.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60">
                <Tooltip content="Access Restricted" enabled={!canAssignTeam}>
                  <Button
                    className="w-full bg-primary text-primary-foreground font-bold"
                    disabled={!canAssignTeam}
                    onClick={() => {
                      setAssignForm({ ...assignForm, team: selectedTeam.name });
                      setIsAssignModalOpen(true);
                    }}
                  >
                    Assign to Project
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Assign Team Modal Dialog */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Engineering Team"
        description="Select a product project and map a functional engineering team to it"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <Select
            label="Select Project"
            options={projects.map((p) => p.name)}
            value={assignForm.project}
            onChange={(e) => setAssignForm({ ...assignForm, project: e.target.value })}
            placeholder="Select project..."
            required
          />

          <Select
            label="Select Team"
            options={teams.map((t) => t.name)}
            value={assignForm.team}
            onChange={(e) => setAssignForm({ ...assignForm, team: e.target.value })}
            placeholder="Select team..."
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-bold">
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teams;
