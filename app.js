const addDays = require("date-fns/addDays");
const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "todoApplication.db");

const app = express();
let db = null;

const DBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

DBServer();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const { priority } = request.query;
  const { due_date } = request.query;
  if (status) {
    const getQuery = `
    SELECT * FROM todo WHERE status LIKE "TO DO"`;
    try {
      response.status(200);
      const result = await db.all(getQuery);
      response.send(result);
    } catch {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority) {
    const getQuery = `
    SELECT * FROM todo WHERE priority LIKE "HIGH"`;
    try {
      response.status(200);
      const result = await db.all(getQuery);
      response.send(result);
    } catch {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (priority && status) {
    const getQuery = `
    SELECT * FROM todo WHERE (status LIKE "IN PROGRESS" AND priority LIKE "HIGH")`;
    const result = await db.all(getQuery);
    response.send(result);
  }
});
