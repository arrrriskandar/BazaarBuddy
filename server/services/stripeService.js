import "dotenv/config";
import Stripe from "stripe";
import { updateUser } from "./userService.js";
import { getOrderReleaseFund } from "./orderService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FE_URL = process.env.FE_URL;

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

  await updateUser(userId, { stripeSellerId: account.id });
  return account;
}

export async function createStripeCustomer(name, email) {
  return await stripe.customers.create({
    name,
    email,
  });
}

export async function generateAccountLink(accountId) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${FE_URL}/sell/product`,
    return_url: `${FE_URL}/sell/product`,
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
      unit_amount: Math.round(item.product.price * 100), // Convert price to cents
    },
    quantity: item.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    customer: buyer.stripeCustomerId,
    mode: "payment",
    payment_intent_data: {
      metadata: {
        buyer: buyer._id,
        seller,
      },
    },
    success_url: `${FE_URL}/payment/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${FE_URL}/payment/fail`,
  });

  return session;
};

export const getChargeId = async (sessionId) => {
  const { payment_intent } = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
  const chargeId = paymentIntent.latest_charge;
  return chargeId;
};

export const releaseFunds = async (orderId) => {
  const order = await getOrderReleaseFund(orderId);
  const chargeId = await getChargeId(order.stripeSessionId);

  try {
    const transfer = await stripe.transfers.create({
      amount: (order.totalPrice - Math.floor(order.totalPrice * 0.1)) * 100,
      currency: "sgd",
      destination: order.seller.stripeSellerId,
      source_transaction: chargeId,
      metadata: {
        orderId: order._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error releasing funds:", error);
  }
};

export async function deleteAccount(accountId) {
  await stripe.accounts.del(accountId);
}
