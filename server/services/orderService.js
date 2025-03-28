import OrderModel from "../models/orderModel.js";
import { createNotification } from "./notificationService.js";

export const createOrder = async (orderData) => {
  const { notificationMessage, seller } = orderData;
  try {
    const order = await OrderModel.create(orderData);

    const notification = await createNotification({
      userId: seller,
      message: notificationMessage,
      order,
    });

    return { order, notification };
  } catch (error) {
    console.error("Error creating order and notification:", error);
    throw new Error("Failed to create order and notification");
  }
};

export const getOrder = async (orderParams) => {
  const { orderId, userId } = orderParams;

  // Fetch order details without populating seller and user
  const order = await OrderModel.findById(orderId).populate({
    path: "items.product",
    model: "ProductModel",
  });

  // Determine which participant to populate
  const otherParticipantPath =
    order.seller.toString() !== userId ? "seller" : "user";

  // Populate the other participant
  await order.populate({
    path: otherParticipantPath,
    model: "UserModel",
  });

  return order;
};

export const getOrders = async (queryParams) => {
  const { user, seller } = queryParams;
  const sortOptions = { orderDate: -1 };

  if (user && seller) {
    throw new Error("You can only filter by either user or seller, not both.");
  }

  const filter = {};
  let populateOptions = [];

  if (user) {
    filter.user = user;
    populateOptions = [
      {
        path: "seller", // Populate seller if the user is provided
        model: "UserModel",
      },
    ];
  }
  if (seller) {
    filter.seller = seller;
    populateOptions = [
      {
        path: "user", // Populate user if the seller is provided
        model: "UserModel",
      },
    ];
  }
  return await OrderModel.find(filter)
    .populate({
      path: "items.product",
      model: "ProductModel",
    })
    .populate(populateOptions)
    .sort(sortOptions);
};

export const updateOrder = async (orderId, orderData) => {
  const { notificationMessage, notifyBuyer } = orderData;
  try {
    const order = await OrderModel.findByIdAndUpdate(orderId, orderData, {
      new: true,
    });

    const userId = notifyBuyer ? order.user : order.seller;

    await createNotification({
      userId,
      message: notificationMessage,
    });

    return order;
  } catch (error) {
    console.error("Error updating order and creating notification:", error);
    throw new Error("Failed to update order and create notification");
  }
};

export const deleteOrder = async (orderId) => {
  return await OrderModel.findByIdAndDelete(orderId);
};
