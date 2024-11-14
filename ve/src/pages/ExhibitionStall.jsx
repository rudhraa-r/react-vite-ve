import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Image from "../Image";

export default function ExhibitionStall() {
  const { stallId } = useParams();
  const [stall, setStall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/stall/${stallId}`).then(response => {
      setStall(response.data);
    });
  }, [stallId]);

  const getImageName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const openARView = () => {
    // Store stall data in localStorage before opening AR view
    localStorage.setItem("stallData", JSON.stringify(stall));
    // Open AR view in a new window
    window.open(`/ar.html?stallId=${stallId}`, '_blank');
  };

  if (!stall) {
    return <div>Loading...</div>; // Optional loading state while the data is being fetched
  }

  return (
    <div className="stall-container">
      <div className="stall-info">
        <h1 className=" bg-gray-100 text-center w-auto shadow-lg text-2xl p-3.5 rounded-lg   items-center">{stall.name}</h1>
        <button className="bg-teal-900 shadow-2xl text-2xl p-3.5 rounded-2xl w-auto m-7 text-white" onClick={openARView}>View AR Mode</button>
        <div className="photos-grid rounded-2xl">
          {stall.photos && stall.photos.map((link) => (
            <Link to={`/pricing/${getImageName(link)}`} key={link}>
              <Image src={link} className="stall-photo rounded-2xl shadow-2xl" />
            </Link>
          ))}
          {stall.videos && stall.videos.map((link) => (
            <Link to={`/pricing/${getImageName(link)}`} key={link}>
              <video src={link} className="stall-photo rounded-2xl shadow-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
