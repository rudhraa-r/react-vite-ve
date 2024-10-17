import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from "react";
import axios from "axios";

const stripePromise = loadStripe("your-publishable-key-here");

function CheckoutForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data: { clientSecret } } = await axios.post("/api/checkout", { amount: totalAmount });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });

    if (result.error) {
      setPaymentError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment Successful');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay ₹{totalAmount}</button>
      {paymentError && <div>{paymentError}</div>}
    </form>
  );
}

export default function StripeCheckout({ totalAmount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalAmount={totalAmount} />
    </Elements>
  );
}
