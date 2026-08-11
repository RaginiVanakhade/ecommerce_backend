const client = require("../config/twilio");

const sendWhatsAppMessage = async ({ mobile, message }) => {
  console.log("Sending WhatsApp...");
  console.log("Mobile:", mobile);
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:+91${mobile}`,
    body: message,
  });
};

module.exports = {
  sendWhatsAppMessage,
};
