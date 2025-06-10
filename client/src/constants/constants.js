export const BE_URL = process.env.REACT_APP_BE_URL;
export const apiEndpoint = `${BE_URL}/api`;

export const categories = [
  {
    value: "Food and Beverages",
    label: "Food and Beverages",
  },
  { value: "Fashion", label: "Fashion" },
  { value: "Beauty", label: "Beauty" },
  { value: "Home and Living", label: "Home and Living" },
  {
    value: "Sports and Wellness",
    label: "Sports and Wellness",
  },
  { value: "Electronics", label: "Electronics" },
  { value: "Others", label: "Others" },
];

export const stockOptions = [
  { value: "Available", label: "Available" },
  { value: "Out of Stock", label: "Out of Stock" },
];

export const getNotificationMessage = (type, { buyer, seller, orderId }) => {
  switch (type) {
    case "order_placed":
      return `New Order! ${buyer} has placed an order. Process it soon!`;
    case "order_shipped":
      return `Your order #${orderId} has been shipped by ${seller}.`;
    case "order_received":
      return `Order #${orderId} has been marked as received by ${buyer}.`;
    case "review_received":
      return `${buyer} has left a review on your product(s). Check it out!`;
    default:
      return "You have a new notification.";
  }
};
