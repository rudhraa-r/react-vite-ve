import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function PricingPage(){


    const [name , setName] = useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');

    const {imgId} = useParams();
    const location = useLocation();

    axios.get(`/uploadDetails/${imgId}`).then(response =>{
        const {data} = response;
            setName(data[0].name);
            setPrice(data[0].price);
            setDescription(data[0].description);
    })

    const addToCart = async (ev) => {
        ev.preventDefault();
        try {
            const cartItem = { imgId, name, description, price };
            await axios.post('/cart', cartItem);
            alert('Item added to cart!');
        } catch (error) {
            console.error('Failed to add to cart', error);
        }
    };
    
    return(
        <div className="container mx-auto mt-8  flex gap-9">

            <div className="image-container w-3/4 ">
                <img src={`https://virtual-exhibition-app.s3.amazonaws.com/`+imgId} alt={name} className="w-full h-auto rounded-lg" />
            </div>
            <div className=" flex flex-col w-56 bg-gray-300 h-auto text-center rounded-2xl shadow-md">
            <h2 className="text-xl bg-gray-00 rounded-lg mt-4 text-center border-b shadow- shadow-gray-700">Name: {name}</h2>
            <p className="text-sm rounded-lg  text-gray-700 border-b mt-2 ">Description: {description}</p>
            <p className="text-lg text-gray-800 mt-2 border-b font-semibold">Price: ₹{price}</p>
            <div className="flex flex-col-reverse ">
            <Link to={`/`}>
            <button className="p-2 text-white rounded-2xl bg-teal-900 w-44 space-x-5 m-5 ">Buy Now</button>
            </Link>
            <Link to={`/`}>
            <button onClick={addToCart} className="p-2 text-white rounded-2xl bg-teal-900 w-44 space-x-5 m-5">Add to Cart</button>
            </Link>
            </div>
            </div>
        </div>
    )
}  