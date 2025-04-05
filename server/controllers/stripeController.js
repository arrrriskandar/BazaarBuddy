import {
  generateAccountLink,
  createExpressAccount,
} from "../services/stripeService.js";

export async function createAccountLinkController(req, res) {
  try {
    const { userId, email } = req.body;
    const account = await createExpressAccount(email, userId);
    const accountLinkUrl = await generateAccountLink(account.id);
    res.json({ url: accountLinkUrl });
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    res.status(500).json({ error: "Failed to create account link" });
  }
}
