import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function PaymentForm({
  amount,
  bookingId,
  onSuccess,
  onError,
  clientSecret,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    // const response = await fetch("/create-payment-intent", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ amount, bookingId }),
    // });

    // const { clientSecret } = await response.json();

    // Confirm Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Customer Name",
        },
      },
    });

    if (result.error) {
      onError(result.error.message);
      console.error("error in payment form: ", result.error.message);
    } else {
      onSuccess();
    }
    setProcessing(false);
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit}>
        <div style={styles.cardElement}>
          <CardElement />
        </div>
        <button
          type="submit"
          disabled={!stripe || processing}
          style={styles.button}
        >
          {processing ? "Processing..." : `Pay $${amount} Deposit`}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    margin: "10px",
  },
  cardElement: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "600",
  },
};
