import User from '../models/User.js';
import bcrypt from 'bcryptjs';
// import  sendEmail  from '../utils/sendEmail.js';
// Create new user
const createUser = async (req, res) => {
    try {
        const { password, ...otherFields } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new user({
            ...otherFields,
            password: hashedPassword,
            profileImage: req.file?.filename, // save uploaded image filename
        });
        const savedEmployee = await user.save();

//       sendEmail(
//             user.email,
//             'Welcome to Our Library',
//             `Hello ${user.name},
//             Welcome to our library! We are glad to have you on board.
//             Your login credentials are as follows:
//             Email: ${user.email}
//             Password: ${req.body.password}
            
//             Please make sure to change your password after logging in for the first time.
            
//             Thank you,
//             Admin`
//         );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: savedUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
        });
    }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await users.find();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// Get users by ID
const getUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await users.findById(id);
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "users not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Update user (including role changes for admins)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.password; // prevent password change directly

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export {
  createUser,
  getUsers,
  getUsersById,
  deleteUser,
  updateUser
};
