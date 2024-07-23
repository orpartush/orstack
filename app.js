const http = require("node:http");

//sqlite3
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
		CREATE TABLE visitors (
			count INTEGER
			time TEXT
		)	
	`);
});

let numClients = 0;
const insertDoc = () => {
  ++numClients;
  db.run(`
		INSERT INTO visitors (count time)
		VALUES (${numClients}) datetime('now')
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
  Server.close(() => {
    shutdownDB();
  });
});

http
  // biome-ignore lint/complexity/useArrowFunction: <explanation>
  .createServer(function (req, res) {
    res.write("On the way to being a full stack engineer!");
    console.log("insering doc");
    insertDoc();
    res.end();
  })
  .listen(3000);

console.log("Server started on port 3000!");
