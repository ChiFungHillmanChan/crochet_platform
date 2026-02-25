export function buildOrderConfirmationEmail(order) {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3; text-align: right;">£${(item.price / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const total = `£${(order.totalAmount / 100).toFixed(2)}`;

  return {
    subject: `Cosy Loops — Order Confirmed #${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Inter', -apple-system, sans-serif; background: #FFF9FA; color: #5D4037; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 40px; border: 1px solid #F0E6E3;">
    <h1 style="font-family: 'Quicksand', sans-serif; color: #5D4037; font-size: 1.5rem; margin-bottom: 8px;">
      Order Confirmed! 🧶
    </h1>
    <p style="color: #8D7B6A; font-size: 0.95rem;">
      Thank you for your order, ${order.customerName}!
    </p>

    <div style="background: #FFF5F5; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <p style="color: #8D7B6A; font-size: 0.85rem; margin-bottom: 8px;">Order Number</p>
      <p style="color: #5D4037; font-size: 1.2rem; font-weight: 700; margin: 0;">#${order.orderNumber}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #F8C8DC;">
          <th style="padding: 12px; text-align: left; color: #8D7B6A; font-size: 0.85rem;">Item</th>
          <th style="padding: 12px; text-align: center; color: #8D7B6A; font-size: 0.85rem;">Qty</th>
          <th style="padding: 12px; text-align: right; color: #8D7B6A; font-size: 0.85rem;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 16px 12px; font-weight: 700; color: #5D4037;">Total</td>
          <td style="padding: 16px 12px; text-align: right; font-weight: 700; color: #F8C8DC; font-size: 1.1rem;">${total}</td>
        </tr>
      </tfoot>
    </table>

    <p style="color: #8D7B6A; font-size: 0.9rem; line-height: 1.8;">
      We'll start crafting your order with love. You'll receive a shipping notification once it's on its way!
    </p>

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F0E6E3;">
      <p style="color: #8D7B6A; font-size: 0.8rem; margin: 0;">
        Cosy Loops — Handmade with love in the UK 🇬🇧
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `Order Confirmed! #${order.orderNumber}\n\nThank you, ${order.customerName}!\n\nTotal: ${total}\n\nWe'll start crafting your order with love.\n\n— Cosy Loops`,
  };
}

export function buildAdminNotificationEmail(order) {
  const total = `£${(order.totalAmount / 100).toFixed(2)}`;
  const itemList = order.items
    .map((item) => `- ${item.name} x${item.quantity}`)
    .join("\n");

  return {
    subject: `New Order #${order.orderNumber} — ${total}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
  <h2>New Order #${order.orderNumber}</h2>
  <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
  <p><strong>Total:</strong> ${total}</p>
  <p><strong>Items:</strong></p>
  <ul>${order.items.map((i) => `<li>${i.name} x${i.quantity} — £${(i.price / 100).toFixed(2)}</li>`).join("")}</ul>
</body>
</html>`,
    text: `New Order #${order.orderNumber}\nCustomer: ${order.customerName} (${order.customerEmail})\nTotal: ${total}\n\nItems:\n${itemList}`,
  };
}
