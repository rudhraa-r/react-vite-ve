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
        <div className="container mx-auto mt-8 place-items-center">

            <div className="image-container">
                <img src={`https://virtual-exhibition-app.s3.amazonaws.com/`+imgId} alt={name} className="w-full h-auto rounded-lg" />
            </div>
            <h2 className="text-xl bg-gray-300 rounded-lg mt-4">Name: {name}</h2>
            <p className="text-sm rounded-lg  text-gray-700 mt-2">Description: {description}</p>
            <p className="text-lg text-gray-800 mt-2 font-semibold">Price: ₹{price}</p>
            <div className="flex gap-5">
            <Link to={`/`}>
            <button className="primary space-x-5 m-5 ">Buy Now</button>
            </Link>
            <Link to={`/`}>
            <button onClick={addToCart} className="primary space-x-5 m-5">Add to Cart</button>
            </Link>
            </div>
            
        </div>
    )
}  