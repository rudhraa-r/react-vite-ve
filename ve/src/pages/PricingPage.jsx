import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function PricingPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [fileType, setFileType] = useState(''); // To handle image/video
  const { imgId } = useParams();

  useEffect(() => {
    axios.get(`/uploadDetails/${imgId}`).then(response => {
      const { data } = response;
      setName(data[0].name);
      setPrice(data[0].price);
      setDescription(data[0].description);

      // Extract file type from extension
      const extension = imgId.split('.').pop();
      if (extension === 'mp4') {
        setFileType('video');
      } else {
        setFileType('image');
      }
    });
  }, [imgId]);

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

  return (
    <div className="container mx-auto mt-8 flex gap-9">
      <div className="media-container w-3/4">
        {fileType === 'image' ? (
          <img
            src={`https://virtual-exhibition-app.s3.amazonaws.com/${imgId}`}
            alt={name}
            className="w-auto h-auto rounded-lg"
          />
        ) : (
          <video width="600" controls>
            <source
              src={`https://virtual-exhibition-app.s3.amazonaws.com/videos/${imgId}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="details-container flex flex-col w-56 bg-gray-300 h-auto text-center rounded-2xl shadow-md">
        <h2 className="text-xl mt-4 text-center border-b shadow-gray-700">
          Name: {name}
        </h2>
        <p className="text-sm text-gray-700 border-b mt-2">
          Description: {description}
        </p>
        <p className="text-lg text-gray-800 mt-2 border-b font-semibold">
          Price: ₹{price}
        </p>
        <div className="flex flex-col-reverse">
          <Link to={`/`}>
            <button className="p-2 text-white rounded-2xl bg-teal-900 w-44 space-x-5 m-5">
              Buy Now
            </button>
          </Link>
          <button onClick={addToCart} className="p-2 text-white rounded-2xl bg-teal-900 w-44 space-x-5 m-5">
            Add to Cart
          </button>
          <a
            href={`ar.html?mediaId=${imgId}&type=${fileType}`}
            target="_blank"
            className="p-2 text-white rounded-2xl bg-teal-900 w-44 space-x-5 m-5"
          >
            AR Mode
          </a>
        </div>
      </div>
    </div>
  );
}
