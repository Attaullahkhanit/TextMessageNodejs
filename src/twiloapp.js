const express = require('express');
const twilio = require('twilio');
const users = require('./usersData');  // Import the user data
require('dotenv').config();
const cors = require('cors');  // Add CORS middleware

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Send SMS via Twilio to the users
app.post('/send-sms', async (req, res) => {
  const { message } = req.body;

  try {
    // Step 1: Extract phone numbers from users data
    const phoneNumbers = users.map(user => user.phone);

    // Step 2: Send SMS to each phone number
    const sendSMSPromises = phoneNumbers.map(phoneNumber =>
      client.messages.create({
        body: message || 'ye sirf testing purpose ke ley ha!!!',
        from: fromPhone,
        to: phoneNumber,
      })
    );

    // Wait for all messages to be sent
    const results = await Promise.all(sendSMSPromises);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
