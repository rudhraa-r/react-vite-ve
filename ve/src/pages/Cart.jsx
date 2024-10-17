import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";
import { Link } from "react-router-dom";
//import { loadStripe } from '@stripe/stripe-js';
//const stripePromise = loadStripe('your_stripe_publishable_key');

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useContext(UserContext);
 
    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await axios.get(`/cart`);
                setCartItems(response.data.items);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                setLoading(false);
            }
        }
        fetchCart();
    },);

    const handleDelete = async (imgId) => {
        await axios.delete(`/cart/${imgId}`);
        setCartItems(cartItems.filter(item => item.imgId !== imgId));
    };

    const grossTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            const response = await axios.post('/create-checkout-session', { cartItems });
            const sessionId = response.data.id;
            
            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });
            if (error) {
                console.error("Error redirecting to checkout:", error);
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (cartItems.length === 0) {
        return <div>Your cart is empty.</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.imgId} className="cart-item flex flex-row gap-4 border-b py-4">
                        <img src={`https://virtual-exhibition-app.s3.amazonaws.com/${item.imgId}`} alt={item.name} className="w-24 h-24 rounded-lg" />
                        <div className="flex flex-col justify-center">
                        
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <p className="text-gray-700">{item.description}</p>
                            <p className="text-lg font-semibold">Price: ₹{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            
                        </div>
                        <button onClick={() => handleDelete(item.imgId)} className="cursor-pointer h-9  text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2">                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <div className="text-lg font-semibold mt-4">
                Gross Total: ₹{grossTotal}
            </div>
            
            <button onClick={handleCheckout}  className="primary space-x-5 m-5 ">Buy All Items Now</button>
            
        </div>
    );
}
