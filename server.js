const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Flamin@2004", // your password
  database: "project", // your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// Route to handle form submission
app.post("/api/sql/upload", upload.single("file"), (req, res) => {
  const { name, email, phone, dob, food } = req.body;
  const shows = JSON.parse(req.body.shows);
  const file_path = req.file ? req.file.filename : null;

  const sql =
    "INSERT INTO users (name, email, phone, dob, food, shows, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, email, phone, dob, food, JSON.stringify(shows), file_path],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: "Failed to save data" });
      }

      res.json({
        name,
        email,
        phone,
        dob,
        food,
        shows,
        file_path: `/uploads/${file_path}`,
      });
    }
  );
});
app.use(cors());

app.listen(5000, () => console.log("Server running on port 5000"));
