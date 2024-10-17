import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import Image from "../Image";

export default function ExhibitionStall(){

    

    const {stallId} =useParams();
    const [stall , setStall] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() =>{
        axios.get(`/stall/${stallId}`).then(response =>{
            setStall(response.data);
        })
    },[stallId] )

    const getImageName = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };



    return(
        <div className="stall-container">
            <div className="stall-info">
                <h1 className="m-7">{stall.name}</h1>
                <div className="photos-grid rounded-2xl ">
                    {stall.photos && stall.photos.map((link) => (
                        <Link to={`/pricing/${getImageName(link)}` }>
                        <Image key={link} src={link} className="stall-photo rounded-2xl shadow-2xl"  />
                        </Link>
                    ))}

                    {stall.videos && stall.videos.map((link) => (
                        <Link to={`/pricing/${getImageName(link)}` }>
                        <video key={link} src={link} className="stall-photo rounded-2xl shadow-2xl"  />
                        </Link>
                    ))}
                </div>
            </div>

            
        </div>
    );
}
