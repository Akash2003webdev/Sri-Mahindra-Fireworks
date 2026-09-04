import { restaurantInfo } from "./data";

export function buildOrderMessage({ cartItems, orderType, tableNumber, mapLocation, address, name, phone }) {
  const lines = [];
  lines.push(`*New Order — ${restaurantInfo.name}*`);
  lines.push(`Order Type: ${orderType}`);
  if (orderType === "Home Delivery" && address) lines.push(`Address: ${address}`);
  if (mapLocation) lines.push(`📍 Location Pin: ${mapLocation}`);
  lines.push("");
  lines.push("*Items:*");
  cartItems.forEach((item) => {
    const variantLabel = item.variantName ? ` (${item.variantName})` : "";
    lines.push(`• ${item.name}${variantLabel} x${item.quantity} — ₹${item.price * item.quantity}`);
    if (item.comboItems?.length) {
      const combo = item.comboItems
        .map((p) => (p.quantity > 1 ? `${p.name} x${p.quantity}` : p.name))
        .join(", ");
      lines.push(`   ↳ Combo includes: ${combo}`);
    }
  });
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  lines.push("");
  lines.push(`*Total: ₹${total}*`);
  lines.push("");
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  return lines.join("\n");
}

export function buildEnquiryMessage({ name, phone, enquiryType, message }) {
  const lines = [];
  lines.push(`*New Enquiry — ${restaurantInfo.name}*`);
  lines.push(`Type: ${enquiryType}`);
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  lines.push("");
  lines.push(message);
  return lines.join("\n");
}

export function sendWhatsAppMessage(message) {
  const url = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}