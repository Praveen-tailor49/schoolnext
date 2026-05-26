require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 5000;

const startServer = async () => {

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

