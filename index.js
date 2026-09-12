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
    return res.send(`CON Choose your package:
1. Ksh 100 - 45GB
2. Ksh 250 - 100GB
3. Ksh 500 - 1000GB`);
  }

  if (text === "1*1") {
    return res.send("END You selected Ksh 100 - 45GB. M-Pesa payment will be requested.");
  }

  if (text === "1*2") {
    return res.send("END You selected Ksh 250 - 100GB. M-Pesa payment will be requested.");
  }

  if (text === "1*3") {
    return res.send("END You selected Ksh 500 - 1000GB. M-Pesa payment will be requested.");
  }

  res.send("END Invalid option");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`USSD app running on port ${PORT}`));
