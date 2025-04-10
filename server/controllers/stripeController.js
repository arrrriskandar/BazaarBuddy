import {
  generateAccountLink,
  createExpressAccount,
  createStripeCheckoutSession,
} from "../services/stripeService.js";

export async function createAccountLinkController(req, res) {
  try {
    const account = await createExpressAccount(req.body);
    const accountLinkUrl = await generateAccountLink(account.id);
    res.json({ url: accountLinkUrl });
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    res.status(500).json({ error: "Failed to create account link" });
  }
}

export async function createStripeCheckoutSessionController(req, res) {
  try {
    const session = await createStripeCheckoutSession(req.body);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    throw new Error("Stripe Checkout session creation failed");
  }
}
