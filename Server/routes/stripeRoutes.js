const express = require("express")
const {
  checkoutPage,
  successPage,
  cancelPage,
  payment
} = require("../controllers/stripeController")
const { auth } = require("../middlewares/authMiddleware")

const stripeRouter = express.Router()



stripeRouter.get("/create-checkout-session/:id",auth, checkoutPage)
stripeRouter.post("/create-checkout-session/:id",auth, payment)
stripeRouter.get("/success/:blogId",auth, successPage)
stripeRouter.get("/cancel",auth, cancelPage)

module.exports = stripeRouter