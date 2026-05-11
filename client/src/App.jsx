import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCog
} from "lucide-react";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";

const demoAccounts = [
  ["Student", "student@example.com", "student123"],
  ["Faculty", "faculty@example.com", "faculty123"],
  ["Proctor", "proctor@example.com", "proctor123"],
  ["HOD", "hod@example.com", "hod123"],
  ["Admin", "admin@example.com", "admin123"]
];

const statusLabels = {
  pending_faculty: "Pending Faculty",
  pending_proctor: "Pending Proctor",
  pending_hod: "Pending HOD",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled"
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

function StatusBadge({ status }) {
  const tone =
    status === "approved"
      ? "bg-emerald-100 text-emerald-700"
      : status === "rejected"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{statusLabels[status] || status}</span>;
}

function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "student@example.com", password: "student123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Student Permission & Leave Management System
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Online approvals for student leave and permission requests.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Students submit requests, faculty and proctors review them, HODs give final approval, and admins manage users,
            mappings, notifications, and history from one workflow.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["JWT login", "Role dashboards", "Approval history"].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white/70 p-4 font-semibold shadow-sm">
                <CheckCircle2 className="mb-2 h-5 w-5 text-blue-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Use a seeded account or an admin-created user.</p>
          {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="label">Email</span>
              <input
                className="input mt-1"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="label">Password</span>
              <input
                className="input mt-1"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </label>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-700">Demo accounts</p>
            <div className="mt-3 space-y-2 text-sm">
              {demoAccounts.map(([role, email, password]) => (
                <button
                  key={role}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-blue-300"
                  type="button"
                  onClick={() => setForm({ email, password })}
                >
                  <span className="font-semibold">{role}</span>
                  <span className="text-slate-500">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardShell() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navItems = useMemo(() => {
    const base = [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }];

    if (user.role === "student") {
      return [
        ...base,
        { key: "leave", label: "Leave Request", icon: ClipboardList },
        { key: "permission", label: "Permission Request", icon: ShieldCheck },
        { key: "history", label: "History", icon: History },
        { key: "notifications", label: "Notifications", icon: Bell }
      ];
    }

    if (user.role === "admin") {
      return [
        ...base,
        { key: "approvals", label: "Requests", icon: ClipboardList },
        { key: "admin", label: "Admin Panel", icon: UserCog },
        { key: "notifications", label: "Notifications", icon: Bell }
      ];
    }

    return [
      ...base,
      { key: "approvals", label: "Approvals", icon: ShieldCheck },
      { key: "history", label: "History", icon: History },
      { key: "notifications", label: "Notifications", icon: Bell }
    ];
  }, [user.role]);

  async function loadData() {
    setLoading(true);
    try {
      const [dashboardResponse, requestResponse, notificationResponse] = await Promise.all([
        api.get("/dashboard"),
        api.get("/requests"),
        api.get("/notifications")
      ]);
      setDashboard(dashboardResponse.data);
      setRequests(requestResponse.data.requests);
      setNotifications(notificationResponse.data.notifications);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitRequest(payload) {
    await api.post("/requests", payload);
    setMessage("Request submitted successfully.");
    setView("history");
    await loadData();
  }

  async function decideRequest(requestId, action) {
    const comments = window.prompt(`Add comments for ${action}:`, "");
    await api.patch(`/requests/${requestId}/decision`, { action, comments });
    setMessage(`Request ${action}d successfully.`);
    await loadData();
  }

  async function markRead(notificationId) {
    await api.patch(`/notifications/${notificationId}/read`);
    await loadData();
  }

  const pendingForUser = requests.filter((request) => {
    if (user.role === "admin") return request.status.startsWith("pending_");
    return request.current_approver_role === user.role && request.status.startsWith("pending_");
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">SPLMS</p>
          <h1 className="mt-2 text-xl font-black text-slate-950">Permission & Leave</h1>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition ${
                view === key ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setView(key)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{user.role}</p>
              <h2 className="text-2xl font-black text-slate-950">Welcome, {user.name}</h2>
              <p className="text-sm text-slate-500">{user.department}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="input lg:hidden" value={view} onChange={(event) => setView(event.target.value)}>
                {navItems.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button className="btn-secondary flex items-center gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-6 p-4 lg:p-8">
          {message && (
            <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
              <span>{message}</span>
              <button onClick={() => setMessage("")}>Dismiss</button>
            </div>
          )}

          {loading ? (
            <div className="card">Loading...</div>
          ) : (
            <>
              {view === "dashboard" && <DashboardOverview dashboard={dashboard} user={user} pendingForUser={pendingForUser} />}
              {view === "leave" && <RequestForm type="leave" onSubmit={submitRequest} />}
              {view === "permission" && <RequestForm type="permission" onSubmit={submitRequest} />}
              {view === "approvals" && (
                <RequestsTable requests={user.role === "admin" ? requests : pendingForUser} user={user} onDecision={decideRequest} />
              )}
              {view === "history" && <RequestsTable requests={requests} user={user} onDecision={decideRequest} />}
              {view === "notifications" && <NotificationsPanel notifications={notifications} onRead={markRead} />}
              {view === "admin" && <AdminPanel onChanged={loadData} />}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function DashboardOverview({ dashboard, user, pendingForUser }) {
  const totalRequests = dashboard.statusCounts.reduce((sum, item) => sum + Number(item.total), 0);
  const approved = dashboard.statusCounts.find((item) => item.status === "approved")?.total || 0;
  const rejected = dashboard.statusCounts.find((item) => item.status === "rejected")?.total || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Requests" value={totalRequests} />
        <MetricCard label={user.role === "student" ? "In Progress" : "Awaiting You"} value={pendingForUser.length} />
        <MetricCard label="Approved" value={approved} />
        <MetricCard label="Rejected" value={rejected} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <h3 className="text-lg font-bold">Recent requests</h3>
          <div className="mt-4 space-y-3">
            {dashboard.recentRequests.length === 0 && <p className="text-slate-500">No requests yet.</p>}
            {dashboard.recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="font-semibold">{request.subject}</p>
                  <p className="text-sm text-slate-500">{request.student_name}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold">Request types</h3>
          <div className="mt-4 space-y-3">
            {dashboard.typeCounts.map((item) => (
              <div key={item.request_type} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="font-semibold capitalize">{item.request_type}</span>
                <span className="text-2xl font-black text-blue-600">{item.total}</span>
              </div>
            ))}
            <div className="rounded-xl bg-blue-50 p-3 font-semibold text-blue-700">
              {dashboard.unreadNotifications} unread notifications
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function RequestForm({ type, onSubmit }) {
  const [form, setForm] = useState({
    subject: "",
    reason: "",
    start_date: "",
    end_date: "",
    from_time: "",
    to_time: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit({ ...form, request_type: type });
      setForm({ subject: "", reason: "", start_date: "", end_date: "", from_time: "", to_time: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-3xl">
      <h3 className="text-2xl font-black capitalize">Submit {type} request</h3>
      <p className="mt-1 text-slate-500">
        The request will move through faculty, proctor, and HOD approval based on your mapping.
      </p>
      {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label>
          <span className="label">Subject</span>
          <input
            className="input mt-1"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            required
          />
        </label>
        <label>
          <span className="label">Reason</span>
          <textarea
            className="input mt-1 min-h-32"
            value={form.reason}
            onChange={(event) => setForm({ ...form, reason: event.target.value })}
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Start date</span>
            <input
              className="input mt-1"
              type="date"
              value={form.start_date}
              onChange={(event) => setForm({ ...form, start_date: event.target.value })}
              required
            />
          </label>
          <label>
            <span className="label">End date</span>
            <input
              className="input mt-1"
              type="date"
              value={form.end_date}
              onChange={(event) => setForm({ ...form, end_date: event.target.value })}
              required
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">From time</span>
            <input
              className="input mt-1"
              type="time"
              value={form.from_time}
              onChange={(event) => setForm({ ...form, from_time: event.target.value })}
            />
          </label>
          <label>
            <span className="label">To time</span>
            <input
              className="input mt-1"
              type="time"
              value={form.to_time}
              onChange={(event) => setForm({ ...form, to_time: event.target.value })}
            />
          </label>
        </div>
        <button className="btn-primary w-fit" disabled={loading}>
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </div>
  );
}

function RequestsTable({ requests, user, onDecision }) {
  if (!requests.length) {
    return <div className="card">No requests found.</div>;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Mapped Staff</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => {
              const canDecide =
                request.status.startsWith("pending_") &&
                (user.role === "admin" || request.current_approver_role === user.role);

              return (
                <tr key={request.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{request.student_name}</p>
                    <p className="text-xs text-slate-500">{request.roll_number || request.student_email}</p>
                  </td>
                  <td className="px-4 py-4 capitalize">{request.request_type}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{request.subject}</p>
                    <p className="mt-1 line-clamp-2 max-w-xs text-slate-500">{request.reason}</p>
                  </td>
                  <td className="px-4 py-4">
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    {(request.from_time || request.to_time) && (
                      <p className="text-xs text-slate-500">
                        {request.from_time || "--"} to {request.to_time || "--"}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <p>Faculty: {request.faculty_name || "-"}</p>
                    <p>Proctor: {request.proctor_name || "-"}</p>
                  </td>
                  <td className="px-4 py-4">
                    {canDecide ? (
                      <div className="flex gap-2">
                        <button className="btn-primary px-3 py-1 text-xs" onClick={() => onDecision(request.id, "approve")}>
                          Approve
                        </button>
                        <button className="btn-secondary px-3 py-1 text-xs" onClick={() => onDecision(request.id, "reject")}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No action</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationsPanel({ notifications, onRead }) {
  if (!notifications.length) {
    return <div className="card">No notifications yet.</div>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div key={notification.id} className={`card ${notification.is_read ? "opacity-70" : ""}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{notification.title}</p>
              <p className="mt-1 text-slate-600">{notification.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
            {!notification.is_read && (
              <button className="btn-secondary" onClick={() => onRead(notification.id)}>
                Mark read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPanel({ onChanged }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "Computer Science",
    phone: "",
    roll_number: "",
    course: "",
    year: "",
    faculty_id: "",
    proctor_id: ""
  });
  const [mapping, setMapping] = useState({ student_id: "", roll_number: "", course: "", year: "", faculty_id: "", proctor_id: "" });

  async function loadUsers() {
    const response = await api.get("/admin/users");
    setUsers(response.data.users);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/admin/users", userForm);
      setMessage("User created successfully.");
      setUserForm({ ...userForm, name: "", email: "", password: "", phone: "", roll_number: "" });
      await loadUsers();
      await onChanged();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  async function updateMapping(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.patch(`/admin/students/${mapping.student_id}/mapping`, mapping);
      setMessage("Mapping updated successfully.");
      await loadUsers();
      await onChanged();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  const students = users.filter((user) => user.role === "student");
  const faculties = users.filter((user) => user.role === "faculty");
  const proctors = users.filter((user) => user.role === "proctor");

  function selectStudent(studentId) {
    const student = students.find((item) => Number(item.id) === Number(studentId));
    setMapping({
      student_id: studentId,
      roll_number: student?.roll_number || "",
      course: student?.course || "",
      year: student?.year || "",
      faculty_id: student?.faculty_id || "",
      proctor_id: student?.proctor_id || ""
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card">
        <h3 className="text-xl font-black">Create user</h3>
        {message && <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-700">{message}</div>}
        <form onSubmit={createUser} className="mt-5 grid gap-3">
          {["name", "email", "password", "department", "phone"].map((field) => (
            <label key={field}>
              <span className="label capitalize">{field.replace("_", " ")}</span>
              <input
                className="input mt-1"
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                value={userForm[field]}
                onChange={(event) => setUserForm({ ...userForm, [field]: event.target.value })}
                required={field !== "phone"}
              />
            </label>
          ))}
          <label>
            <span className="label">Role</span>
            <select className="input mt-1" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
              {["student", "faculty", "proctor", "hod", "admin"].map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          {userForm.role === "student" && (
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
              <label>
                <span className="label">Roll number</span>
                <input
                  className="input mt-1"
                  value={userForm.roll_number}
                  onChange={(event) => setUserForm({ ...userForm, roll_number: event.target.value })}
                />
              </label>
              <label>
                <span className="label">Course</span>
                <input
                  className="input mt-1"
                  value={userForm.course}
                  onChange={(event) => setUserForm({ ...userForm, course: event.target.value })}
                />
              </label>
              <label>
                <span className="label">Year</span>
                <input
                  className="input mt-1"
                  type="number"
                  value={userForm.year}
                  onChange={(event) => setUserForm({ ...userForm, year: event.target.value })}
                />
              </label>
            </div>
          )}

          <button className="btn-primary">Create user</button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-black">Student-faculty/proctor mapping</h3>
          <form onSubmit={updateMapping} className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="label">Student</span>
              <select className="input mt-1" value={mapping.student_id} onChange={(event) => selectStudent(event.target.value)} required>
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.roll_number || student.email})
                  </option>
                ))}
              </select>
            </label>
            {["roll_number", "course", "year"].map((field) => (
              <label key={field}>
                <span className="label capitalize">{field.replace("_", " ")}</span>
                <input
                  className="input mt-1"
                  type={field === "year" ? "number" : "text"}
                  value={mapping[field]}
                  onChange={(event) => setMapping({ ...mapping, [field]: event.target.value })}
                />
              </label>
            ))}
            <label>
              <span className="label">Faculty</span>
              <select className="input mt-1" value={mapping.faculty_id} onChange={(event) => setMapping({ ...mapping, faculty_id: event.target.value })}>
                <option value="">None</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label">Proctor</span>
              <select className="input mt-1" value={mapping.proctor_id} onChange={(event) => setMapping({ ...mapping, proctor_id: event.target.value })}>
                <option value="">None</option>
                {proctors.map((proctor) => (
                  <option key={proctor.id} value={proctor.id}>
                    {proctor.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn-primary md:col-span-2">Update mapping</button>
          </form>
        </div>

        <div className="card overflow-hidden">
          <h3 className="text-xl font-black">Users</h3>
          <div className="mt-4 max-h-[460px] overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Mapping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((person) => (
                  <tr key={person.id}>
                    <td className="px-3 py-3">
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-xs text-slate-500">{person.email}</p>
                    </td>
                    <td className="px-3 py-3 capitalize">{person.role}</td>
                    <td className="px-3 py-3">{person.department}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">
                      {person.role === "student" ? `Faculty #${person.faculty_id || "-"}, Proctor #${person.proctor_id || "-"}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardShell /> : <LoginPage />;
}
