
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    authSource: "studentDB"
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.error("MongoDB Error:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    course: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

// Health API
app.get("/api/health", (req, res) => {
    res.json({ message: "Backend is running!" });
});

// CREATE
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start server
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log("Backend running on port 5000");
});
