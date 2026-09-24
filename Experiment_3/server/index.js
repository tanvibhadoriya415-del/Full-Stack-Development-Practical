const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let projects = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Student Portfolio API is running");
});

// Read all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Read one project
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((item) => item.id === Number(req.params.id));

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
});

// Create project
app.post("/api/projects", (req, res) => {
  const { title, description, technologies } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const newProject = {
    id: nextId++,
    title,
    description,
    technologies: technologies || "",
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put("/api/projects/:id", (req, res) => {
  const project = projects.find((item) => item.id === Number(req.params.id));

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const { title, description, technologies } = req.body;

  project.title = title ?? project.title;
  project.description = description ?? project.description;
  project.technologies = technologies ?? project.technologies;

  res.json(project);
});

// Delete project
app.delete("/api/projects/:id", (req, res) => {
  const index = projects.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  const deletedProject = projects.splice(index, 1)[0];
  res.json({ message: "Project deleted", project: deletedProject });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
