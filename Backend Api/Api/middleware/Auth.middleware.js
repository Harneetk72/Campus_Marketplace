import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Authorization header se token lena
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    console.log("TOKEN:", token);

    // Token nahi mila
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    // User data request me save
    req.user = {
      id: decoded.id,
      role: decoded.role,
      college: decoded.college,
    };

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

// CHECK ADMIN
export const isAdmin = (req, res, next) => {
  try {

    console.log(req.user, "ADMIN CHECK");

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied - Admin Only",
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CHECK USER
export const isUser = (req, res, next) => {
  try {

    console.log(req.user, "USER CHECK");

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access Denied - Users Only",
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
