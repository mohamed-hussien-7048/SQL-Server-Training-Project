const express = require("express");
const { connectDatabase } = require("./config/db");
const peopleController = require("./controllers/peopleController");
const peopleRoutes = require("./routes/peopleRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/people", peopleRoutes);

async function startServer() {
    const pool = await connectDatabase();

    peopleController.setDatabasePool(pool);

    app.listen(PORT, () => {
        console.log(`Server running at http://losscalhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exitCode = 1;
});