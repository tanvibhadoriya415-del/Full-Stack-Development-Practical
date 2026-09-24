import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/projects";

const sections = ["Home", "Profile", "Academic", "Courses", "Attendance", "Skills", "Projects", "Certificates"];

export default function App() {
  const [active, setActive] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", technologies: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProjects() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load projects");
      setProjects(await response.json());
    } catch {
      setMessage("Backend se connect nahi ho pa raha. Check karo server chal raha hai.");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveProject(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Save failed");

      setForm({ title: "", description: "", technologies: "" });
      setEditingId(null);
      setMessage(editingId ? "Project updated!" : "Project added!");
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function editProject(project) {
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies || "",
    });
    setEditingId(project.id);
    setActive("Projects");
  }

  async function deleteProject(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setMessage("Project deleted.");
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function cancelEdit() {
    setForm({ title: "", description: "", technologies: "" });
    setEditingId(null);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">SP</span><span>Student<span className="brand-light">Space</span></span></div>
        <p className="side-label">PORTFOLIO MENU</p>
        <nav>
          {sections.map((section) => (
            <button
              key={section}
              className={`nav-link ${active === section ? "selected" : ""}`}
              onClick={() => setActive(section)}
            >
              <span className="nav-dot">{section === "Home" ? "⌂" : section === "Projects" ? "▣" : "○"}</span>
              {section}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar">ST</div>
          <div><strong>Student Name</strong><small>Academic Portfolio</small></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><span className="breadcrumb">Portfolio</span><span className="crumb-sep"> / </span><strong>{active}</strong></div>
          <span className="top-tag">STUDENT DASHBOARD</span>
        </header>

        {active === "Home" && (
          <section className="page">
            <div className="welcome-card">
              <div>
                <p className="eyebrow">YOUR DIGITAL ACADEMIC SPACE</p>
                <h1>Welcome to your<br /><span>Student Portfolio.</span></h1>
                <p className="welcome-copy">Keep your academic journey, skills, and projects organized in one place.</p>
                <button className="primary-btn" onClick={() => setActive("Profile")}>View My Profile <span>→</span></button>
              </div>
              <div className="welcome-art"><div className="art-circle">✦</div><div className="art-card card-one">✎ &nbsp; Learn</div><div className="art-card card-two">▣ &nbsp; Create</div><div className="art-card card-three">↗ &nbsp; Grow</div></div>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><span className="stat-icon purple">▤</span><p>Academic Overview</p><h2>Track progress</h2><small>Grades, courses and attendance</small></div>
              <div className="stat-card"><span className="stat-icon blue">▣</span><p>My Projects</p><h2>{projects.length} Projects</h2><small>Manage your work and ideas</small></div>
              <div className="stat-card"><span className="stat-icon green">✧</span><p>Skills & Growth</p><h2>Keep learning</h2><small>Showcase your strengths</small></div>
            </div>
            <div className="section-heading"><div><h2>Quick access</h2><p>Explore your portfolio sections</p></div></div>
            <div className="quick-grid">
              {["Academic", "Courses", "Attendance", "Skills"].map((item) => <button className="quick-card" key={item} onClick={() => setActive(item)}><span>{item}</span><b>→</b></button>)}
            </div>
          </section>
        )}

        {active === "Projects" && (
          <section className="page">
            <div className="page-title"><div><p className="eyebrow">BUILD & SHOWCASE</p><h1>My Projects</h1><p>Manage your project details with create, view, update and delete actions.</p></div><span className="count-pill">{projects.length} saved</span></div>
            {message && <div className="notice">{message}</div>}
            <div className="project-layout">
              <form className="project-form" onSubmit={saveProject}>
                <h2>{editingId ? "Update project" : "Add a project"}</h2>
                <label>Project title</label>
                <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Student Attendance App" required />
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={updateField} placeholder="Briefly describe your project..." rows="4" required />
                <label>Technologies</label>
                <input name="technologies" value={form.technologies} onChange={updateField} placeholder="e.g. React, Node.js" />
                <button className="primary-btn form-submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Save changes" : "Add project"}</button>
                {editingId && <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel edit</button>}
              </form>
              <div className="project-list">
                <h2>Project collection</h2>
                {projects.length === 0 ? <div className="empty-state"><div>▧</div><strong>No projects yet</strong><p>Add your first project using the form.</p></div> : projects.map((project) => (
                  <article className="project-card" key={project.id}>
                    <div className="project-card-top"><span className="project-symbol">▣</span><div className="project-actions"><button onClick={() => editProject(project)} title="Edit">✎</button><button onClick={() => deleteProject(project.id)} title="Delete">×</button></div></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.technologies && <div className="tech-tags">{project.technologies.split(",").map((tech, index) => <span key={index}>{tech.trim()}</span>)}</div>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {active !== "Home" && active !== "Projects" && (
          <section className="page">
            <p className="eyebrow">STUDENT PORTFOLIO</p>
            <h1>{active}</h1>
            <div className="info-card">
              <div className="info-icon">✦</div>
              <h2>{active} section</h2>
              <p>This section is part of your academic portfolio. You can add your personal {active.toLowerCase()} information here.</p>
              <button className="secondary-btn" onClick={() => setActive("Projects")}>Go to Projects →</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
