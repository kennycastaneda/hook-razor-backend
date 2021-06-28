const stripe = require("stripe")(`${process.env.STRIPE_TEST}`);
const SUBSCRIBE = process.env.SUBSCRIBE;
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
   const { quantity } = req.body.data;
   let line_items = [];
   if (quantity > 0) {
      line_items.push({
         price_data: {
            currency: "usd",
            product_data: {
               name: "Razor Cartridge Subscription",
               images: ["https://www.hookrazor.com/images/cartridges.jpg"],
            },
            unit_amount: SUBSCRIBE,
         },
         adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
         },
         quantity: quantity,
      });
   }

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
         allowed_countries: ["US", "CA"],
      },
      line_items,
      mode: "payment",
      success_url: `${process.env.HOOK_DOMAIN}/success`,
      cancel_url: `${process.env.HOOK_DOMAIN}/bag`,
   });

   res.json({ id: session.id });
}

module.exports = {
   create: [asyncErrorBoundary(create)],
};
