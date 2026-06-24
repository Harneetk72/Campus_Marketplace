import { Auth } from "../Model/Auth.schema.js";
import { genToken } from "../../utility/genToken.js";
import { College } from "../Model/collegeSchema.js";
export const signup = async (req, res, next) => {
  try {
    const { userName, email, password, college } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const isUserExist = await Auth.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "Email is already exist",
      });
    }
    const user = await Auth.create({
      userName,
      email,
      password,
      college,
      isVerified: false,
      role: "user",
    });

    const token = genToken(
      user._id,
      user.role,
      user.college ? user.college : null,
    );

    return res.status(201).json({
      id: user._id,
      token,
      message: "User Registered Successfully",
    });
  } catch (err) {
    console.log();
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "password is incorrect",
      });
    }

    //  check isverified
    if (user.isVerified === false) {
      return res.status(400).json({
        message: "You can sign in once the admin has verified you.",
      });
    }

    const token = await genToken(
      user._id,
      user.role,
      user.college ? user.college : null,
    );

    if (!token) {
      return res.status(400).json({
        message: "Token is not found",
      });
    }
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "signin successfully",
        token,
        id: user._id,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingAdmin = await Auth.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const admin = await Auth.create({
      userName,
      email,
      password : "Admin@123",
      role: "admin",
      isVerified: true,
      college: null,
    });

    res.status(201).json({
      message: "Admin created",
      admin,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
//  get all user for admin:
export const getAllusers = async (req, res, next) => {
  try {
    const college = await College.findOne({ admin: req.user.id });
    const users = await Auth.find({
      role: "user",
      college: college._id,
    })
      .populate("college", "collegeName")
      .select("-password");
    if (!users || users.length === 0) {
      return res.status(400).json({
        message: "No Users Found",
      });
    }
    return res.status(200).json({
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  update user isVerified true by admin:
export const isVerifiedUser = async (req, res, next) => {
  try {
    const updated_user = await Auth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isVerified: true,
        },
      },
      {
        new: true,
      },
    );

    if (!updated_user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User verified successfully",
      data: updated_user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id)
      .populate("college", "collegeName")
      .select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Signout successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id).populate("college");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Auth.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const getPendingUsers = async (req, res) => {
  try {
    const college = await College.findOne({
      admin: req.user.id,
    });

    if (!college) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    const users = await Auth.find({
      college: college._id,
      role: "user",
      isVerified: false,
    })
      .populate("college", "collegeName")
      .select("-password");

    return res.status(200).json({
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    console.log("ADMIN ID:", req.user.id);

    const college = await College.findOne({
      admin: req.user.id,
    });

    console.log("COLLEGE:", college);

    if (!college) {
      return res.status(200).json({
        collegeCreated: false,
      });
    }

    const totalUsers = await Auth.countDocuments({
      college: college._id,
      role: "user",
    });

    const verifiedUsers = await Auth.countDocuments({
      college: college._id,
      role: "user",
      isVerified: true,
    });

    const pendingUsers = await Auth.countDocuments({
      college: college._id,
      role: "user",
      isVerified: false,
    });

    return res.status(200).json({
      totalUsers,
      verifiedUsers,
      pendingUsers,
      college,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
//  get user of particular college for admin:

//  delete user by admin:
