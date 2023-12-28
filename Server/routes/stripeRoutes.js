// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const blogModel = require("../models/blog")

const express = require('express');
const router = express.Router();
const YOUR_DOMAIN = "http://localhost:5000/app/v1/payment"
const stripe = require('stripe')('sk_test_51ORp3DSJSPX5dTZ8v5ZIomzf7YKYU2xvI5gLw435xWsanm97l3L5EJRzYFbs1JwmloGxsGRiLKVxfOG5lOpI64vP00TnXeVITX')


router.get("/create-checkout-session/:id", async (req, res) => {
  let {
    id
  } = req.params
  const blog = await blogModel.findById(id).populate("author")
  res.render("Checkout/checkout", {
    blog
  })
})


// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys



router.post('/create-checkout-session/:id', async (req, res) => {
  const blog = await blogModel.findById(req.params.id).populate("author");

  const customer = await stripe.customers.create({
    name: 'Niraj Shah',
    address: {
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: blog.price,
    currency: 'inr',
    description: 'Buying blogs.',
  });

  const invoiceItem = await stripe.invoiceItems.create({
    customer: 'Niraj Shah',
    amount: blog.price,
    currency: 'inr',
    description: 'One-time setup fee',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: blog.title,
        },
        unit_amount: blog.price * 100,
      },
      quantity: 1,
    }, ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
    customer_email: 'niraj1@example.com', // Provide customer's email directly if available
  });

  res.redirect(303, session.url);
});


router.get("/success", (req, res) => {
  res.render("Checkout/success")
})
router.get("/cancel", (req, res) => {
  res.render("Checkout/cancel")
})

module.exports = router