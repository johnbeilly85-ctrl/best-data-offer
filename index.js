const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 10000;

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE || "174379";
const PASSKEY = process.env.PASSKEY;
const CALLBACK_URL = process.env.CALLBACK_URL;

function getTimestamp() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    String(d.getSeconds()).padStart(2, "0");
}

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
}

async function sendSTKPush(phoneNumber, amount) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(
    BUSINESS_SHORT_CODE + PASSKEY + timestamp
  ).toString("base64");

  const phone = phoneNumber.replace("+", "");

  const stkPushData = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: BUSINESS_SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: "Best Data Offer",
    TransactionDesc: "Data Bundle Purchase",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("========== STK PUSH SUCCESS ==========");
    console.log(response.data);
    console.log("======================================");

    return true;
  } catch (error) {
    console.log("========== STK PUSH ERROR ==========");
    console.log("HTTP Status:", error.response?.status);
    console.log("Response Data:", error.response?.data);
    console.log("Message:", error.message);

    if (error.response?.config?.data) {
      console.log("Request Body Sent:");
      console.log(error.response.config.data);
    }

    console.log("====================================");

    return false;
  }
}

app.post("/ussd", async (req, res) => {
  console.log("USSD request:", req.body);

  const { text, phoneNumber } = req.body;

  let response = "";

  if (text === "") {
    response = `CON Welcome to Best Data Offer
1. Buy Data Bundle
2. Check Balance
3. Customer Support`;
  } else if (text === "1") {
    response = `CON Select Bundle
1. Ksh 100 - 25GB (No Expiry)
2. Ksh 250 - 85GB (No Expiry)
3. Ksh 500 - 200GB (No Expiry)`;
  } else if (text === "1*1") {
    const sent = await sendSTKPush(phoneNumber, 100);
    response = sent
      ? "END M-Pesa prompt sent. Check your phone."
      : "END Could not send M-Pesa payment request.";
  } else if (text === "1*2") {
    const sent = await sendSTKPush(phoneNumber, 250);
    response = sent
      ? "END M-Pesa prompt sent. Check your phone."
      : "END Could not send M-Pesa payment request.";
  } else if (text === "1*3") {
    const sent = await sendSTKPush(phoneNumber, 500);
    response = sent
      ? "END M-Pesa prompt sent. Check your phone."
      : "END Could not send M-Pesa payment request.";
  } else if (text === "2") {
    response = "END Balance feature coming soon.";
  } else if (text === "3") {
    response = "END Contact Support: +254729029717";
  } else {
    response = "END Invalid option.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.post("/callback", (req, res) => {
  console.log("========== M-PESA CALLBACK ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("=====================================");

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

app.listen(PORT, () => {
  console.log(`Best Data Offer running on port ${PORT}`);
});
