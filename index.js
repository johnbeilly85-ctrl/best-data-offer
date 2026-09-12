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
  } 
  else if (text === "1") {
    res.send(`CON Buy Data Bundle
1. Ksh 100 - 45GB (Not Expiring)
2. Ksh 250 - 100GB (Not Expiring)
3. Ksh 500 - 1000GB (Not Expiring)
0. Back`);
  } 
  else if (text === "1*1") {
    res.send("END You selected Ksh 100 - 45GB (Not Expiring).");
  } 
  else if (text === "1*2") {
    res.send("END You selected Ksh 250 - 100GB (Not Expiring).");
  } 
  else if (text === "1*3") {
    res.send("END You selected Ksh 500 - 1000GB (Not Expiring).");
  } 
  else if (text === "1*0") {
    res.send(`CON Welcome to Best Data Offer
1. Buy Data Bundle
2. Check Balance
3. Customer Support`);
  } 
  else {
    res.send("END Thank you.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`USSD app running on port ${PORT}`);
});
