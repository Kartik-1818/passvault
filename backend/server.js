const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
// Start Server
const PORT = process.env.PORT || 4000;
const app = express();

require("dotenv").config();
// Middleware
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// CORS Setup
app.use(
  cors({
    origin: "https://passvault-pi.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // If you need to send cookies
  })
);

//app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

  app.use("/api/auth", authRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema & Model
const passwordSchema = new mongoose.Schema(
  {
    website: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Password = mongoose.model("Password", passwordSchema);

// API Routes

// GET all passwords
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

const authenticate = require("./middleware/authmiddlewares");

app.get("/api/passwords", authenticate, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(passwords);
  } catch (err) {
    console.error("Error fetching passwords:", err);
    res.status(500).json({ message: "Failed to fetch passwords" });
  }
});

app.post("/api/passwords", authenticate, async (req, res) => {
  try {
    const newPass = new Password({ ...req.body, userId: req.user.id });
    await newPass.save();
    res.status(201).json(newPass);
  } catch (err) {
    console.error("Error saving password:", err);
    res.status(500).json({ message: "Failed to save password" });
  }
});

// PUT update password
app.put("/api/passwords/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Password.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Password not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// DELETE password
app.delete("/api/passwords/:id", authenticate, async (req, res) => {
  try {
    const deleted = await Password.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Password not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting password:", err);
    res.status(500).json({ message: "Failed to delete password" });
  }
});

// Fallback route to catch undefined routes
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Error handler (very important for Vercel logs!)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);  // 👈 force logs in Vercel
  res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
