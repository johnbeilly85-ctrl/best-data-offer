const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
  const text = req.body.text || "";

  if (text === "") {
    res.send(`CON Welcome to Best Data Offer
1. Buy Data Bundle
2. Check Balance
3. Customer Support`);
  } else {
    res.send("END Thank you.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`USSD app running on port ${PORT}`);
});
