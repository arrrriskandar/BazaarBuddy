import "dotenv/config";
import Stripe from "stripe";
import { updateUser } from "./userService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createExpressAccount(accountData) {
  const { userId, email } = accountData;
  const account = await stripe.accounts.create({
    type: "express",
    country: "SG",
    email,
    capabilities: {
      transfers: { requested: true },
    },
    settings: {
      payouts: {
        schedule: {
          interval: "manual",
        },
      },
    },
    metadata: {
      userId,
    },
  });

  await updateUser(userId, { stripeId: account.id });
  return account;
}

export async function generateAccountLink(accountId) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "http://localhost:3000/sell/product",
    return_url: "http://localhost:3000/sell/product",
    type: "account_onboarding",
  });
  return accountLink.url;
}

export const createStripeCheckoutSession = async (checkOutData) => {
  const { buyer, seller, items } = checkOutData;
  const lineItems = items.map((item) => ({
    price_data: {
      currency: "sgd",
      product_data: {
        name: item.product.name,
        description: item.product.description,
        images: [item.product.images], // Ensure you have the image URL
      },
      unit_amount: item.product.price * 100, // Convert price to cents
    },
    quantity: item.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: buyer.email,
    mode: "payment",
    payment_intent_data: {
      metadata: {
        buyer: buyer._id,
        seller,
      },
    },
    success_url: `http://localhost:3000/payment/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/payment/fail",
  });

  return session;
};
