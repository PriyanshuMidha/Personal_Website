import "dotenv/config";
import connectDatabase from "../config/db.js";
import Admin from "../models/Admin.js";

const seedAdmin = async () => {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });

  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await Admin.create({
    name: "Portfolio Admin",
    email: email.toLowerCase(),
    password,
  });

  console.log(`Admin seeded successfully for ${email.toLowerCase()}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin", error);
  process.exit(1);
});
