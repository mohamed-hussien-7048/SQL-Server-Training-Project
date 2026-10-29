
const { connectDatabase } = require("./config/db");

async function main() {
    const pool = await connectDatabase();

    const result = await pool.request().query("SELECT DB_NAME() AS DatabaseName");

    console.log("Connected database:", result.recordset[0].DatabaseName);

    await pool.close();
}

main().catch(() => {
    process.exitCode = 1;
});

