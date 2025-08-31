import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import routes from "./routes/route.js";
import cookieParser from "cookie-parser";
import User from "./models/User.js";
import dbConnect from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const port = process.env.PORT_NUM || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads/"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://library-frontend-beryl-sigma.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("Api is running success"));
app.use("/api", routes);
dbConnect()
  .then(async () => {
    console.log(`MongoDB connected successfully.`);
    // Ensure seed runs only after a successful DB connection
    await seedUsers();
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Routes



// Seed Admin and Demo Users
const seedUsers = async () => {
  try {
    // Seed Admin
    const admin = await User.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        name: "Admin admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "librarian",
        profileImage: "https://example.com/images/niraj.jpg",
        phoneNumber: "9809988776",
        address: "Jhapa, Damak",
        dateOfJoining: "2020-02-10T00:00:00.000Z",
        isActive: true,
      });
      console.log("Admin user created");
    }

    // Seed Demo Borrower (Numa)
    const numa = await User.findOne({ email: "numa@example.com" });
    if (!numa) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Numa",
        email: "numa@example.com",
        password: hashedPassword,
        role: "borrower",
      });
      console.log("Demo borrower (Numa) created");
    }

    // Seed Demo Librarian (Ushudha)
    const ushudha = await User.findOne({ email: "ushudha@example.com" });
    if (!ushudha) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Ushudha",
        email: "ushudha@example.com",
        password: hashedPassword,
        role: "librarian",
      });
      console.log("Demo librarian (Ushudha) created");
    }
  } catch (error) {
    console.log("Error seeding users:", error);
  }
};
