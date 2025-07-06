const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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
const corsOptions = {
  origin: 'https://your-frontend.vercel.app',// Update this to match your frontend port
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema & Model
const passwordSchema = new mongoose.Schema({
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Password = mongoose.model("Password", passwordSchema);

// API Routes

// GET all passwords
app.get('/', (req, res) => {
  res.send('About route 🎉 ')
})

// app.get("/api/passwords", async (req, res) => {
//   try {
//     const passwords = await Password.find().sort({ createdAt: -1 });
//     res.json(passwords);
//   } catch (err) {
//     console.error("Error fetching passwords:", err);
//     res.status(500).json({ message: "Failed to fetch passwords" });
//   }
// });

// POST new password
app.post("/api/passwords", async (req, res) => {
  try {
    console.log("📥 Incoming POST request:", req.body);
    const newPass = new Password(req.body);
    await newPass.save();
    console.log("✅ Password saved successfully");
    res.status(201).json(newPass);
  } catch (err) {
    console.error("❌ Error saving password:", err);
    res.status(500).json({ message: "Failed to save password" });
  }
});

// PUT update password
app.put("/api/passwords/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Password.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Password not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// DELETE password
app.delete("/api/passwords/:id", async (req, res) => {
  try {
    const deleted = await Password.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Password not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting password:", err);
    res.status(500).json({ message: "Failed to delete password" });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
