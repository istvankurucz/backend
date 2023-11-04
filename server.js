import express from "express";
import Stripe from "stripe";
import cors from "cors";
import "dotenv/config";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET);

// Middlewares
app.use(express.json());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);

app.post("/create-checkout-session", async (req, res) => {
	const { user, basket } = req.body;

	const lineItems = basket.map((item) => ({
		price: item.price.id,
		quantity: item.quantity,
	}));

	try {
		const session = await stripe.checkout.sessions.create({
			customer: user.stripeId,
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/success`,
			cancel_url: `${process.env.CLIENT_URL}/cancel`,
		});

		return res.send(session.url);
	} catch (e) {
		return res.end("Error creating the checkout session.\n", e);
	}
});

app.listen(3000, () => console.log("Running on port 3000"));
