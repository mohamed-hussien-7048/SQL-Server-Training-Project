const sql = require("mssql/msnodesqlv8");

const config = {
    server: "localhost",
    database: "PeopleAccounts",
    driver: "ODBC Driver 18 for SQL Server",
    options: { trustedConnection: true, trustServerCertificate: true }
};

async function connectDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to SQL Server successfully.");
        return pool;
    } catch (error) { console.error("Database connection failed:", error.message); throw error;
          }
}

module.exports = { sql, connectDatabase };