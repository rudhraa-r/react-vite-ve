import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

export default function ExhibitionStall(){

    const {stallId} =useParams();
    const [stall , setStall] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() =>{
        axios.get(`/stall/${stallId}`).then(response =>{
            setStall(response.data);
        })
    },[stallId] )

    const handlePhotoClick = (link) => {
        setSelectedPhoto(link);
    };

    const closeOverlay = () => {
        setSelectedPhoto(null);
    };


    return(
        <div className="stall-container">
            <div className="stall-info">
                <h1 className="m-7">{stall.name}</h1>
                <div className="photos-grid rounded-2xl ">
                    {stall.photos && stall.photos.map((link) => (
                        <img key={link} src={'http://localhost:4000/uploads/'+link} className="stall-photo rounded-2xl shadow-2xl" onClick={() => handlePhotoClick(link)} />
                    ))}
                </div>
            </div>

            {selectedPhoto && (
                <div className="overlay shadow-2xl" onClick={closeOverlay}>
                    <div className="overlay-content shadow-2xl rounded-2xl justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeOverlay}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 -mx-2 -my-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </button>
                        <img src={'http://localhost:4000/uploads/'+selectedPhoto} alt="Selected" className="selected-photo shadow-2xl rounded-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
