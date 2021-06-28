const stripe = require("stripe")(`${process.env.STRIPE_TEST}`);
const PRICE = process.env.PRICE;
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
   const { blackQuantity, whiteQuantity } = req.body.data;
   console.log(PRICE);

   let line_items = [];
   if (blackQuantity > 0) {
      line_items.push({
         price_data: {
            currency: "usd",
            product_data: {
               name: "Hook Razor Black",
               images: ["https://www.hookrazor.com/images/hook-shop-3.jpg"],
            },
            unit_amount: "price_1J4tKVL1APTgfm61Yz5QQ0Mq",
         },
         adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
         },
         quantity: blackQuantity,
      });
   }
   if (whiteQuantity > 0) {
      line_items.push({
         price_data: {
            currency: "usd",
            product_data: {
               name: "Hook Razor Black",
               images: [
                  "https://www.hookrazor.com/images/hook-shop-3-white.jpg",
               ],
            },
            unit_amount: "price_1J7MoZL1APTgfm61EWDOAQLR",
         },
         adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
         },
         quantity: whiteQuantity,
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
