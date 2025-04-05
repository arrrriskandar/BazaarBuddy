import "dotenv/config";
import Stripe from "stripe";
import { updateUser } from "../services/userService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createExpressAccount(email, userId) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "SG",
    email,
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
