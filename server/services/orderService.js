import OrderModel from "../models/orderModel.js";

export const createOrder = async (orderData) => {
  const order = new OrderModel(orderData);
  return await order.save();
};

export const getOrder = async (id) => {
  return await OrderModel.findById(id);
};

export const getOrders = async (queryParams) => {
  const { user, seller } = queryParams;
  console.log(seller);
  const sortOptions = { updatedAt: -1 };

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
    .sort(sortOptions);
};

export const updateOrder = async (id, orderData) => {
  return await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
};

export const deleteOrder = async (id) => {
  return await OrderModel.findByIdAndDelete(id);
};
