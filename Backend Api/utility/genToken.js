import jwt from "jsonwebtoken";

export const genToken = (id, role, college) => {
  return jwt.sign(
    {
      id,
      role,
      college,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};