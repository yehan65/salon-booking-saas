const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/booking.model");

class WebhookController {
  async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET_LOCAL,
      );

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        // Create booking AFTER successfull payment
        const booking = new Booking({
          customerId: metadata.customerId,
          staffId: metadata.staffId,
          serviceId: metadata.serviceId,
          date: new Date(metadata.date),
          duration: parseInt(metadata.serviceDuration),
          totalPrice: parseFloat(metadata.servicePrice),
          depositAmount: paymentIntent.amount / 100,
          remainingAmount:
            parseFloat(metadata.servicePrice) - paymentIntent.amount / 100,
          status: "confirmed",
          paymentStatus: "deposit_paid",
          paymentIntentId: paymentIntent.id,
          customerNotes: metadata.customerNotes || "",
        });

        await booking.save();

        // await Booking.findByIdAndUpdate(bookingId, {
        //   paymentStatus: "deposit_paid",
        //   status: "confirmed",
        // });
      }
      return res.json({
        success: true,
        received: true,
        message: "Booking created!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, messagae: `Webhook error: ${error}` });
    }
  }
}

const webhookController = new WebhookController();
module.exports = webhookController;
