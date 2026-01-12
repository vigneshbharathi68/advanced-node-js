const express = require("express") ;
const port = 3000;
const app = express();


app.get("/heavy", (_req, res) => {
  // Simulate a heavy computation
  let total = 0;
  for (let i = 0; i < 50_000_000; i++) {
    total++;
  }

  res.send(`The result of the CPU-intensive task is ${total}`);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`worker pid: ${process.pid}`);
})