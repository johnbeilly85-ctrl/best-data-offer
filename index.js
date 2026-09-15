const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/ussd", (req, res) => {
  const text = req.body.text || "";
  let response = "";

  if (text === "") {
    response = `CON Welcome to Amazing Data

1. Buy Data Bundle
2. Check Balance
3. Customer Support`;

  } else if (text === "1") {
    response = `CON Choose Data Bundle

1. Ksh 100 - 45GB (No Expiry)
2. Ksh 250 - 100GB (No Expiry)
3. Ksh 500 - 1000GB (No Expiry)`;

  } else if (text === "1*1") {
    response = `END Pay Ksh 100 to Till 1714273
Business: Amazing Data

45GB No Expiry

After payment, dial *384*43004# again to check your balance.`;

  } else if (text === "1*2") {
    response = `END Pay Ksh 250 to Till 1714273
Business: Amazing Data

100GB No Expiry

After payment, dial *384*43004# again to check your balance.`;

  } else if (text === "1*3") {
    response = `END Pay Ksh 500 to Till 1714273
Business: Amazing Data

1000GB No Expiry

After payment, dial *384*43004# again to check your balance.`;

  } else if (text === "2") {
    response = `END Balance feature coming soon.`;

  } else if (text === "3") {
    response = `END Customer Support

WhatsApp: +254750536849`;

  } else {
    response = `END Invalid choice. Please try again.`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.get("/", (req, res) => {
  res.send("Amazing Data USSD Server is Running.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Amazing Data USSD Server running on port ${PORT}`);
});
