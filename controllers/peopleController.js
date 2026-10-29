
const { sql } = require("../config/db");

let pool;

function setDatabasePool(databasePool) {
    pool = databasePool;
}

async function getPeople(req, res) {
    try {
        const result = await pool.request().query(
            "SELECT Id, Name, Balance FROM dbo.People ORDER BY Id"
        );

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve people." });
    }
}

async function createPerson(req, res) {
    const { name, balance = 0 } = req.body;

    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Name is required." });
    }

    if (typeof balance !== "number" || !Number.isFinite(balance)) {
        return res.status(400).json({ error: "Balance must be a number." });
    }

    try {
        const result = await pool.request()
            .input("name", sql.NVarChar(100), name.trim())
            .input("balance", sql.Decimal(18, 2), balance)
            .query(`
                INSERT INTO dbo.People (Name, Balance)
                OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Balance
                VALUES (@name, @balance)
            `);

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create person." });
    }
}

async function updatePerson(req, res) {
    const id = Number(req.params.id);
    const { name, balance } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid person ID." });
    }

    if (
        (name !== undefined &&
            (typeof name !== "string" || !name.trim())) ||
        (balance !== undefined &&
            (typeof balance !== "number" || !Number.isFinite(balance))) ||
        (name === undefined && balance === undefined)
    ) {
        return res.status(400).json({
            error: "Provide a valid name or balance."
        });
    }

    try {
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar(100), name?.trim() ?? null)
            .input("balance", sql.Decimal(18, 2), balance ?? null)
            .query(`
                UPDATE dbo.People
                SET
                    Name = COALESCE(@name, Name),
                    Balance = COALESCE(@balance, Balance)
                OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Balance
                WHERE Id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Person not found." });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update person." });
    }
}

async function deletePerson(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid person ID." });
    }

    try {
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM dbo.People
                OUTPUT DELETED.Id, DELETED.Name, DELETED.Balance
                WHERE Id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Person not found." });
        }

        res.json({
            message: "Person deleted successfully.",
            person: result.recordset[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete person." });
    }
}

module.exports = {
    setDatabasePool,
    getPeople,
    createPerson,
    updatePerson,
    deletePerson
};
