require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    // Connect database
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Admin credentials
    const email = "admin@example.com";
    const password = "Admin@123";

    // Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    process.exit(0);

  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();