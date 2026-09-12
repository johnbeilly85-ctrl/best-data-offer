const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// M-Pesa credentials from Render Environment Variables
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Home page
app.get("/", (req, res) => {
  res.send("Best Data Offer is running");
});

// Get M-Pesa access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  return response.data.access_token;
}

// Send STK Push
async function sendStkPush(phone, amount) {
  const token = await getAccessToken();

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    `${SHORTCODE}${PASSKEY}${timestamp}`
  ).toString("base64");

  // Convert 07XXXXXXXX to 2547XXXXXXXX
  let phoneNumber = phone.replace(/\s+/g, "");

  if (phoneNumber.startsWith("0")) {
    phoneNumber = "254" + phoneNumber.substring(1);
  }

  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.substring(1);
  }

  const stkData = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: "Best Data Offer",
    TransactionDesc: `Data package Ksh ${amount}`
  };

  const response = await axios.post(
    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    stkData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

// USSD
app.post("/ussd", async (req, res) => {
  const sessionId = req.body.sessionId || "";
  const serviceCode = req.body.serviceCode || "";
  const phoneNumber = req.body.phoneNumber || "";
  const text = req.body.text || "";

  console.log("USSD request:", {
    sessionId,
    serviceCode,
    phoneNumber,
    text
  });

  // First menu
  if (text === "") {
    return res.send(
      `CON Welcome to Best Data Offer
1. Buy Data
2. Exit`
    );
  }

  // Buy Data menu
  if (text === "1") {
    return res.send(
      `CON Select Data Package
1. Ksh 100 - 25GB Not Expiring
2. Ksh 250 - 85GB Not Expiring
3. Ksh 500 - 200GB Not Expiring`
    );
  }

  // Ksh 100 package
  if (text === "1*1") {
    try {
      await sendStkPush(phoneNumber, 100);

      return res.send(
        `END M-Pesa payment request sent to ${phoneNumber}.
Please check your phone and enter your M-Pesa PIN to pay Ksh 100 for 25GB Not Expiring.`
      );
    } catch (error) {
      console.error(
        "STK Push Error:",
        error.response?.data || error.message
      );

      return res.send(
        `END We could not send the M-Pesa payment request. Please try again later.`
      );
    }
  }

  // Ksh 250 package
  if (text === "1*2") {
    try {
      await sendStkPush(phoneNumber, 250);

      return res.send(
        `END M-Pesa payment request sent to ${phoneNumber}.
Please check your phone and enter your M-Pesa PIN to pay Ksh 250 for 85GB Not Expiring.`
      );
    } catch (error) {
      console.error(
        "STK Push Error:",
        error.response?.data || error.message
      );

      return res.send(
        `END We could not send the M-Pesa payment request. Please try again later.`
      );
    }
  }

  // Ksh 500 package
  if (text === "1*3") {
    try {
      await sendStkPush(phoneNumber, 500);

      return res.send(
        `END M-Pesa payment request sent to ${phoneNumber}.
Please check your phone and enter your M-Pesa PIN to pay Ksh 500 for 200GB Not Expiring.`
      );
    } catch (error) {
      console.error(
        "STK Push Error:",
        error.response?.data || error.message
      );

      return res.send(
        `END We could not send the M-Pesa payment request. Please try again later.`
      );
    }
  }

  // Exit
  if (text === "2") {
    return res.send("END Thank you for using Best Data Offer.");
  }

  return res.send("END Invalid option. Please try again.");
});

// M-Pesa callback
app.post("/mpesa/callback", (req, res) => {
  console.log("M-Pesa Callback:", JSON.stringify(req.body, null, 2));

  res.json({
    ResultCode: 0,
    ResultDesc: "Accepted"
  });
});

app.listen(PORT, () => {
  console.log(`Best Data Offer running on port ${PORT}`);
});
