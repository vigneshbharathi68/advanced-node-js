const express = require("express");
const app = express();
const port = 3000;
const { Worker } = require("worker_threads");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/non-blocking/", (_req, res) => {
  res.status(200).send("This is non-blocking response.");
});

app.get("/blocking/", (_req, res) => {
  // Simulate a blocking operation
  const worker = new Worker("./multithread-worker/worker.js");
  worker.on("message", (result) => {
    res
      .status(200)
      .send(`This is non-blocking response. Counter value: ${result}`);
  });

  worker.on("error", (err) => {
    res.status(500).send(`Worker error: ${err}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
