const express = require("express");
const app = express();
const port = 3000;
const { Worker } = require("worker_threads");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const THREAD_COUNT = 8;

app.get("/non-blocking/", (_req, res) => {
  res.status(200).send("This is non-blocking response.");
});

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on("message", (result) => {
      resolve(result);
    });
    worker.on("error", (err) => {
      reject(`An error occured ${err}`);
    });
  });
}

app.get("/blocking/", async (_req, res) => {
  // Simulate a blocking operation
  const workerPromise = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromise.push(createWorker());
  }
  const thread_results = await Promise.all(workerPromise);
  const total = thread_results.reduce((acc, val) => acc + val, 0);
  res.status(200).send(`Total count is ${total}`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
