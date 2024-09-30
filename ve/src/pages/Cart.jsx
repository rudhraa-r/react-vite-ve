import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";

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
                    </div>
                ))}
            </div>
        </div>
    );
}
