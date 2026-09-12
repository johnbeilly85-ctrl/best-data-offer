const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const SHORTCODE = "174379";
const PASSKEY = "bfb279f9aa9bdbcf158e97dd9feeb4bdfb9cd273b7e6f2c5b5d4f6f7f5f1e6c";
const CALLBACK_URL = "https://best-data-offer-4.onrender.com/callback";

async function stkPush(phone, amount) {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  const token = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString("base64");

  return axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: "BestDataOffer",
      TransactionDesc: "Data Purchase"
    },
    {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`
      }
    }
  );
}

app.post("/ussd", async (req, res) => {
  const text = req.body.text || "";
  const phone = req.body.phoneNumber;

  if (text === "") {
    return res.send(`CON Welcome to Best Data Offer
1. Buy Data`);
  }

  if (text === "1") {
    return res.send(`CON Select Package
1. KSh100 - 45GB
2. KSh250 - 100GB
3. KSh500 - 1000GB`);
  }

  if (text === "1*1") {
    await stkPush(phone, 100);
    return res.send("END M-Pesa payment request sent for KSh100.");
  }

  if (text === "1*2") {
    await stkPush(phone, 250);
    return res.send("END M-Pesa payment request sent for KSh250.");
  }

  if (text === "1*3") {
    await stkPush(phone, 500);
    return res.send("END M-Pesa payment request sent for KSh500.");
  }

  res.send("END Invalid option");
});

app.post("/callback", (req, res) => {
  console.log(req.body);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

app.listen(process.env.PORT || 3000);
