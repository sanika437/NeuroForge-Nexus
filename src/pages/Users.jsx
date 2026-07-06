import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  getStoredData,
  setStoredData,
  addActivity,
  INITIAL_USERS,
  INITIAL_TEAMS
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
  Trash2,
  UsersRound
} from "lucide-react";

export const Users = () => {
  const { user, checkPermission } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table options
  const [searchTerm, setSearchTerm] = useState("");
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
      email: "",
      password: "",
      role: "Developer",
      department: "Engineering",
      team: "Frontend Team",
      status: "Active"
    }
  });

  const loadUsers = () => {
    setUsers(getStoredData("neuroforge_users", INITIAL_USERS));
    setTeams(getStoredData("neuroforge_teams", INITIAL_TEAMS));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const canRegisterUser = checkPermission("REGISTER_USER");

  const onSubmit = (data) => {
    const newUser = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      team: data.team,
      status: data.status
    };

    const updatedUsers = [newUser, ...users];
    setStoredData("neuroforge_users", updatedUsers);
    addActivity(user.name, "registered user", data.name);
    
    // Optional: add user to the corresponding team in LocalStorage
    if (data.team !== "N/A") {
      const updatedTeams = teams.map((t) => {
        if (t.name === data.team && !t.members.includes(data.name)) {
          return { ...t, members: [...t.members, data.name] };
        }
        return t;
      });
      setStoredData("neuroforge_teams", updatedTeams);
    }

    showToast(`User "${data.name}" registered successfully!`, "success");
    setIsModalOpen(false);
    reset();
    loadUsers();
  };

  const handleDeleteUser = (userId, userName) => {
    // Only Admin can delete users
    if (user.role !== "Admin") {
      showToast("Access Restricted: Only Administrators can remove users.", "error");
      return;
    }

    // Protect self deletion
    if (userName === user.name) {
      showToast("Operation Denied: You cannot delete your current session user.", "warning");
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    setStoredData("neuroforge_users", updatedUsers);
    addActivity(user.name, "deleted user", userName);
    showToast(`User "${userName}" has been removed.`, "info");
    loadUsers();
  };

  // Toggle sort order
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.department.toLowerCase().includes(term) ||
      u.team.toLowerCase().includes(term);
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const departmentsList = ["Engineering", "Quality Assurance", "Operations", "Product Management", "Security"];
  const teamListDropdown = teams.map((t) => t.name);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" />
            Identity Directory (IAM)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage user directories, configure departments, and enforce RBAC profiles
          </p>
        </div>

        <Tooltip content="Access Restricted" enabled={!canRegisterUser}>
          <Button
            size="sm"
            icon={Plus}
            disabled={!canRegisterUser}
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground font-bold text-xs"
          >
            Register User
          </Button>
        </Tooltip>
      </div>

      {/* Filter and search bar */}
      <Card className="bg-card p-4 border border-border/80">
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
          </span>
          <input
            type="text"
            placeholder="Search directory by name, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary text-foreground"
          />
        </div>
      </Card>

      {/* Users Table Card */}
      <Card className="bg-card border border-border/80 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Full Name <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("email")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Email Address <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("role")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Assigned Role <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("department")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Department <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("team")}>
                  <div className="flex items-center gap-1 hover:text-foreground">
                    Assigned Team <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-bold text-foreground text-xs">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role}>{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{u.department}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-semibold">{u.team}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Tooltip content="Delete (Admin Only)" position="left">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={user.role !== "Admin" || u.name === user.name}
                          onClick={() => handleDeleteUser(u.id, u.name)}
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
                  <TableCell colSpan={7} className="text-center py-8 text-zinc-500 text-xs">
                    No users found matching search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-secondary/10">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} (Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users)
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

      {/* Register User Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Register Platform User"
        description="Add a new employee directory profile in the LocalStorage IAM database"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Employee Name"
            placeholder="e.g. Alice Cooper"
            required
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Corporate Email Address"
            placeholder="e.g. alice@neuroforge.com"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />

          <Input
            label="Temporary Security Password"
            placeholder="••••••••"
            type="password"
            required
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="System RBAC Role"
              options={["Admin", "Project Manager", "Developer", "Tester", "DevOps Engineer"]}
              {...register("role")}
            />
            <Select
              label="Assigned Department"
              options={departmentsList}
              {...register("department")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Team"
              options={["N/A", ...teamListDropdown]}
              {...register("team")}
            />
            <Select
              label="Status Profile"
              options={["Active", "Suspended"]}
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
              Register User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
