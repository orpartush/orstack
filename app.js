const express = require("express");
const http = require("node:http");
const app = express();
const server = http.createServer(app);
const PORT = 3000;
//sqlite3
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
		CREATE TABLE visitors (
			count INTEGER,
			time TEXT
		)	
	`);
});

let numClients = 0;
const insertDoc = () => {
  ++numClients;
  db.run(`
		INSERT INTO visitors (count, time)
		VALUES (${numClients}, datetime('now'))
	`);
};

function getCounts() {
  db.each(
    `
		SELECT * FROM visitors
	`,
    (err, row) => {
      console.log("row:", row);
    }
  );
}

function shutdownDB() {
  getCounts();
  console.log("shutting down db");
  db.close();
}

process.on("SIGINT", () => {
  console.log("sigint");
  server.close(() => {
    shutdownDB();
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log("inserting doc!");
  insertDoc();
});
