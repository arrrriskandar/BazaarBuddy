import cartModel from "../models/cartModel.js";

export const addToCart = async (cartData) => {
  const { user, product, quantity, seller } = cartData;

  let cart = await cartModel.findOne({ user, seller });

  if (!cart) {
    cart = new cartModel({
      user,
      seller,
      items: [
        {
          product,
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find((item) =>
      item.product.equals(product)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
  }
  return await cart.save();
};

export const getCart = async (cartId) => {
  return await cartModel.findById(cartId).populate({
    path: "items.product",
    model: "ProductModel",
  });
};

export const getCarts = async (user) => {
  const sortOptions = { updatedAt: -1 };
  return await cartModel
    .find({ user })
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

export const updateCartItemQuantity = async (cartId, cartData) => {
  const { product, quantity } = cartData;
  return await cartModel.findOneAndUpdate(
    { _id: cartId, "items.product": product },
    { $set: { "items.$.quantity": quantity } },
    { new: true }
  );
};

export const removeCartItem = async (cartId, cartData) => {
  const { product } = cartData;
  return await cartModel.findOneAndUpdate(
    { _id: cartId },
    {
      $pull: { items: { product } },
    },
    { new: true }
  );
};

export const deleteCart = async (cartId) => {
  return await cartModel.findByIdAndDelete(cartId);
};
