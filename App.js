import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [serverMessage, setServerMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [projects, setProjects] = useState([
    {
      name: "Smart Banking App",
      client: "ABC Bank",
      status: "In Progress",
      progress: "70%",
    },
    {
      name: "Healthcare Portal",
      client: "HealthCare Ltd",
      status: "In Progress",
      progress: "45%",
    },
    {
      name: "Retail Management",
      client: "Retail Corp",
      status: "Completed",
      progress: "100%",
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      name: "Design login screen",
      project: "Smart Banking App",
      status: "In Progress",
    },
    {
      name: "Create project dashboard",
      project: "Healthcare Portal",
      status: "Pending",
    },
    {
      name: "Test mobile application",
      project: "Retail Management",
      status: "Completed",
    },
  ]);

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");

  const [taskName, setTaskName] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
const checkServer = async () => {
  try {
    const response = await fetch("https://agenthumsmartops-api.onrender.com");
    const data = await response.json();

    setServerMessage(data.message);
  } catch (error) {
    setServerMessage("Server not connected");
  }
};  
const loadProjects = async () => {
  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/projects"
    );

    const data = await response.json();

    setProjects(data);
  } catch (error) {
    console.log("Projects could not be loaded");
  }
};
useEffect(() => {
  checkServer();
  loadProjects();
  loadTasks();
}, []);
  const login = async () => {
  if (email === "" || password === "") {
    Alert.alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(data.message);
      return;
    }

    setLoggedIn(true);
    setScreen("dashboard");
  } catch (error) {
    Alert.alert("Server not connected");
  }
};

  const register = async () => {
  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    Alert.alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(data.message);
      return;
    }

    Alert.alert("Registration Successful");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setScreen("login");
  } catch (error) {
    Alert.alert("Server not connected");
  }
};

  const logout = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setScreen("login");
  };

  const addProject = async () => {
  if (projectName === "" || clientName === "") {
    Alert.alert("Please enter project and client name");
    return;
  }

  const newProject = {
    name: projectName,
    client: clientName,
    status: "New",
    progress: "0%",
  };

  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      }
    );

    const data = await response.json();

    setProjects([...projects, data.project]);

    setProjectName("");
    setClientName("");

    Alert.alert("Project Added Successfully");
  } catch (error) {
    Alert.alert("Server not connected");
  }
};

  const addTask = async () => {
  if (taskName === "" || taskProject === "" || taskStatus === "") {
    Alert.alert("Please fill all task details");
    return;
  }

  const newTask = {
    name: taskName,
    project: taskProject,
    status: taskStatus,
  };

  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      }
    );

    const data = await response.json();

    setTasks([...tasks, data.task]);

    setTaskName("");
    setTaskProject("");
    setTaskStatus("");

    Alert.alert("Task Added Successfully");
  } catch (error) {
    Alert.alert("Server not connected");
  }
};
const loadTasks = async () => {
  try {
    const response = await fetch(
      "https://agenthumsmartops-api.onrender.com/tasks"
    );

    const data = await response.json();

    setTasks(data);
  } catch (error) {
    console.log("Tasks could not be loaded");
  }
};
 const sendMessage = async () => {
  if (message === "") {
    return;
  }

  const newMessage = {
    text: message,
    user: true,
  };

  setMessages([...messages, newMessage]);
  setMessage("");

  setTimeout(async () => {
    let reply = "";
    const userMessage = message.toLowerCase();

    if (userMessage.includes("project")) {
      reply =
        "You currently have " +
        projects.length +
        " projects in SmartOps.";
    } else if (userMessage.includes("task")) {
      reply =
        "You currently have " +
        tasks.length +
        " tasks in SmartOps.";
    } else if (userMessage.includes("report")) {
      reply =
        "You can open Reports to view your project and task summary.";
    } else if (
  userMessage.includes("create") ||
  userMessage.includes("generate") ||
  userMessage.includes("build")
) {
  reply =
    "Here is a task plan for your food delivery app:\n1. Design Login Screen\n2. Create Home Screen\n3. Add Restaurant Listing\n4. Add Cart and Checkout\n5. Add Payment System\n6. Test the Application";
    const aiTasks = [
  "Design Login Screen",
  "Create Home Screen",
  "Add Restaurant Listing",
  "Add Cart and Checkout",
  "Add Payment System",
  "Test the Application",
];

for (const task of aiTasks) {
  await fetch("https://agenthumsmartops-api.onrender.com/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: task,
      project: "Food Delivery App",
      status: "Pending",
    }),
  });
}
  } else if (userMessage.includes("help")) {
  reply =
    "I can help you with projects, tasks, reports and creating project task plans.";
} else {
  reply =
    "I can help you manage projects, tasks, reports and daily work.";
}

    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: reply,
        user: false,
      },
    ]);
  }, 500);
};
if (loggedIn && screen === "ai") {
  return (
    <View style={styles.main}>

      <TouchableOpacity onPress={() => setScreen("dashboard")}>
        <Text style={styles.back}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>
        AI Assistant
      </Text>

      <Text style={styles.pageSubtitle}>
        Smart help for your daily work
      </Text>

      <ScrollView style={styles.chatBox}>
        {messages.length === 0 && (
          <View style={styles.aiMessage}>
            <Text style={styles.aiText}>
              Hello 👋 I am SmartOps Assistant.
            </Text>

            <Text style={styles.aiText}>
              Ask me about your projects or tasks.
            </Text>
          </View>
        )}

        {messages.map((item, index) => (
          <View
            key={index}
            style={
              item.user
                ? styles.userMessage
                : styles.aiMessage
            }
          >
            <Text style={styles.messageText}>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.messageArea}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendText}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
if (loggedIn && screen === "reports") {
  return (
    <ScrollView style={styles.main}>

      <TouchableOpacity onPress={() => setScreen("dashboard")}>
        <Text style={styles.back}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>
        Reports
      </Text>

      <Text style={styles.pageSubtitle}>
        Project and task summary
      </Text>

      <View style={styles.reportCard}>
        <Text style={styles.reportNumber}>
          {projects.length}
        </Text>

        <Text style={styles.reportTitle}>
          Total Projects
        </Text>

        <Text style={styles.reportText}>
          Projects currently added in SmartOps
        </Text>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportNumber}>
          {tasks.length}
        </Text>

        <Text style={styles.reportTitle}>
          Total Tasks
        </Text>

        <Text style={styles.reportText}>
          Tasks available in your workspace
        </Text>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportNumber}>
          {tasks.filter((task) => task.status === "Completed").length}
        </Text>

        <Text style={styles.reportTitle}>
          Completed Tasks
        </Text>

        <Text style={styles.reportText}>
          Tasks completed successfully
        </Text>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportNumber}>
          {projects.length}
        </Text>

        <Text style={styles.reportTitle}>
          Monthly Reports
        </Text>

        <Text style={styles.reportText}>
          Reports generated this month
        </Text>
      </View>

    </ScrollView>
  );
}
if (loggedIn && screen === "settings") {
  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity
        onPress={() => setScreen("dashboard")}
      >
        <Text style={styles.back}>
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>
        Settings
      </Text>

      <Text style={styles.pageSubtitle}>
        Manage your app preferences
      </Text>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>
          Account
        </Text>

        <Text style={styles.settingsText}>
          Manage your SmartOps account settings.
        </Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>
          Notifications
        </Text>

        <Text style={styles.settingsText}>
          Stay updated about projects and tasks.
        </Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>
          App Information
        </Text>

        <Text style={styles.settingsText}>
          Agenthum SmartOps
        </Text>

        <Text style={styles.settingsText}>
          Version 1.0
        </Text>
      </View>
    </ScrollView>
  );
}
if (loggedIn && screen === "profile") {
  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity
        onPress={() => setScreen("dashboard")}
      >
        <Text style={styles.back}>
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>
        Profile
      </Text>

      <Text style={styles.pageSubtitle}>
        Your account information
      </Text>

      <View style={styles.profileCard}>
        <Text style={styles.profileIcon}>
          👤
        </Text>

        <Text style={styles.profileName}>
          {name || "Navneet Pandey"}
        </Text>

        <Text style={styles.profileEmail}>
          {email}
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.infoTitle}>
          Account Details
        </Text>

        <Text style={styles.infoText}>
          Name: {name || "Navneet Pandey"}
        </Text>

        <Text style={styles.infoText}>
          Email: {email}
        </Text>

        <Text style={styles.infoText}>
          Role: App Developer
        </Text>
      </View>
    </ScrollView>
  );
}
if (loggedIn && screen === "notifications") {
  return (
    <ScrollView style={styles.main}>

      <TouchableOpacity
        onPress={() => setScreen("dashboard")}
      >
        <Text style={styles.back}>
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>
        Notifications
      </Text>

      <Text style={styles.pageSubtitle}>
        Recent updates from your workspace
      </Text>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>
          New Task Added
        </Text>

        <Text style={styles.notificationText}>
          A new task has been added to Smart Banking App.
        </Text>

        <Text style={styles.notificationTime}>
          Just now
        </Text>
      </View>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>
          Project Updated
        </Text>

        <Text style={styles.notificationText}>
          Healthcare Portal project status was updated.
        </Text>

        <Text style={styles.notificationTime}>
          Today
        </Text>
      </View>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>
          Task Completed
        </Text>

        <Text style={styles.notificationText}>
          Test mobile application task was completed.
        </Text>

        <Text style={styles.notificationTime}>
          Yesterday
        </Text>
      </View>

    </ScrollView>
  );
}
  if (loggedIn && screen === "projects") {
    return (
      <ScrollView style={styles.main}>
        <TouchableOpacity onPress={() => setScreen("dashboard")}>
          <Text style={styles.back}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Projects</Text>

        <Text style={styles.pageSubtitle}>
          Manage all your projects
        </Text>

        <View style={styles.addBox}>
          <Text style={styles.boxTitle}>Add New Project</Text>

          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
          />

          <TextInput
            style={styles.input}
            placeholder="Client Name"
            value={clientName}
            onChangeText={setClientName}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={addProject}
          >
            <Text style={styles.buttonText}>Add Project</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Projects</Text>

        {projects.map((project, index) => (
          <View style={styles.projectCard} key={index}>
            <Text style={styles.projectName}>
              {project.name}
            </Text>

            <Text style={styles.client}>
              Client: {project.client}
            </Text>

            <Text style={styles.status}>
              Status: {project.status}
            </Text>

            <Text style={styles.progress}>
              Progress: {project.progress}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  if (loggedIn && screen === "tasks") {
    return (
      <ScrollView style={styles.main}>
        <TouchableOpacity onPress={() => setScreen("dashboard")}>
          <Text style={styles.back}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Tasks</Text>

        <Text style={styles.pageSubtitle}>
          Manage your daily tasks
        </Text>

        <View style={styles.addBox}>
          <Text style={styles.boxTitle}>Add New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={taskName}
            onChangeText={setTaskName}
          />

          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={taskProject}
            onChangeText={setTaskProject}
          />

          <TextInput
            style={styles.input}
            placeholder="Status (Pending / In Progress / Completed)"
            value={taskStatus}
            onChangeText={setTaskStatus}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={addTask}
          >
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Tasks</Text>

        {tasks.map((task, index) => (
          <View style={styles.projectCard} key={index}>
            <Text style={styles.projectName}>
              {task.name}
            </Text>

            <Text style={styles.client}>
              Project: {task.project}
            </Text>

            <Text style={styles.status}>
              Status: {task.status}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  if (loggedIn && screen === "dashboard") {
    return (
      <ScrollView style={styles.main}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSmall}>
              Welcome back
            </Text>

            <Text style={styles.headerTitle}>
              Agenthum SmartOps
            </Text>
          </View>

         <TouchableOpacity
  style={styles.profile}
  onPress={() => setScreen("profile")}
>
  <Text style={styles.profileText}>N</Text>
</TouchableOpacity>
        </View>

        <Text style={styles.dashboardHeading}>
          Dashboard
        </Text>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Hello 👋
          </Text>

          <Text style={styles.welcomeText}>
            Manage your projects and daily work from one place.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Overview
        </Text>
        <View style={styles.serverCard}>
  <Text style={styles.serverTitle}>
    Backend Status
  </Text>

  <Text style={styles.serverText}>
    {serverMessage || "Checking server..."}
  </Text>
</View>

        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {projects.length}
            </Text>

            <Text style={styles.statTitle}>
              Projects
            </Text>

            <Text style={styles.statText}>
              Total projects
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tasks.length}
            </Text>

            <Text style={styles.statTitle}>
              Tasks
            </Text>

            <Text style={styles.statText}>
              Total tasks
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              08
            </Text>

            <Text style={styles.statTitle}>
              Completed
            </Text>

            <Text style={styles.statText}>
              Tasks completed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              02
            </Text>

            <Text style={styles.statTitle}>
              Reports
            </Text>

            <Text style={styles.statText}>
              This month
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

       <TouchableOpacity
  style={styles.actionCard}
  onPress={() => setScreen("projects")}
>
  <Text style={styles.actionTitle}>
    Projects
  </Text>
  <Text style={styles.actionText}>
    Manage your projects and clients
  </Text>
</TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setScreen("tasks")}
        >
          <Text style={styles.actionTitle}>
            Tasks
          </Text>

          <Text style={styles.actionText}>
            Check your pending and completed tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.actionCard}
  onPress={() => setScreen("ai")}
>
  <Text style={styles.actionTitle}>
    AI Assistant
  </Text>

  <Text style={styles.actionText}>
    Get help with project work
  </Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => setScreen("reports")}>
          <Text style={styles.actionTitle}>
            Reports
          </Text>

          <Text style={styles.actionText}>
            View project and task reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.actionCard}
  onPress={() => setScreen("notifications")}
>
  <Text style={styles.actionTitle}>
    Notifications
  </Text>

  <Text style={styles.actionText}>
    View recent project and task updates
  </Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.actionCard}
  onPress={() => setScreen("profile")}
>
  <Text style={styles.actionTitle}>
    Profile
  </Text>

  <Text style={styles.actionText}>
    View your account information
  </Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.actionCard}
  onPress={() => setScreen("settings")}
>
  <Text style={styles.actionTitle}>
    Settings
  </Text>

  <Text style={styles.actionText}>
    Manage your app preferences
  </Text>
</TouchableOpacity>
<Text style={styles.sectionTitle}>
  Recent Activity
</Text>
<View style={styles.activityCard}>
  <Text style={styles.activityTitle}>
    New Task Added
  </Text>

  <Text style={styles.activityText}>
    A new task was added to Smart Banking App.
  </Text>
</View>
<View style={styles.activityCard}>
  <Text style={styles.activityTitle}>
    Project Updated
  </Text>

  <Text style={styles.activityText}>
    Healthcare Portal project was updated today.
  </Text>
</View>
<View style={styles.activityCard}>
  <Text style={styles.activityTitle}>
    Task Completed
  </Text>

  <Text style={styles.activityText}>
    Test mobile application task was completed.
  </Text>
</View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "register") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>Agenthum</Text>

        <Text style={styles.smartops}>
          SmartOps
        </Text>

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Register to start using SmartOps
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={register}
        >
          <Text style={styles.buttonText}>
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen("login")}
        >
          <Text style={styles.switchText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        Agenthum
      </Text>

      <Text style={styles.smartops}>
        SmartOps
      </Text>

      <Text style={styles.title}>
        Welcome Back!
      </Text>

      <Text style={styles.subtitle}>
        Login to manage your projects
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setScreen("register")}
      >
        <Text style={styles.switchText}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#ffffff",
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },

  smartops: {
    fontSize: 22,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  switchText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
  },

  main: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 45,
  },

  headerSmall: {
    color: "#777",
    fontSize: 14,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 5,
  },

  profile: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },

  dashboardHeading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },

  welcomeCard: {
    backgroundColor: "#222",
    padding: 22,
    borderRadius: 12,
    marginBottom: 25,
  },

  welcomeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  welcomeText: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 21,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowOpacity: 0.08,
  },

  statNumber: {
    fontSize: 30,
    fontWeight: "bold",
  },

  statTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  statText: {
    color: "#777",
    fontSize: 13,
    marginTop: 4,
  },

  actionCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowOpacity: 0.08,
  },

  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  actionText: {
    color: "#666",
    marginTop: 5,
    fontSize: 15,
  },

  logoutButton: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  back: {
    fontSize: 16,
    marginTop: 40,
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },

  pageSubtitle: {
    color: "#666",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 25,
  },

  addBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },

  boxTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 15,
  },

  projectCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },

  projectName: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },

  client: {
    color: "#555",
    marginBottom: 5,
  },

  status: {
    color: "#555",
    marginBottom: 5,
  },

  progress: {
    fontWeight: "bold",
    marginTop: 5,
  },
    reportCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activityCard: {
  backgroundColor: "#fff",
  padding: 18,
  borderRadius: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#eee",
},

activityTitle: {
  fontSize: 17,
  fontWeight: "bold",
},

activityText: {
  color: "#666",
  marginTop: 5,
  fontSize: 14,
},
  profileCard: {
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 12,
  marginBottom: 15,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#eee",
},
settingsCard: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#eee",
},
settingsTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
},
settingsText: {
  fontSize: 15,
  color: "#555",
  marginBottom: 8,
},
profileIcon: {
  fontSize: 45,
  marginBottom: 10,
},
profileName: {
  fontSize: 22,
  fontWeight: "bold",
},
profileName: {
  fontSize: 22,
  fontWeight: "bold",
},

profileEmail: {
  color: "#666",
  marginTop: 5,
},
profileInfo: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#eee",
},
infoTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 15,
},
infoText: {
  fontSize: 15,
  color: "#555",
  marginBottom: 12,
},

  reportNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },

  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  reportText: {
    color: "#666",
    marginTop: 5,
    fontSize: 14,
  },
});