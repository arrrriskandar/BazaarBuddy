import cartModel from "../models/cartModel.js";

export const addToCart = async (cartData) => {
  const { user, product, quantity, seller } = cartData;

  let cart = await cartModel.findOne({ user: user, seller: seller });

  if (!cart) {
    console.log("Hi");
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
      cart.items.push({ product: product, quantity });
    }
  }
  return await cart.save();
};

export const getCart = async (id) => {
  return await cartModel.findById(id).populate("product");
};

export const getCarts = async (userId) => {
  const sortOptions = { updatedAt: -1 };
  return await cartModel.find({ userId }).populate("product").sort(sortOptions);
};

export const updateCartItemQuantity = async (id, product, quantity) => {
  cartData.updatedAt = Date.now();
  return await cartModel.findByIdAndUpdate(id, cartData, { new: true });
};

export const removeCartItem = async (id) => {};

export const deleteCart = async (id) => {
  return await cartModel.findByIdAndDelete(id);
};
