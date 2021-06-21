const stripe = require("stripe")(`${process.env.STRIPE_TEST}`);
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
         allowed_countries: ["US", "CA"],
      },
      line_items: [
         {
            price_data: {
               currency: "usd",
               product_data: {
                  name: "Hook Razor",
                  images: ["https://www.hookrazor.com/images/hook-shop-4.jpg"],
               },
               unit_amount: 1500,
            },
            adjustable_quantity: {
               enabled: true,
               minimum: 1,
               maximum: 10,
            },
            quantity: req.body.data,
         },
      ],
      mode: "payment",
      success_url: `${process.env.HOOK_DOMAIN}/success`,
      cancel_url: `${process.env.HOOK_DOMAIN}/cancel`,
   });

   res.json({ id: session.id });
}

module.exports = {
   create: [asyncErrorBoundary(create)],
};
