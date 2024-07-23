const http = require("node:http");

http
  // biome-ignore lint/complexity/useArrowFunction: <explanation>
  .createServer(function (req, res) {
    res.write("On the way to being a full stack engineer!");
    res.end();
  })
  .listen(3000);

console.log("Server started on port 3000!");
