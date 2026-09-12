const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db("AgenthumSmartOps");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Agenthum SmartOps Backend is running",
  });
});

app.post("/projects", async (req, res) => {
  try {
    const newProject = req.body;

    const result = await db
      .collection("projects")
      .insertOne(newProject);

    res.json({
      message: "Project added successfully",
      project: {
        ...newProject,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not add project",
    });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const newProject = req.body;

    await db.collection("projects").insertOne(newProject);

    res.json({
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not add project",
    });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await db
      .collection("tasks")
      .find()
      .toArray();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Could not load tasks",
    });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;

    await db.collection("tasks").insertOne(newTask);

    res.json({
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not add task",
    });
  }
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.collection("users").findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const newUser = {
      name: name,
      email: email,
      password: crypto
  .createHash("sha256")
  .update(password)
  .digest("hex"),
    };

    await db.collection("users").insertOne(newUser);

    res.json({
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (
      user.password !== hashedPassword &&
      user.password !== password
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password === password) {
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    }

    res.json({
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

const PORT = 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();