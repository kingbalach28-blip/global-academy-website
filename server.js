const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ===== CREATE UPLOAD FOLDER =====
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ===== MONGODB CONNECT =====
mongoose.connect("mongodb://127.0.0.1:27017/academy")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error:", err));

// ===== STORAGE =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ===== SCHEMA =====
const studentSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  gender: String,
  contact: String,
  whatsapp: String,
  email: String,
  course: String,
  campus: String,
  cnic: String,
  dob: String,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

// ===== SUBMIT FORM =====
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    console.log("DATA RECEIVED:", req.body);

    const existing = await Student.findOne({ cnic: req.body.cnic });

    if (existing) {
      return res.json({
        success: false,
        message: "You already applied!"
      });
    }

    const student = new Student({
      ...req.body,
      photo: req.file ? req.file.filename : ""
    });

    await student.save();

    res.json({
      success: true,
      message: "Form submitted successfully"
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});



// ===== GET ALL STUDENTS =====
app.get("/students", async (req, res) => {
  const data = await Student.find().sort({ createdAt: -1 });
  res.json(data);
});

// ===== ADMIN GET STUDENTS =====
app.get("/admin/students", async (req, res) => {
  const data = await Student.find().sort({ createdAt: -1 });
  res.json(data);
});








// ===== START =====
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});