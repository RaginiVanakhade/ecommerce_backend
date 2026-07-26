const { sendWhatsAppMessage } = require("./whatsapp.service");

const sendOrdersNotification = async ({ user, order, product, type }) => {
  let message = "";

  switch (type) {
    case "ORDER_PLACED":
      message = "🎉 Your order has been placed successfully.";
      break;

    case "ORDER_CONFIRMED":
      message = "✅ Your order has been confirmed.";
      break;

    case "ORDER_PACKED":
      message = "📦 Your order has been packed.";
      break;

    case "ORDER_SHIPPED":
      message = "🚚 Your order has been shipped.";
      break;

    case "ORDER_DELIVERED":
      message = "🎉 Your order has been delivered.";
      break;

    case "ORDER_CANCELLED":
      message = "❌ Your order has been cancelled.";
      break;

    case "ORDER_PENDING":
      message = "Your order has been placed successfully.";
      break;

    default:
      message = "Your order has been updated.";
  }

  const finalMessage = `
Hello ${user.name} 👋

${message}

Order Id : ${order._id}

Product : ${product.name}

Quantity : ${order.quantity}

Total : ₹${order.totalAmount}

Status : ${order.status}

Thank you ❤️
`;

  await sendWhatsAppMessage({
    mobile: user.mobile,
    message: finalMessage,
  });
};

module.exports = {
  sendOrdersNotification,
};
