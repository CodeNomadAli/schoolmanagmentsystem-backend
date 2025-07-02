import jwt from "jsonwebtoken";

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.accessLevel },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
};

export default generateToken;
