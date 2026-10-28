import app from "./app.js";
import { connectToDb } from "./src/db/connect.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error(
    "PORT is not set. Make sure --env-file=.env is used locally.",
  );
}

const startServer = async () => {
  try {
    await connectToDb();
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
