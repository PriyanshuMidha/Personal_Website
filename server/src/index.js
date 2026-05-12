import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the existing server process or change PORT in server/.env, then try again.`);
      process.exit(1);
    }

    console.error(`Failed to bind server on port ${port}: ${error.message}`);
    process.exit(1);
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error(`Database connection unavailable: ${error.message}`);
    console.error("API will respond with 503 until MongoDB becomes reachable.");
  }
};

startServer().catch((error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
