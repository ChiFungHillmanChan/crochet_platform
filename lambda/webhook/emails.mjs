function sanitizeText(str) {
  if (!str) return "";
  return String(str).replace(/[\r\n\t]/g, " ").trim();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAddress(addr) {
  if (!addr) return null;
  const parts = [addr.line1, addr.line2, addr.city, addr.postcode, addr.country].filter(Boolean);
  return parts.join(", ");
}

export function buildOrderConfirmationEmail(order) {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3;">${escapeHtml(item.name)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #F0E6E3; text-align: right;">&pound;${(item.price / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const total = `&pound;${(order.totalAmount / 100).toFixed(2)}`;
  const addressStr = formatAddress(order.shippingAddress);

  const escapedAddress = escapeHtml(addressStr);
  const shippingBlock = escapedAddress
    ? `<div style="background: #FFF5F5; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="color: #8D7B6A; font-size: 0.85rem; margin-bottom: 4px;">Shipping To</p>
        <p style="color: #5D4037; margin: 0;">${escapedAddress}</p>
        ${order.customerPhone ? `<p style="color: #8D7B6A; font-size: 0.85rem; margin: 8px 0 0;">Phone: ${escapeHtml(order.customerPhone)}</p>` : ""}
      </div>`
    : "";

  const notesBlock = order.notes
    ? `<div style="background: #FFF5F5; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="color: #8D7B6A; font-size: 0.85rem; margin-bottom: 4px;">Order Notes</p>
        <p style="color: #5D4037; margin: 0;">${escapeHtml(order.notes)}</p>
      </div>`
    : "";

  return {
    subject: `Cosy Loops — Order Confirmed #${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Inter', -apple-system, sans-serif; background: #FFF9FA; color: #5D4037; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 40px; border: 1px solid #F0E6E3;">
    <h1 style="font-family: 'Quicksand', sans-serif; color: #5D4037; font-size: 1.5rem; margin-bottom: 8px;">
      Order Confirmed!
    </h1>
    <p style="color: #8D7B6A; font-size: 0.95rem;">
      Thank you for your order, ${escapeHtml(order.customerName)}!
    </p>

    <div style="background: #FFF5F5; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <p style="color: #8D7B6A; font-size: 0.85rem; margin-bottom: 8px;">Order Number</p>
      <p style="color: #5D4037; font-size: 1.2rem; font-weight: 700; margin: 0;">#${order.orderNumber}</p>
    </div>

    ${shippingBlock}

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

    ${notesBlock}

    <p style="color: #8D7B6A; font-size: 0.9rem; line-height: 1.8;">
      We'll start crafting your order with love. You'll receive a shipping notification once it's on its way!
    </p>

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F0E6E3;">
      <p style="color: #8D7B6A; font-size: 0.8rem; margin: 0;">
        Cosy Loops — Handmade with love in the UK
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `Order Confirmed! #${order.orderNumber}\n\nThank you, ${sanitizeText(order.customerName)}!\n\n${addressStr ? `Shipping to: ${sanitizeText(addressStr)}\n` : ""}${order.customerPhone ? `Phone: ${sanitizeText(order.customerPhone)}\n` : ""}\nTotal: ${total}\n\n${order.notes ? `Notes: ${sanitizeText(order.notes)}\n\n` : ""}We'll start crafting your order with love.\n\n— Cosy Loops`,
  };
}

export function buildAdminNotificationEmail(order) {
  const total = `&pound;${(order.totalAmount / 100).toFixed(2)}`;
  const addressStr = formatAddress(order.shippingAddress);
  const sourceLabel = order.source === "payment_link" ? "Payment Link" : "Checkout";

  const itemList = order.items
    .map((item) => `- ${escapeHtml(item.name)} x${item.quantity}`)
    .join("\n");

  const detailsRows = [
    `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Name</td><td style="padding: 8px 12px;">${escapeHtml(order.customerName)}</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Email</td><td style="padding: 8px 12px;">${escapeHtml(order.customerEmail)}</td></tr>`,
    order.customerPhone ? `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Phone</td><td style="padding: 8px 12px;">${escapeHtml(order.customerPhone)}</td></tr>` : "",
    addressStr ? `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Address</td><td style="padding: 8px 12px;">${escapeHtml(addressStr)}</td></tr>` : "",
    order.notes ? `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Notes</td><td style="padding: 8px 12px;">${escapeHtml(order.notes)}</td></tr>` : "",
    `<tr><td style="padding: 8px 12px; color: #8D7B6A; font-weight: 600;">Source</td><td style="padding: 8px 12px;">${sourceLabel}</td></tr>`,
  ].filter(Boolean).join("");

  return {
    subject: `New Order #${order.orderNumber} — ${total} [${sourceLabel}]`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
  <h2>New Order #${order.orderNumber}</h2>
  <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
    ${detailsRows}
  </table>
  <p><strong>Total:</strong> ${total}</p>
  <p><strong>Items:</strong></p>
  <ul>${order.items.map((i) => `<li>${escapeHtml(i.name)} x${i.quantity} — &pound;${(i.price / 100).toFixed(2)}</li>`).join("")}</ul>
</body>
</html>`,
    text: `New Order #${order.orderNumber} [${sourceLabel}]\nCustomer: ${sanitizeText(order.customerName)} (${sanitizeText(order.customerEmail)})\n${order.customerPhone ? `Phone: ${sanitizeText(order.customerPhone)}\n` : ""}${addressStr ? `Address: ${sanitizeText(addressStr)}\n` : ""}${order.notes ? `Notes: ${sanitizeText(order.notes)}\n` : ""}Total: ${total}\n\nItems:\n${itemList}`,
  };
}

export function buildShippingNotificationEmail(order, trackingNumber, carrier) {
  const e = escapeHtml;
  const subject = `Your Cosy Loops order #${order.orderNumber || order.id.substring(0, 8)} has been shipped!`;

  const carrierLinks = {
    "royal-mail": `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNumber}`,
    "dpd": `https://www.dpd.co.uk/tracking/trackvia.do?parcelNumbers=${trackingNumber}`,
    "hermes": `https://www.evri.com/track/parcel/${trackingNumber}`,
  };
  const trackingUrl = carrierLinks[carrier] || "#";

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family: 'Inter', -apple-system, sans-serif; background: #FFF9FA; color: #5D4037; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 40px; border: 1px solid #F0E6E3;">
    <h1 style="font-family: 'Quicksand', sans-serif; color: #5D4037; font-size: 1.5rem; margin-bottom: 8px;">Your order is on its way!</h1>
    <p style="color: #8D7B6A;">Hi ${e(order.customerName)},</p>
    <p style="color: #8D7B6A;">Great news! Your order <strong>#${e(order.orderNumber || order.id.substring(0, 8))}</strong> has been shipped.</p>
    ${trackingNumber ? `
    <div style="background: #FFF5F5; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="color: #8D7B6A; font-size: 0.85rem; margin-bottom: 8px;">Tracking Number</p>
      <p style="color: #5D4037; font-size: 1.1rem; font-weight: 700; margin: 0;">${e(trackingNumber)}</p>
      <a href="${e(trackingUrl)}" style="display: inline-block; margin-top: 12px; padding: 10px 24px; background: #F8C8DC; color: #5D4037; text-decoration: none; border-radius: 24px; font-weight: bold;">Track Your Parcel</a>
    </div>` : ""}
    <p style="color: #8D7B6A;">Estimated delivery: 3-5 working days (UK).</p>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F0E6E3;">
      <p style="color: #8D7B6A; font-size: 0.8rem; margin: 0;">Cosy Loops — Handmade with love in the UK</p>
    </div>
  </div>
</body></html>`;

  const text = `Your order #${order.orderNumber || order.id.substring(0, 8)} has been shipped!\n\n`
    + (trackingNumber ? `Tracking: ${trackingNumber}\n` : "")
    + `Estimated delivery: 3-5 working days.\n\nThank you!\n— Cosy Loops`;

  return { subject, html, text };
}
