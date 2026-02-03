const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://rhodanfritz_db_user:ZDHlDjrLhe6w5BbY@newscluster.hrbndjt.mongodb.net/newsdb?retryWrites=true&w=majority",
  )
  .then(() => {
    console.log("CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exit(1);
  });
