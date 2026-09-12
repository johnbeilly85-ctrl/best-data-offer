const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Best Data Offer is running");
});

app.post("/ussd", (req, res) => {
  const text = req.body.text || "";

  if (text === "") {
    return res.send(`CON Welcome to Best Data Offer
1. Buy Data`);
  }

  if (text === "1") {
    return res.send(`END Choose your package:
Ksh 100 - 45GB
Ksh 250 - 100GB
Ksh 500 - 1000GB`);
  }

  res.send("END Invalid option");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`USSD app running on port ${PORT}`));
