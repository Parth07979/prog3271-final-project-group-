// This line loads environment variables from .env file
// Example: PORT, JWT_SECRET
import "dotenv/config";

// Import the main app (Express app)
import app from "./app/app";

// Get PORT value from .env file
// If PORT is not set, use 3000 as default
const PORT = Number(process.env.PORT || 3000);

// Start the server on the given port
app.listen(PORT, () => {
  // This message prints in terminal when server starts
  console.log(`Server started on port ${PORT}`);
});