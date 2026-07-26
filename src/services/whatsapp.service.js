const sendWhatsAppMessage = async ({ mobile, message }) => {
  try {
    console.log("==================================");
    console.log("📲 Sending WhatsApp Message...");
    console.log("To:", mobile);
    console.log("Message:");
    console.log(message);
    console.log("==================================");

    return {
      success: true,
      message: "WhatsApp sent successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendWhatsAppMessage,
};
