import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signToken({ id: admin._id });

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      lastLoginAt: admin.lastLoginAt,
    },
  };
};

