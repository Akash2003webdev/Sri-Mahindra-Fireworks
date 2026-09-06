// Shared order-status metadata used by both the Admin panel (to change an
// order's status) and the customer-facing Track Order page (to display it).

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "completed",
  "cancelled",
];

// `orderType` ("Home Delivery" | "Store Pickup") only changes the label for
// the "out_for_delivery" step — everything else reads the same either way.
export function getStatusMeta(status, orderType) {
  const isPickup = orderType === "Store Pickup";
  const meta = {
    pending: { label: "Order Received", color: "amber" },
    confirmed: { label: "Confirmed", color: "blue" },
    packed: { label: "Packed", color: "indigo" },
    out_for_delivery: {
      label: isPickup ? "Ready for Pickup" : "Out for Delivery",
      color: "purple",
    },
    completed: { label: isPickup ? "Picked Up" : "Delivered", color: "green" },
    cancelled: { label: "Cancelled", color: "red" },
  };
  return meta[status] || meta.pending;
}

// Ordered steps shown in the tracking stepper (cancelled is excluded — it
// gets its own banner instead of a step).
export const STATUS_STEPS = ["pending", "confirmed", "packed", "out_for_delivery", "completed"];
