import OrderModel from "../models/orderModel.js";
import { createNotification } from "./notificationService.js";

export const createOrder = async (orderData) => {
  console.log(orderData);
  const { notificationMessage, seller } = orderData;
  try {
    const order = await OrderModel.create(orderData);
    console.log(notificationMessage);

    await createNotification({
      userId: seller,
      message: notificationMessage,
    });

    return order;
  } catch (error) {
    console.error("Error creating order and notification:", error);
    throw new Error("Failed to create order and notification");
  }
};

export const getOrder = async (id) => {
  return await OrderModel.findById(id)
    .populate({
      path: "items.product",
      model: "ProductModel",
    })
    .populate({
      path: "seller",
      model: "UserModel",
    })
    .populate({
      path: "user",
      model: "UserModel",
    });
};

export const getOrders = async (queryParams) => {
  const { user, seller } = queryParams;
  const sortOptions = { orderDate: -1 };

  const filter = {};
  if (user) {
    filter.user = user;
  }
  if (seller) {
    filter.seller = seller;
  }
  return await OrderModel.find(filter)
    .populate({
      path: "items.product",
      model: "ProductModel",
    })
    .populate({
      path: "seller",
      model: "UserModel",
    })
    .populate({
      path: "user",
      model: "UserModel",
    })
    .sort(sortOptions);
};

export const updateOrder = async (id, orderData) => {
  const { notificationMessage, notifyBuyer } = orderData;
  try {
    const order = await OrderModel.findByIdAndUpdate(id, orderData, {
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

export const deleteOrder = async (id) => {
  return await OrderModel.findByIdAndDelete(id);
};
