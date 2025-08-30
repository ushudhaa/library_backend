import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
    trim: true 
  },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ["borrower", "librarian"], // only allowed values
    default: "borrower" 
  },
  profileImage: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  dateOfJoining: { type: Date },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("User", userSchema);
