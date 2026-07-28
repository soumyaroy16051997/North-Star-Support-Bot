export interface Order {
  orderNumber: string;
  status: string;
  statusDetail: string;
  isDelivered: boolean;
}

export const ORDERS: Record<string, Order> = {
  "111": {
    orderNumber: "111",
    status: "Shipped",
    statusDetail: "Shipped, arriving tomorrow",
    isDelivered: false,
  },
  "222": {
    orderNumber: "222",
    status: "Processing",
    statusDetail: "Processing, ships in 24 hours",
    isDelivered: false,
  },
  "333": {
    orderNumber: "333",
    status: "Delivered",
    statusDetail: "Delivered",
    isDelivered: true,
  },
};

export function lookupOrder(input: string): Order | null {
  // Strip leading # or whitespace
  const normalized = input.trim().replace(/^#/, "");
  return ORDERS[normalized] ?? null;
}
