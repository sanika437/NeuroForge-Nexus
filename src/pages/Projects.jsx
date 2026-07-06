import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  getStoredData,
  setStoredData,
  addActivity,
  INITIAL_PROJECTS
} from "@/data/dummyData";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/Table";
import {
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  Trash2,
  FolderOpen
} from "lucide-react";

export const Projects = () => {
  const { user, checkPermission } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table options: search, sort, filter, pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      priority: "Medium",
      manager: "Jane Doe",
      deadline: "",
      status: "Active"
    }
  });

  const loadProjects = () => {
    setProjects(getStoredData("neuroforge_projects", INITIAL_PROJECTS));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const canCreateProject = checkPermission("CREATE_PROJECT");

  const onSubmit = (data) => {
    const newProject = {
      id: `p_${Date.now()}`,
      name: data.name,
      manager: data.manager,
      priority: data.priority,
      status: data.status,
      membersCount: 0,
      currentSprint: "N/A",
      deadline: data.deadline,
      description: data.description
    };

    const updatedProjects = [newProject, ...projects];
    setStoredData("neuroforge_projects", updatedProjects);
    addActivity(user.name, "created project", data.name);
    
    showToast(`Project "${data.name}" created successfully!`, "success");
    setIsModalOpen(false);
    reset();
    loadProjects();
  };

  const handleDeleteProject = (projectId, projectName) => {
    // Only Admin can delete projects
    if (user.role !== "Admin") {
      showToast("Access Restricted: Only Administrators can delete projects.", "error");
      return;
    }

    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setStoredData("neuroforge_projects", updatedProjects);
    addActivity(user.name, "deleted project", projectName);
    showToast(`Project "${projectName}" removed.`, "info");
    loadProjects();
  };

  // Toggle sort order
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination bounds
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  const projectManagerList = ["Jane Doe", "Sarah Jenkins", "Bob Smith", "Emily Watson"];

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Planning": return "info";
      case "Completed": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Projects Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Displaying active cloud-native application registries
          </p>
        </div>

        <Tooltip content="Access Restricted" enabled={!canCreateProject}>
          <Button
            size="sm"
            icon={Plus}
            disabled={!canCreateProject}
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-indigo-500/10"
          >
            Create Project
          </Button>
        </Tooltip>
      </div>

      {/* Filter and search bar */}
      <Card className="bg-card p-4 border border-border/80">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
            </span>
            <input
              type="text"
              placeholder="Search projects by name, manager..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary text-foreground"
            />
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-xs font-bold text-muted-foreground">Filters:</span>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-input border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-input border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Projects Table Card */}
      <Card className="bg-card border border-border/80 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Project Name <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("manager")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Manager <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("priority")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Priority <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Status <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Sprint</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("deadline")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Deadline <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((proj) => (
                  <TableRow key={proj.id}>
                    <TableCell className="font-bold text-foreground">
                      <div>
                        {proj.name}
                        {proj.description && (
                          <span className="block text-[10px] text-muted-foreground/60 font-medium mt-0.5 max-w-sm truncate">
                            {proj.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{proj.manager}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadge(proj.priority)}>{proj.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(proj.status)}>{proj.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{proj.membersCount} members</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{proj.currentSprint}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{proj.deadline}</TableCell>
                    <TableCell className="text-right">
                      <Tooltip content="Delete (Admin Only)" position="left">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={user.role !== "Admin"}
                          onClick={() => handleDeleteProject(proj.id, proj.name)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-zinc-500 text-xs">
                    No projects found matching the criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-secondary/10">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} (Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="text-xs h-8 px-3 border border-border"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="text-xs h-8 px-3 border border-border"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Project Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Create Enterprise SDLC Project"
        description="Fill out the project credentials to register in the workspace registry"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. FinCore Nexus"
            required
            error={errors.name?.message}
            {...register("name", { required: "Project name is required" })}
          />

          <Input
            label="Project Description"
            placeholder="Introduce the platform service goal..."
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              options={["Low", "Medium", "High"]}
              {...register("priority")}
            />
            <Select
              label="Project Manager"
              options={projectManagerList}
              {...register("manager")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Release Deadline"
              type="date"
              required
              error={errors.deadline?.message}
              {...register("deadline", { required: "Deadline is required" })}
            />
            <Select
              label="Initial Status"
              options={["Planning", "Active", "Completed"]}
              {...register("status")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-bold">
              Register Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
