import cartModel from "../models/cartModel.js";

export const addToCart = async (cartData) => {
  const { user, product, quantity, seller } = cartData;

  let cart = await cartModel.findOne({ user: user, seller: seller });

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
      cart.items.push({ product: product, quantity });
    }
  }
  return await cart.save();
};

export const getCart = async (id) => {
  return await cartModel.findById(id).populate({
    path: "items.product",
    model: "ProductModel",
  });
};

export const getCarts = async (user) => {
  const sortOptions = { updatedAt: -1 };
  return await cartModel
    .find({ user: user })
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

export const updateCartItemQuantity = async (id, product, quantity) => {
  return await cartModel.findOneAndUpdate(
    { _id: id, "items.product": product },
    { $set: { "items.$.quantity": quantity, updatedAt: Date.now() } },
    { new: true }
  );
};

export const removeCartItem = async (id, product) => {
  return await cartModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: { items: { product: product } },
      $set: { updatedAt: Date.now() },
    },
    { new: true }
  );
};

export const deleteCart = async (id) => {
  return await cartModel.findByIdAndDelete(id);
};
